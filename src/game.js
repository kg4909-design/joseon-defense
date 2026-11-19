'use strict';
// ====== 조선의 위기 디펜스 : 클라이언트 + 호스트 시뮬레이션 ======
const W = 960, H = 540;
const Z = 0.72, SPS = 0.66; // 시야 넓히기(줌) / 캐릭터 크기 비율
const $ = (id) => document.getElementById(id);
const Q = new URLSearchParams(location.search);
const FAST = Q.get('fast') ? +Q.get('fast') : 0; // 테스트용: 전투 시간(초)
const DEFAULT_RELAY = 'wss://YOUR-WORKER.workers.dev/ws'; // ← 배포 후 README 안내대로 교체 (게임 화면에서도 입력 가능)

// ---------- 네트워크 ----------
const Net = {
  ws: null, id: 'me', host: true, mode: 'single', room: '', peers: ['me'],
  onData: () => {}, onJoin: () => {}, onLeave: () => {}, onClosed: () => {},
  connect(url, room, create) {
    return new Promise((res, rej) => {
      let ws; try { ws = new WebSocket(url + (url.includes('?') ? '&' : '?') + 'room=' + encodeURIComponent(room) + (create ? '&create=1' : '')); } catch (e) { rej('주소가 올바르지 않아요'); return; }
      let ok = false; Net.ws = ws;
      ws.onmessage = (ev) => { const m = JSON.parse(ev.data);
        if (m.sys === 'hello') { ok = true; Net.id = m.id; Net.host = m.host === m.id; Net.mode = 'online'; Net.room = room; Net.peers = m.peers; res(); }
        else if (m.sys === 'err') rej({ exists: '이미 있는 방 코드예요', noroom: '그런 방이 없어요', full: '방이 가득 찼어요(최대 4명)' }[m.code] || '입장 실패');
        else if (m.sys === 'join') { Net.peers.push(m.id); Net.onJoin(m.id); }
        else if (m.sys === 'leave') { Net.peers = Net.peers.filter((x) => x !== m.id); Net.onLeave(m.id); }
        else if (m.sys === 'closed') Net.onClosed();
        else if (m.d) Net.onData(m.from, m.d); };
      ws.onerror = () => { if (!ok) rej('연결에 실패했어요. 릴레이 주소를 확인해 주세요'); };
      ws.onclose = () => { if (ok) Net.onClosed(); };
    });
  },
  send(to, d) { if (Net.ws && Net.ws.readyState === 1) Net.ws.send(JSON.stringify({ to, d })); }
};

// ---------- 병종 / 적 / 카드 정의 ----------
const UT = { // 소집 병사
  bow:    { n: '궁병',   c: '#e6c84a', ch: '궁', rg: 190, dmg: 9,  rt: 1.0, aoe: 0 },
  spear:  { n: '창병',   c: '#58b86a', ch: '창', rg: 130, dmg: 22, rt: 0.8, aoe: 0 },
  gun:    { n: '조총병', c: '#d9d9d9', ch: '총', rg: 230, dmg: 40, rt: 0.4, aoe: 0 },
  cannon: { n: '화포',   c: '#e98a3c', ch: '포', rg: 210, dmg: 30, rt: 0.35, aoe: 48 },
  cav:    { n: '기마병', c: '#6fb3ff', ch: '마', rg: 120, dmg: 12, rt: 2.0, aoe: 0 }
};
const LVM = [1, 2.3, 5.2, 12];
const ROLE = { // 영웅(플레이어) — 무기마다 확실히 다른 장점
  archer: { n: '궁수',   c: '#f2d65a', rg: 300, dmg: 12, rt: 1.5, hp: 120, sp: 120, aoe: 0,  tag: ['리치 길다', '관통 3'], d: '멀리서 일직선의 적을 꿰뚫어요' },
  militia:{ n: '의병',   c: '#6fd07d', rg: 100, dmg: 18, rt: 1.4, hp: 200, sp: 125, aoe: 0,  tag: ['베기 광역', '튼튼'], d: '앞의 적을 한꺼번에 베어요' },
  monk:   { n: '승병',   c: '#d98cff', rg: 85,  dmg: 26, rt: 0.9, hp: 260, sp: 110, aoe: 0,  tag: ['튕겨냄', '기절'], d: '철퇴로 적을 멀리 튕겨내요' },
  gunner: { n: '화포수', c: '#ff9a5a', rg: 250, dmg: 38, rt: 0.55, hp: 110, sp: 105, aoe: 55, tag: ['폭발 범위', '큰 한 방'], d: '포탄이 터져 무리를 날려요' }
};
const DIFF = { easy: { n: '쉬움', hp: 0.7, sp: 0.65, dm: 0.65, fd: 50, hh: 1.3 }, normal: { n: '보통', hp: 1, sp: 0.9, dm: 1, fd: 0, hh: 1 }, hard: { n: '어려움', hp: 1.3, sp: 1.2, dm: 1.3, fd: -20, hh: 0.9 } };
const ET = { // 적
  grunt:  { n: '보병',   hp: 22,  sp: 38, dm: 6,  r: 9,  st: 0,   f: 8,  xp: 1 },
  shoot:  { n: '조총·궁수', hp: 18, sp: 34, dm: 5,  r: 8,  st: 120, f: 9,  xp: 1 },
  cav:    { n: '기병',   hp: 55,  sp: 82, dm: 9,  r: 11, st: 0,   f: 10, xp: 2 },
  tank:   { n: '중갑',   hp: 150, sp: 26, dm: 14, r: 14, st: 0,   f: 18, xp: 4 },
  camp:   { n: '보급창고', hp: 700, sp: 0, dm: 0, r: 26, st: 0, f: 30, xp: 8 },
  boss:   { n: '적장',   hp: 1900, sp: 22, dm: 40, r: 24, st: 0,  f: 100, xp: 30 }
};
const CARDS = [
  { id: 'horse',  n: '말',      d: '이동 속도 +25%', t: '기동력', ref: '' },
  { id: 'hwacha', n: '화차',    d: '8초마다 주변 적에게 화살 비를 쏟아요', t: '보충: 여러 발을 쏘는 수레형 무기', ref: '보충' },
  { id: 'gun',    n: '조총',    d: '공격력 +35%, 사거리 +15%', t: '교과서: 조총은 노끈에 불을 붙여 화약을 터뜨려 쏘는 총(81쪽)', ref: '교 81' },
  { id: 'powder', n: '화약',    d: '공격이 폭발해 주변도 맞아요', t: '화약 무기의 힘', ref: '' },
  { id: 'bow',    n: '활 개량', d: '공격 속도 +25%', t: '꾸준한 훈련', ref: '' },
  { id: 'armor',  n: '갑옷',    d: '최대 체력 +40%, 체력 회복', t: '방어', ref: '' },
  { id: 'wall',   n: '성벽 보수', d: '거점 최대 체력 +20%, 조금 회복', t: '성을 튼튼히', ref: '' },
  { id: 'food',   n: '군량 비축', d: '군량 획득 +30%', t: '보급이 힘', ref: '' },
  { id: 'volun',  n: '의병 모집', d: '무료 병사 2명 즉시 소집', t: '교과서: 백성이 자발적으로 조직한 군대(82쪽)', ref: '교 82' },
  { id: 'rage',   n: '함성 고취', d: '20초 동안 모두의 공격력 +40%', t: '사기 진작', ref: '' },
  { id: 'heal',   n: '의원',    d: '모든 동료 체력 50% 회복', t: '부상자 돌보기', ref: '' },
  { id: 'spear',  n: '회전 창', d: '창이 내 주위를 돌며 적을 베요', t: '무기 · 레벨이 오르면 창이 늘어요', ref: '' },
  { id: 'gong',   n: '징 울림', d: '주기적으로 충격파로 적을 밀쳐내요', t: '무기 · 레벨이 오르면 더 넓고 빨라요', ref: '' },
  { id: 'evo_spear', n: '장창 방진', d: '창이 3개 더 늘고 훨씬 강해져요', t: '진화! 회전 창 Lv5 + 갑옷', ref: '' },
  { id: 'evo_gong', n: '대징 진군', d: '충격파가 더 넓고 빠르고 오래 기절시켜요', t: '진화! 징 울림 Lv5 + 말', ref: '' },
  { id: 'evo_bomb', n: '대완구 진천뢰', d: '폭탄이 두 발, 폭발이 훨씬 커져요', t: '진화! 비격진천뢰 Lv5 + 화약', ref: '' },
  { id: 'evo_hwacha', n: '신기전 화차', d: '화살 비가 2배, 더 자주 쏟아져요', t: '진화! 화차 Lv5 + 활 개량', ref: '' },
  { id: 'bomb',   n: '비격진천뢰', d: '폭탄을 던져 적 무리를 터뜨려요', t: '무기 · 조선의 폭발 무기', ref: '' }
];
const BOSSN = [ // [이름, 설명] 라운드별 적장 — 교과서 밖 보충이므로 교사 확인 필요
  ['고니시 유키나가', '일본군 1군 선봉장'], ['고니시 유키나가', '일본군 1군 선봉장'], ['고니시 유키나가', '일본군 1군 선봉장'], ['도도 다카토라', '일본 수군 장수'], ['와키자카 야스하루', '일본 수군 장수'],
  ['호소카와 다다오키', '일본군 장수'], ['안코쿠지 에케이', '일본군 승려 장수'], ['고니시 유키나가', '일본군 1군 장수'], ['우키타 히데이에', '일본군 총대장'], ['가토 기요마사', '일본군 2군 장수'],
  ['도도 다카토라', '일본 수군 장수'], ['고니시 유키나가', '일본군 장수'], ['가토 기요마사', '일본군 장수'], ['구로다 나가마사', '일본군 장수'], ['구루시마 미치후사', '일본 수군 장수'],
  ['구루시마 미치후사', '일본 수군 장수'], ['가토 기요마사', '일본군 장수'], ['시마즈 요시히로', '일본군 장수'], ['고니시 유키나가', '일본군 장수'], ['시마즈 요시히로', '일본군 장수'],
  ['아민', '후금군 장수'], ['아민', '후금군 장수'], ['아민', '후금군 장수'], ['아민', '후금군 장수'], ['아민', '후금군 장수'],
  ['용골대', '청군 장수'], ['홍타이지', '청의 황제'], ['마푸타', '청군 장수'], ['용골대', '청군 장수'], ['홍타이지', '청의 황제']
];
const WEAP = { spear: 1, gong: 1, bomb: 1, hwacha: 1 };
const EVENTS = [
  { t: '작전 회의', q: '어떻게 할까요?', o: [{ n: '성을 굳게 지킨다', d: '거점 체력 +25% 회복', k: 'wall' }, { n: '나가서 반격한다', d: '30초간 모든 공격력 +40%', k: 'atk' }] },
  { t: '백성의 도움', q: '백성이 도움을 청합니다!', o: [{ n: '백성을 보호한다', d: '군량 +80', k: 'food' }, { n: '의병으로 받아들인다', d: '무료 병사 3명 소집', k: 'volun' }] },
  { t: '정찰 보고', q: '적의 움직임을 알았어요!', o: [{ n: '길목을 막는다', d: '25초간 적 이동 속도 -40%', k: 'slow' }, { n: '기습 공격', d: '화면의 적 일부에게 큰 피해', k: 'raid' }] }
];

// ---------- 지형 / 길 ----------
const THEME = { plain: ['#cde8e4', '#e8dfbf'], mount: ['#d0e6e0', '#dedcbb'], sea: ['#cfe6ea', '#a9d3d6'], river: ['#d0e8e2', '#cfe0c4'] };
// 라운드 목표: d=성 수성 / e=탈출 / s=버티기 / b=적장 격파 / r=기습(보급창고 파괴)
const ROUND_OBJ = ['d', 'e', 's', 'b', 'b', 'd', 'r', 'r', 'd', 'd', 's', 'd', 'd', 'b', 's', 's', 'r', 'e', 'r', 'b', 'd', 'd', 's', 'd', 's', 'e', 'd', 's', 'b', 'd'];
const OBJINFO = { d: { n: '성을 지켜라', ic: '🏯', t: '성이 무너지지 않게 시간이 끝날 때까지 지켜요' }, e: { n: '탈출하라', ic: '🚩', t: '포위를 뚫고 깃발을 지나 도성으로 달려가요. 적에게 둘러싸이면 느려져요!' }, s: { n: '끝까지 버텨라', ic: '⏳', t: '쓰러지지 않고 시간이 끝날 때까지 버텨요' }, b: { n: '적장을 쓰러뜨려라', ic: '⚔️', t: '나타나는 적장을 쓰러뜨리면 승리해요' }, r: { n: '보급창고를 부숴라', ic: '🔥', t: '적의 보급창고를 모두 부수면 승리해요' } };
const ESC_STORY = { 1: '동래성이 함락되었다… 장수는 포위를 뚫고, 왜의 침략 소식을 도성(한양)에 알리러 필사적으로 달린다!' };
const objText = (rd, ob) => (ob === 'e' && ESC_STORY[rd]) || OBJINFO[ob].t;
const WORLD = { d: [2400, 1500], b: [2400, 1500], s: [2400, 1500], e: [6000, 1400], r: [3000, 1800] };
const CR = 50; // 성 반경
function slotPos(i, ax, ay) { const ring = Math.floor(i / 6), a = (i % 6) / 6 * Math.PI * 2 + ring * 0.52 - Math.PI / 2, r = [62, 98, 134][ring]; return [ax + Math.cos(a) * r, ay + Math.sin(a) * r * 0.78 + 8]; }
const SLOTN = 18, UPC = [70, 110, 170, 250, 350];
const slotsOpen = (u) => Math.min(SLOTN, 8 + 2 * (u || 0));

// =====================================================================
//  호스트 시뮬레이션 (방장 기기에서만 실행)
// =====================================================================
let G = null; // 호스트 상태
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (n) => Math.floor(Math.random() * n);
function newG() {
  return { ph: 'lobby', rd: 0, pl: {}, order: [], sel: { start: 0, dur: FAST || 300 }, dif: DIFF.normal, paused: false, shots: [], fx: [], bonus: 0, log: [], ans: {}, res: null, ev: null, nid: 1, sn: 0, souls: [], pj: [], magT: 0, nl: 0 };
}
function addPlayer(id, name, role) {
  const R0 = ROLE[role] || ROLE.archer;
  G.pl[id] = { id, name: name || '의병' + (G.order.length + 1), role: role || 'archer', x: 300, y: 270, hp: R0.hp, mx: R0.hp, lv: 1, down: 0, cd: 0, atk: 0, cards: { spear: 1 }, offer: null, offT: 0, mvx: 0, mvy: 0, st: {}, fz: 0 };
  G.order.push(id);
}
function heroStats(p) { // 카드 반영 스탯
  const b = ROLE[p.role], c = p.cards, n = (k) => c[k] || 0;
  return { dmg: b.dmg * (1 + 0.35 * n('gun')) * (G.buffAtk > 0 ? 1.4 : 1), rg: b.rg * (1 + 0.15 * n('gun')), rt: b.rt * (1 + 0.25 * n('bow')), sp: b.sp * 1.2 * (1 + 0.25 * n('horse')), aoe: Math.max(b.aoe, n('powder') ? 34 + 8 * n('powder') : 0) };
}
function roadY(x, ww, wh) { const k = x / ww * 12, i = Math.min(11, Math.floor(k)), f = k - i, y0 = wh * 0.5 + Math.sin(i * 1.3) * 130, y1 = wh * 0.5 + Math.sin((i + 1) * 1.3) * 130; return y0 + (y1 - y0) * f; }
function startRound(i) {
  const rd = R[i], P = G.sel.dur, i0 = i - (i < 10 ? 0 : i < 20 ? 10 : i < 25 ? 20 : 25), ob = ROUND_OBJ[i];
  G.rd = i; G.paused = false; G.ph = 'brief'; G.res = null; G.ans = {}; G.ev = null; G.obj = ob; G.castle = ob === 'd' || ob === 'b';
  G.path = rd.th; G.t = 0; G.dur = ob === 'e' ? Math.min(P, 150) : P; G.en = []; G.shots = []; G.fx = [];
  const [ww, wh] = WORLD[ob]; G.ww = ww; G.wh = wh; G.ax = ob === 'e' ? 160 : ob === 'r' ? 300 : ww / 2; G.ay = ob === 'e' ? roadY(160, ww, wh) : ob === 'r' ? wh / 2 + 150 : wh / 2;
  const k = 2 + (i >= 13 ? 1 : 0) + (i >= 22 ? 1 : 0), b0 = rnd(0, 6.283); G.dirs = []; for (let j = 0; j < k; j++) G.dirs.push(b0 + j * 6.283 / k);
  G.lives = G.castle ? 99 : G.order.length + 2; G.waveT = 22; G.gi = 0; G.bossOut = false; G.bossDead = false; G.campPos = [];
  G.goals = ob === 'e' ? [0.2, 0.4, 0.6, 0.8, 0.96].map((f) => [ww * f, roadY(ww * f, ww, wh)]) : [];
  G.runX = 0; G.souls = []; G.pj = []; G.magT = 0; G.nl = 0; G.nIn = false; G.evR = null; G.evShow = 0; G.units = new Array(SLOTN).fill(null); G.sumN = 0; G.sumMiss = 0; G.buffAtk = 0; G.slowT = 0; G.evDone = [false, false];
  G.baseMax = Math.round(600 * (1 + 0.2 * (G.wallN || 0))); G.baseHp = G.baseMax;
  G.food = 110 + G.bonus + G.dif.fd; G.bonus = 0; G.foodMul = 1; G.spawnT = 1.5; G.bossDone = false; G.xp = 0; G.need = 8; G.crates = []; G.crateT = 5; G.upg = 0; G.tt = 1;
  const hs = (1 + 0.09 * i) * (rd.df ? 1.1 : 1) * G.dif.hp;
  if (ob === 'r') { const n = 3 + (i >= 16 ? 1 : 0), pos = [[ww * 0.42, wh * 0.26], [ww * 0.72, wh * 0.7], [ww * 0.88, wh * 0.28], [ww * 0.55, wh * 0.88]]; for (let j = 0; j < n; j++) { G.campPos.push(pos[j]); spawn('camp', hs * 0.9, pos[j]); } G.campTotal = n; }
  if (ob !== 'e') for (let j = 0; j < Math.min(5, Math.floor(i0 / 4)); j++) doSummon(true);
  G.order.forEach((id, n) => { const p = G.pl[id]; p.cards = { spear: 1 }; p.lv = 1; p.mx = Math.round(ROLE[p.role].hp * G.dif.hh * (1 + 0.4 * (p.cards.armor || 0))); p.hp = p.mx; p.down = 0; p.cd = 0; p.offer = null; p.fz = 3; const a = n * 1.2; if (G.castle) { p.x = G.ax - 120 + Math.cos(a) * 30; p.y = G.ay + 70 + Math.sin(a) * 40; } else { p.x = G.ax + Math.cos(a) * 60; p.y = G.ay + 110 + Math.sin(a) * 40; } });
}
function beginBattle() { G.ph = 'battle'; }
function summonCost() { return Math.round(40 * (1 + 0.1 * G.sumN)); }
function doSummon(free) {
  let slot = -1; for (let i = 0; i < slotsOpen(G.upg); i++) if (!G.units[i]) { slot = i; break; } if (slot < 0) return false;
  const cost = summonCost(); if (!free && G.food < cost) return false;
  const rd = R[G.rd], clueU = CLUE[rd.cl].u, w = {};
  const pool = G.rd < 20 ? ['bow', 'spear', 'gun', 'cannon', 'cav'] : ['bow', 'spear', 'gun', 'cannon', 'cav'];
  for (const k of pool) { w[k] = 1; if (k === clueU) w[k] *= 2.6; if (G.units.some((u) => u && u.t === k && u.lv === 1)) w[k] *= 1.5; }
  if (G.sumMiss >= 3) for (const k of pool) if (G.units.some((u) => u && u.t === k)) w[k] *= 3;
  let tot = 0; for (const k in w) tot += w[k]; let x = Math.random() * tot, pick = 'bow'; for (const k in w) { x -= w[k]; if (x <= 0) { pick = k; break; } }
  const pair = G.units.some((u) => u && u.t === pick && u.lv === 1); G.sumMiss = pair ? 0 : G.sumMiss + 1;
  G.units[slot] = { t: pick, lv: 1, cd: rnd(0, 0.5) };
  if (!free) { G.food -= cost; G.sumN++; }
  { const q = slotPos(slot, G.ax, G.ay); G.fx.push([q[0], q[1], 26, 'sum']); }
  return true;
}
function doMerge(a, b) {
  if (a === b) return; const A = G.units[a], B = G.units[b];
  if (!A) return;
  if (!B) { G.units[b] = A; G.units[a] = null; return; }
  if (A.t === B.t && A.lv === B.lv && B.lv < 4) { B.lv++; G.units[a] = null; { const q = slotPos(b, G.ax, G.ay); G.fx.push([q[0], q[1], 34, 'merge']); } }
  else { G.units[a] = B; G.units[b] = A; }
}
function applyCard(p, id) {
  p.cards[id] = (p.cards[id] || 0) + 1;
  if (id === 'armor') { const old = p.mx; p.mx = Math.round(ROLE[p.role].hp * G.dif.hh * (1 + 0.4 * p.cards.armor)); p.hp = Math.min(p.mx, p.hp + (p.mx - old) + p.mx * 0.3); }
  if (id === 'wall') { G.baseMax = Math.round(G.baseMax * 1.2); G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.12); G.wallN = (G.wallN || 0) + 1; }
  if (id === 'food') G.foodMul += 0.3;
  if (id === 'rage') G.buffAtk = 20;
  if (id === 'volun') { doSummon(true); doSummon(true); }
  if (id === 'heal') for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.5); }
}
const EVO = { spear: 'armor', gong: 'horse', bomb: 'powder', hwacha: 'bow' };
const POOL = { spear: 1, gong: 1, bomb: 1, hwacha: 1, gun: 1, powder: 1, bow: 1, horse: 1, armor: 1 }; // 무기 4 + 능력 5 (나머지는 상자/버튼으로)
function offerCards(p) { const ids = CARDS.filter((c) => POOL[c.id] && (p.cards[c.id] || 0) < 5).map((c) => c.id); const o = []; for (const w in EVO) if ((p.cards[w] || 0) >= 5 && (p.cards[EVO[w]] || 0) >= 1 && !p.cards['evo_' + w]) { o.push('evo_' + w); break; }
  const haveW = Object.keys(WEAP).some((k) => p.cards[k]); const wl = ids.filter((k) => WEAP[k]); if (!haveW && wl.length) { const k = wl[rint(wl.length)]; o.push(k); ids.splice(ids.indexOf(k), 1); }
  while (o.length < 3 && ids.length) { const k = ids.splice(rint(ids.length), 1)[0]; o.push(k); } 
  // 더 올릴 카드가 없으면 회복·보급 같은 선택지로 채워요 (게임이 멈추지 않게)
  const fb = ['heal', 'rage', G.obj !== 'e' ? 'food' : null, G.obj !== 'e' ? 'volun' : null, G.castle ? 'wall' : null].filter(Boolean); while (o.length < 3 && fb.length) o.push(fb.splice(rint(fb.length), 1)[0]);
  p.offer = o; p.offT = 14; }
function applyEvent(k) {
  if (k === 'camp') for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.35); }
  if (k === 'wall') G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.25);
  if (k === 'atk') G.buffAtk = 30;
  if (k === 'food') G.food += 80;
  if (k === 'volun') { doSummon(true); doSummon(true); doSummon(true); }
  if (k === 'slow') G.slowT = 25;
  if (k === 'raid') for (const e of G.en) if (Math.random() < 0.6) { e.hp -= 90; G.fx.push([e.x, e.y, 20, 'hit']); }
}
function spawn(type, hs, pos) {
  const T = ET[type], np = G.order.length, sc = hs * (type === 'boss' ? (1 + 0.5 * (np - 1)) : 1);
  const el = type !== 'boss' && type !== 'camp' && Math.random() < Math.min(0.14, 0.015 + 0.004 * G.rd + 0.06 * (G.t / G.dur)), hm = el ? 2.8 : 1;
  const e = { el: el ? 1 : 0, id: G.nid++, t: type, hp: T.hp * sc * hm, mx: T.hp * sc * hm, sp: T.sp * 1.2 * rnd(0.9, 1.1), st: 0, x: pos[0], y: pos[1], ef: 0, ox: rnd(-34, 34), oy: rnd(-26, 26), ro: rnd(0, 36), gt: rnd(2, 5) };
  if (type === 'shoot') { const gf = CH[R[G.rd].ch].foe === '왜군'; e.rg = gf ? 380 : 260; e.pk = gf ? 'gun' : 'bow'; e.gt = rnd(1, 3); }
  G.en.push(e); return e;
}
function clampW(x, y, m) { m = m || 30; return [Math.max(m, Math.min(G.ww - m, x)), Math.max(m, Math.min(G.wh - m, y))]; }
function aliveHeroes() { return G.order.map((id) => G.pl[id]).filter((p) => !(p.down > 0)); }
function spawnPos() {
  if (G.castle) { const a = G.dirs[rint(G.dirs.length)] + rnd(-0.45, 0.45); return clampW(G.ax + Math.cos(a) * 880, G.ay + Math.sin(a) * 600, 24); }
  const hs = aliveHeroes(); if (!hs.length) return null;
  for (let k = 0; k < 8; k++) { const h = hs[rint(hs.length)], rr0 = Math.random(), a = G.obj === 'e' ? (rr0 < 0.5 ? rnd(-0.8, 0.8) : rr0 < 0.75 ? Math.PI + rnd(-0.6, 0.6) : (Math.random() < 0.5 ? -1.5 : 1.5) + rnd(-0.4, 0.4)) : rnd(0, 6.283), q = clampW(h.x + Math.cos(a) * 780, h.y + Math.sin(a) * 520, 24); if (hs.every((p) => Math.hypot(p.x - q[0], p.y - q[1]) > 620)) return q; }
  return null;
}
function pickType(rd) { const r = Math.random(), cvw = rd.cl === 'cav' ? 0.2 : 0.1, prog = G.t / G.dur; return r < 0.5 - cvw ? 'grunt' : r < 0.72 ? 'shoot' : r < 0.72 + cvw ? 'cav' : (prog > 0.25 && r < 0.97) ? 'tank' : 'grunt'; }
function gainXp(v) {
  G.xp += v; while (G.xp >= G.need) { G.xp -= G.need; G.need = Math.round(G.need * 1.28 + 3); for (const id of G.order) { const p = G.pl[id]; p.lv++; G.fx.push([p.x, p.y, 60, 'lvl']); if (!p.offer) offerCards(p); } }
}
function nearestHero(x, y, rg) { let b = null, bd = rg * rg; for (const p of aliveHeroes()) { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; b = p; } } return b; }
function enemyDeath(e) {
  const T = ET[e.t]; if (e.t === 'boss') G.bossDead = true; if (e.t === 'camp') G.fx.push([e.x, e.y, 60, 'boom']); G.food += Math.round(T.f * 0.35 * G.foodMul * (e.t === 'boss' ? 3 : 1)) + (Math.random() < 0.3 ? 1 : 0); G.souls.push({ x: e.x + rnd(-8, 8), y: e.y + rnd(-8, 8), v: T.xp * (e.el ? 4 : 1) }); if (G.souls.length > 300) gainXp(G.souls.shift().v); if (e.el && Math.random() < 0.4 && G.crates.length < 5) G.crates.push({ x: e.x, y: e.y, k: Math.random() < 0.3 ? 'magnet' : 'chest' });
  G.fx.push([e.x, e.y, T.r + 6, 'die', e.t]);
}
function dmgEnemy(e, d) { e.hp -= d; e.ef = 0.1; if (G.fx.length < 60) G.fx.push([e.x + rnd(-8, 8), e.y - ET[e.t].r - 4, Math.round(d), 'dmg']); }
function splash(x, y, r, d, except) { for (const o of G.en) if (o !== except && Math.hypot(o.x - x, o.y - y) <= r) dmgEnemy(o, d * 0.6); G.fx.push([x, y, r, 'boom']); }
function nearest(x, y, rg) { let b = null, bd = rg * rg; for (const e of G.en) { const dd = (e.x - x) ** 2 + (e.y - y) ** 2; if (dd < bd) { bd = dd; b = e; } } return b; }
function evTick(dt) {
  if (G.ev) { G.ev.left -= dt; const allVoted = G.order.every((id) => G.ev.votes[id] != null); if (G.ev.left <= 0 || allVoted) { const c = [0, 0]; for (const id in G.ev.votes) c[G.ev.votes[id]]++; const w = c[0] === c[1] ? rint(2) : (c[0] > c[1] ? 0 : 1); applyEvent(G.ev.o[w].k); G.ev.done = G.ev.o[w].n; G.evShow = 3; G.evR = G.ev; G.ev = null; } }
}
function heroAttack(p, S, t) { // 무기마다 다른 공격 방식
  const dx = t.x - p.x, dy = t.y - p.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, y0 = p.y - 20;
  if (p.role === 'archer') { // 관통: 일직선의 적을 여러 마리 꿰뚫음
    const hit = []; for (const e of G.en) { const rx = e.x - p.x, ry = e.y - p.y, rel = rx * ux + ry * uy; if (rel < 0 || rel > S.rg) continue; if (Math.abs(-rx * uy + ry * ux) < ET[e.t].r + 9) hit.push([rel, e]); }
    hit.sort((a, b) => a[0] - b[0]); const n = 3 + Math.floor((p.cards.gun || 0) / 2); let last = d; hit.slice(0, n).forEach(([rel, e], i) => { dmgEnemy(e, S.dmg * (1 - 0.1 * i)); last = rel; });
    const L = Math.min(S.rg, hit.length > 1 ? last + 40 : d + 40); G.shots.push([p.x, y0, p.x + ux * L, y0 + uy * L, 0, 'archer']);
  } else if (p.role === 'militia') { // 부채꼴 베기: 앞쪽의 모든 적
    for (const e of G.en) { const rx = e.x - p.x, ry = e.y - p.y, dd = Math.hypot(rx, ry); if (dd > S.rg + ET[e.t].r) continue; if (dd < 18 || Math.acos(Math.max(-1, Math.min(1, (rx * ux + ry * uy) / dd))) < 1.25) { dmgEnemy(e, S.dmg); if (e.t !== 'boss' && e.t !== 'camp' && e.t !== 'tank') { const q = clampW(e.x + rx / (dd || 1) * 14, e.y + ry / (dd || 1) * 14); e.x = q[0]; e.y = q[1]; } } }
    G.shots.push([p.x, y0, p.x + ux * 70, y0 + uy * 70, 0, 'militia']);
  } else if (p.role === 'monk') { // 넉백 + 기절
    for (const e of G.en) if (Math.hypot(e.x - t.x, e.y - t.y) < 55 + ET[e.t].r) { dmgEnemy(e, S.dmg); if (e.t !== 'boss' && e.t !== 'camp') { const rx = e.x - p.x, ry = e.y - p.y, dd = Math.hypot(rx, ry) || 1, kb = e.t === 'tank' ? 45 : 95, q = clampW(e.x + rx / dd * kb, e.y + ry / dd * kb); e.x = q[0]; e.y = q[1]; e.st = Math.max(e.st, 0.7); } else e.st = Math.max(e.st, 0.25); }
    G.shots.push([p.x, y0, t.x, t.y, 0, 'monk']); G.fx.push([t.x, t.y, 52, 'gong']);
  } else { // 화포수: 큰 한 방 + 폭발 범위
    dmgEnemy(t, S.dmg); splash(t.x, t.y, S.aoe, S.dmg, t); G.shots.push([p.x, y0, t.x, t.y, 1, 'cannon']); G.fx.push([t.x, t.y, S.aoe, 'boom']);
  }
}
function stepBattle(dt) {
  if (G.paused) return;
  const rd = R[G.rd], np = G.order.length, prog = G.t / G.dur;
  if (G.ev) { evTick(dt); return; } // 투표 중에는 게임이 멈춰요
  if (np === 1 && G.pl[G.order[0]].offer) return; // 혼자 할 때 카드 고르는 동안 멈춤
  G.t += dt; if (G.buffAtk > 0) G.buffAtk -= dt; if (G.slowT > 0) G.slowT -= dt;
  // 사건(투표)
  if (!G.ev) for (let k = 0; k < 2; k++) if (!G.evDone[k] && prog >= (k ? 0.68 : 0.35)) { G.evDone[k] = true; const E = EVENTS[(G.rd + k) % 3]; let eo = E.o; if (!G.castle && eo[0].k === 'wall') eo = [{ n: '진을 굳게 친다', d: '모든 동료 체력 35% 회복', k: 'camp' }, eo[1]]; G.ev = { t: E.t, q: E.q, o: eo, votes: {}, left: 14 }; break; }
  if (G.ev) { G.ev.left -= dt; const allVoted = G.order.every((id) => G.ev.votes[id] != null); if (G.ev.left <= 0 || allVoted) { const c = [0, 0]; for (const id in G.ev.votes) c[G.ev.votes[id]]++; const w = c[0] === c[1] ? rint(2) : (c[0] > c[1] ? 0 : 1); applyEvent(G.ev.o[w].k); G.ev.done = G.ev.o[w].n; G.evShow = 3; G.evR = G.ev; G.ev = null; } }
  if (G.evShow > 0) { G.evShow -= dt; if (G.evShow <= 0) G.evR = null; }
  // 야간 전투 (보통·어려움)
  { const nw = G.dif === DIFF.easy ? [] : G.dif === DIFF.hard ? [[0.3, 0.46], [0.7, 0.86]] : [[0.46, 0.62]], tg = nw.some((w) => prog >= w[0] && prog < w[1]) ? 1 : 0; if (tg && !G.nIn) { G.nIn = true; G.fx.push([G.ax, G.ay, 10, 'night']); } if (!tg) G.nIn = false; G.nl += Math.sign(tg - G.nl) * Math.min(Math.abs(tg - G.nl), dt / 3); }
  // 스폰
  const hs = (1 + 0.09 * G.rd) * (rd.df ? 1.1 : 1) * G.dif.hp, hs2 = aliveHeroes();
  const rate = G.dif.sp * (0.55 + 0.9 * prog + 0.018 * G.rd) * (1 + 0.5 * (np - 1)) * (rd.df ? 1.12 : 1) * (G.obj === 'r' ? 0.45 : G.obj === 'e' ? 1.25 : 1);
  G.spawnT -= dt * rate * 1.6 * (1 + 1.5 * prog) * (1 + 0.3 * G.nl); while (G.spawnT <= 0) { G.spawnT += 1; if (G.en.length >= (isLow() ? 130 : 260)) continue; const q = spawnPos(); if (q) spawn(pickType(rd), hs, q); }
  G.waveT -= dt; if (G.waveT <= 0 && G.obj !== 'e') { G.waveT = 14; const q = spawnPos(); if (q) { const n = 14 + Math.floor(G.rd / 2) * 2 + Math.round(prog * 12); for (let k = 0; k < n && G.en.length < (isLow() ? 130 : 260); k++) spawn(pickType(rd), hs, clampW(q[0] + rnd(-110, 110), q[1] + rnd(-110, 110))); G.fx.push([q[0], q[1], 40, 'warn']); } }
  if (G.obj === 'b' && !G.bossOut && G.t >= 6) { G.bossOut = true; const q = spawnPos() || [G.ax + 500, G.ay]; spawn('boss', hs * 0.8, q); G.fx.push([q[0], q[1], 60, 'boss']); }
  else if ((G.obj === 'd' || G.obj === 's') && !G.bossDone && prog >= 0.85) { G.bossDone = true; const q = spawnPos(); if (q) { spawn('boss', hs * 0.8, q); G.fx.push([q[0], q[1], 60, 'boss']); } }
  // 탈출 지점
  if (G.obj === 'e') { const g = G.goals[G.gi]; if (g) for (const p of hs2) if (Math.hypot(p.x - g[0], p.y - g[1]) < 85) { G.fx.push([g[0], g[1], 60, 'sum']); G.gi++; break; } }
  // 적 이동 / 공격
  for (const e of G.en) { const T = ET[e.t]; if (e.ef > 0) e.ef -= dt;
    if (e.t === 'camp') { e.gt -= dt; if (e.gt <= 0) { e.gt = 7; for (let k = 0; k < 2 && G.en.length < 260; k++) spawn('grunt', hs, clampW(e.x + rnd(-50, 50), e.y + rnd(30, 70))); } continue; }
    if (e.st > 0) e.st -= dt; else { let tx, ty, reach, tp = null;
      if (G.castle) { tx = G.ax + e.ox; ty = G.ay + e.oy; reach = e.t === 'shoot' ? e.rg * 0.9 : CR + 14 + T.st * 0.9 + e.ro; }
      else { let bd = 1e9; for (const p of hs2) { const d2 = (p.x - e.x) ** 2 + (p.y - e.y) ** 2; if (d2 < bd) { bd = d2; tp = p; } } if (!tp) continue; tx = tp.x; ty = tp.y; reach = e.t === 'shoot' ? e.rg * 0.88 : T.r + 10 + T.st * 0.8; }
      const dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy) || 1;
      if (d > reach) { const v = e.sp * dt * (G.slowT > 0 ? 0.6 : 1); e.x += dx / d * v; e.y += dy / d * v; }
      else { if (e.t === 'shoot') { e.gt -= dt; if (e.gt <= 0) { e.gt = e.pk === 'gun' ? 2.6 : 1.9; let tgx, tgy; const nh = G.castle ? nearestHero(e.x, e.y, e.rg) : tp; if (G.castle && !(nh && Math.random() < 0.45)) { tgx = G.ax; tgy = G.ay - 10; } else if (nh) { tgx = nh.x; tgy = nh.y - 6; } else { tgx = G.ax; tgy = G.ay; } const dx2 = tgx - e.x, dy2 = tgy - e.y, L2 = Math.hypot(dx2, dy2) || 1, v = e.pk === 'gun' ? 330 : 230; G.pj.push({ x: e.x, y: e.y - 14, vx: dx2 / L2 * v, vy: dy2 / L2 * v, life: e.rg / v + 0.25, dm: (e.pk === 'gun' ? 11 : 7) * G.dif.dm * (e.el ? 1.4 : 1), k: e.pk }); if (G.pj.length > 90) G.pj.shift(); G.fx.push([e.x, e.y - 12, 16, 'puff']); } } else if (G.castle) G.baseHp -= T.dm * G.dif.dm * (e.el ? 1.4 : 1) * dt; else if (tp.fz <= 0) tp.hp -= T.dm * G.dif.dm * (e.el ? 1.4 : 1) * 0.6 * dt; } }
    if (G.castle) for (const p of hs2) if (p.fz <= 0 && Math.hypot(p.x - e.x, p.y - e.y) < T.r + 12) p.hp -= T.dm * G.dif.dm * 0.6 * dt; }
  // 영웅
  for (const id of G.order) { const p = G.pl[id], S = heroStats(p), b = ROLE[p.role];
    if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt;
    if (p.offer) { p.offT -= dt; if (p.offT <= 0) { applyCard(p, p.offer[rint(p.offer.length)]); p.offer = null; } }
    if (p.down > 0) { p.down -= dt; if (p.down <= 0) { p.down = 0; p.hp = p.mx * (G.castle ? 0.5 : 0.6); p.fz = 3; } continue; }
    if (p.hp <= 0) { if (G.castle) p.down = 10; else if (G.lives > 0) { G.lives--; p.down = 6; } else p.down = 1e9; p.hp = 0; G.fx.push([p.x, p.y, 30, 'die']); continue; }
    let spm = 1; if (G.obj === 'e') { let nn = 0; for (const e of G.en) if (Math.abs(e.x - p.x) < 40 && Math.abs(e.y - p.y) < 40) nn++; spm = Math.max(0.4, 1 - 0.1 * nn) * 0.6; p.x = Math.max(p.x, (G.runX || 0) - 260); G.runX = Math.max(G.runX || 0, p.x); }
    p.x = Math.max(20, Math.min(G.ww - 20, p.x + p.mvx * S.sp * spm * dt)); p.y = Math.max(30, Math.min(G.wh - 30, p.y + p.mvy * S.sp * dt));
    p.atk -= dt; if (p.atk <= 0) { const t = nearest(p.x, p.y, S.rg); if (t) { p.atk = 1 / S.rt; heroAttack(p, S, t); } }
    if (p.cards.hwacha) { p.hw = (p.hw || 0) - dt; if (p.hw <= 0) { p.hw = p.cards.evo_hwacha ? 5 : 8; let n = 0; const hm = p.cards.evo_hwacha ? 2 : 1; for (const e of G.en) if (e.t !== 'camp' && n < (6 + 3 * p.cards.hwacha) * hm && Math.hypot(e.x - p.x, e.y - p.y) < 300) { dmgEnemy(e, (22 * p.cards.hwacha + 8) * (p.cards.evo_hwacha ? 1.5 : 1)); G.shots.push([p.x, p.y - 30, e.x, e.y, 1, 'hwa']); n++; } } } }
  // 무기 (탕탕특공대식 성장 무기)
  for (const id of G.order) { const p = G.pl[id]; if (p.down > 0) continue; const S = heroStats(p), c = p.cards, mul = S.dmg / ROLE[p.role].dmg;
    if (c.spear) { const n = 1 + c.spear + (c.evo_spear ? 3 : 0), R0 = 84 + 6 * c.spear + (c.evo_spear ? 24 : 0), ang = G.t * 3.4; for (const e of G.en) { if (e.t === 'camp' && false) continue; const T = ET[e.t]; if ((e.sph || 0) > G.t) continue; for (let k = 0; k < n; k++) { const a = ang + k * 6.283 / n, tx = p.x + Math.cos(a) * R0, ty = p.y + Math.sin(a) * R0 * 0.9; if (Math.hypot(e.x - tx, e.y - ty) < 38 + T.r * 0.8) { dmgEnemy(e, (13 + 7 * c.spear) * mul * (c.evo_spear ? 1.8 : 1)); e.sph = G.t + 0.4; break; } } } }
    if (c.gong) { p.gg = (p.gg === undefined ? 2 : p.gg) - dt; if (p.gg <= 0) { p.gg = Math.max(2.4, 7.6 - 1.0 * c.gong) * (c.evo_gong ? 0.6 : 1); const R1 = (150 + 28 * c.gong) * (c.evo_gong ? 1.4 : 1); for (const e of G.en) { const d = Math.hypot(e.x - p.x, e.y - p.y); if (d < R1 + ET[e.t].r) { dmgEnemy(e, (26 + 14 * c.gong) * mul * (c.evo_gong ? 1.6 : 1)); if (e.t !== 'boss' && e.t !== 'camp') { const q = clampW(e.x + (e.x - p.x) / (d || 1) * 70, e.y + (e.y - p.y) / (d || 1) * 70); e.x = q[0]; e.y = q[1]; e.st = Math.max(e.st, c.evo_gong ? 1.3 : 0.5); } } } G.fx.push([p.x, p.y, R1, 'gong']); } }
    if (c.bomb) { p.bb = (p.bb === undefined ? 1.5 : p.bb) - dt; if (p.bb <= 0) { p.bb = Math.max(1.6, 3.8 - 0.4 * c.bomb) * (c.evo_bomb ? 0.8 : 1); const nb = c.evo_bomb ? 2 : 1, rad = (90 + 12 * c.bomb) * (c.evo_bomb ? 1.5 : 1), bd = (50 + 28 * c.bomb) * mul * (c.evo_bomb ? 1.7 : 1); for (let q = 0; q < nb; q++) { let t = nearest(p.x, p.y, 340); if (q && G.en.length) { const r2 = G.en[rint(G.en.length)]; if (Math.hypot(r2.x - p.x, r2.y - p.y) < 340) t = r2; } if (t) { G.shots.push([p.x, p.y - 20, t.x, t.y, 1, 'cannon']); splash(t.x, t.y, rad, bd, null); dmgEnemy(t, bd); G.fx.push([t.x, t.y, rad, 'boom']); } } } } }
  // 보급 상자 (킹샷식 자원)
  G.crateT -= dt; if (G.crateT <= 0 && G.crates.length < 4) { G.crateT = 11; const base = G.castle ? [G.ax, G.ay] : (hs2[0] ? [hs2[0].x, hs2[0].y] : [G.ax, G.ay]), a = rnd(0, 6.283), r = rnd(220, 460), q = clampW(base[0] + Math.cos(a) * r, base[1] + Math.sin(a) * r * 0.8, 50); G.crates.push({ x: q[0], y: q[1], k: Math.random() < 0.1 ? 'magnet' : Math.random() < 0.15 ? 'chest' : 'crate' }); }
  G.crates = G.crates.filter((c) => { for (const p of hs2) if (Math.hypot(p.x - c.x, p.y - c.y) < 46) { if (c.k === 'magnet') { G.magT = 1.6; G.fx.push([c.x, c.y, 90, 'sum']); return false; } if (c.k === 'chest' && !p.offer) { offerCards(p); } else G.food += Math.round((c.k === 'chest' ? 90 : 30 + rnd(0, 18)) * G.foodMul); G.fx.push([c.x, c.y, 40, 'sum']); return false; } return true; });
  // 성 화살 (성 강화)
  if (G.castle && G.upg > 0) { G.tt -= dt; if (G.tt <= 0) { G.tt = 1.3; for (let k = 0; k < 1 + (G.upg >> 1); k++) { const t = nearest(G.ax, G.ay, 330); if (t) { dmgEnemy(t, 14 + 9 * G.upg); G.shots.push([G.ax, G.ay - 50, t.x, t.y, 0, 'bow']); } } } }
  // 병사 (성이 없으면 영웅들을 따라다녀요)
  if (!G.castle && hs2.length) { let sx = 0, sy = 0; for (const p of hs2) { sx += p.x; sy += p.y; } sx /= hs2.length; sy /= hs2.length; G.ax += (sx - G.ax) * Math.min(1, dt * 2.5); G.ay += (sy - G.ay) * Math.min(1, dt * 2.5); }
  G.units.forEach((u, i) => { if (!u) return; const T = UT[u.t]; u.cd -= dt; if (u.cd > 0) return; const s = slotPos(i, G.ax, G.ay); const t = nearest(s[0], s[1], T.rg); if (!t) return;
    u.cd = 1 / T.rt; const d = T.dmg * LVM[u.lv - 1] * (G.buffAtk > 0 ? 1.4 : 1) * (G.castle ? 1 : 1 + 0.18 * G.upg); dmgEnemy(t, d); G.shots.push([s[0], s[1], t.x, t.y, 2 + (u.lv > 2 ? 1 : 0), u.t]); if (T.aoe) splash(t.x, t.y, T.aoe, d, t); });
  // 조선인의 혼: 떨어진 자리에 남아 있다가 가까이 가면 먹어요 (자석은 전부 빨아들여요)
  { const mg = G.magT > 0; if (mg) G.magT -= dt; for (let i = G.souls.length - 1; i >= 0; i--) { const q = G.souls[i]; let bh = null, bd = 1e12; for (const h of hs2) { const d2 = (h.x - q.x) ** 2 + (h.y - q.y) ** 2; if (d2 < bd) { bd = d2; bh = h; } } if (!bh) break; const d = Math.sqrt(bd);
      if (mg && d > 20) { const v = Math.min(d, (520 + (1.6 - G.magT) * 760) * dt); q.x += (bh.x - q.x) / d * v; q.y += (bh.y - q.y) / d * v; } if (d < (mg ? 30 : 60)) { G.souls.splice(i, 1); gainXp(q.v); } } }
  // 적 투사체 (조총·활): 날아오는 동안 피할 수 있어요
  for (let i = G.pj.length - 1; i >= 0; i--) { const b = G.pj[i]; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; let hit = false;
    for (const h of hs2) if (h.fz <= 0 && Math.hypot(h.x - b.x, h.y - 10 - b.y) < 20) { h.hp -= b.dm; G.fx.push([h.x, h.y - 20, 16, 'puff']); hit = true; break; }
    if (!hit && G.castle && Math.hypot(G.ax - b.x, G.ay - b.y) < CR + 12) { G.baseHp -= b.dm * 1.6; hit = true; }
    if (hit || b.life <= 0) G.pj.splice(i, 1); }
  // 정리
  const dead = G.en.filter((e) => e.hp <= 0); for (const e of dead) enemyDeath(e); G.en = G.en.filter((e) => e.hp > 0);
  const camps = G.en.filter((e) => e.t === 'camp').length, wipe = !G.castle && G.lives <= 0 && G.order.every((id) => G.pl[id].down > 1e8);
  if (G.castle && G.baseHp <= 0) endRound(false); else if (wipe) endRound(false);
  else if (G.obj === 'b' && G.bossDead) endRound(true); else if (G.obj === 'e' && G.gi >= G.goals.length) endRound(true); else if (G.obj === 'r' && camps === 0) endRound(true);
  else if (G.t >= G.dur) endRound(G.obj === 'd' || G.obj === 's');
}
function endRound(win) {
  G.baseHp = Math.max(0, G.baseHp); G.ph = 'result'; G.res = { win, rd: G.rd }; G.en = []; G.ev = null;
  for (const id of G.order) { const p = G.pl[id]; p.offer = null; }
}
function nextRound() {
  const correct = Object.keys(G.ans).filter((id) => G.ans[id] === R[G.rd].q[2]).length; G.bonus = correct * 15;
  if (G.rd + 1 >= R.length) { G.ph = 'end'; return; } startRound(G.rd + 1);
}
function hostMsg(from, m) {
  if (!G || !G.pl[from] && m.k !== 'prof') return;
  const p = G.pl[from];
  if (m.k === 'prof') { if (G.ph !== 'lobby' && !p) return; if (!p) addPlayer(from, m.name, m.role); else { p.name = String(m.name || p.name).slice(0, 8); if (ROLE[m.role]) p.role = m.role; } return; }
  if (m.k === 'in') { const l = Math.hypot(m.mx, m.my) || 1, s = l > 1 ? 1 / l : 1; p.mvx = m.mx * s; p.mvy = m.my * s; }
  else if (m.k === 'skill' && G.ph === 'battle' && p.cd <= 0 && !p.down) { p.cd = 15; for (const e of G.en) if (Math.hypot(e.x - p.x, e.y - p.y) < 125) { dmgEnemy(e, 70 + 8 * G.rd); e.st = 1.6; } G.fx.push([p.x, p.y, 125, 'roar']); }
  else if (m.k === 'pause' && G.ph === 'battle' && (G.order.length === 1 || from === G.order[0])) G.paused = !!m.v;
  else if (m.k === 'summon' && G.ph === 'battle') doSummon(false);
  else if (m.k === 'upg' && G.ph === 'battle' && G.upg < 5 && G.food >= UPC[G.upg]) { G.food -= UPC[G.upg]; G.upg++; if (G.castle) { G.baseMax = Math.round(G.baseMax * 1.25); G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.3); } else for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.3); } G.fx.push([G.ax, G.ay, 110, 'merge']); }
  else if (m.k === 'merge' && G.ph === 'battle') { if (m.a >= 0 && m.a < SLOTN && m.b >= 0 && m.b < SLOTN) doMerge(m.a | 0, m.b | 0); }
  else if (m.k === 'card' && p.offer && m.i >= 0 && m.i < 3) { applyCard(p, p.offer[m.i | 0]); p.offer = null; }
  else if (m.k === 'vote' && G.ev && (m.i === 0 || m.i === 1)) G.ev.votes[from] = m.i;
  else if (m.k === 'ans' && G.ph === 'result' && G.ans[from] == null) G.ans[from] = m.i | 0;
}
function hostCtl(c, v) { // 방장 전용 조작
  if (c === 'start') { G.sel.start = v.start; G.sel.dur = FAST || v.dur; G.dif = DIFF[v.diff] || DIFF.normal; G.sel.diff = v.diff; G.bonus = 0; G.wallN = 0; for (const id of G.order) G.pl[id].cards = {}; startRound(v.start); }
  else if (c === 'fight' && G.ph === 'brief') beginBattle();
  else if (c === 'next' && G.ph === 'result') { if (G.res.win) nextRound(); else startRound(G.rd); }
  else if (c === 'retry' && G.ph === 'result') startRound(G.rd);
  else if (c === 'skip' && G.ph === 'result' && !G.res.win && R[G.rd].df) nextRound();
  else if (c === 'lobby') { G.ph = 'lobby'; }
}
function makeSnap() {
  const g = G; const s = { ph: g.ph, rd: g.rd, t: g.t, dur: g.dur, sel: g.sel, order: g.order,
    pl: g.order.map((id) => { const p = g.pl[id]; return { id, name: p.name, role: p.role, x: p.x, y: p.y, hp: p.hp, mx: p.mx, lv: p.lv, down: p.down, cd: p.cd, offer: p.offer, offT: p.offT, cards: p.cards, fz: p.fz, rg: Math.round(heroStats(p).rg) }; }) };
  if (g.ph === 'battle' || g.ph === 'result' || g.ph === 'brief') { s.ww = g.ww; s.wh = g.wh; s.ax = g.ax; s.ay = g.ay; s.obj = g.obj; s.castle = g.castle; s.lives = g.lives; s.gi = g.gi; s.goals = g.goals; s.dirs = g.dirs; s.cpos = g.campPos; s.cpn = g.en.filter((e) => e.t === 'camp').length; s.cpt = g.campTotal || 0; s.bh = g.baseHp; s.bm = g.baseMax; s.food = Math.floor(g.food); s.cost = summonCost(); s.un = g.units; s.xp = g.xp; s.need = g.need;
    s.en = g.en.slice(0, 220).map((e) => [e.id, e.t, e.x, e.y, e.hp / e.mx, e.ef > 0 ? 1 : 0, e.el]); s.paused = g.paused; s.so = g.souls.slice(-260).map((q) => [Math.round(q.x), Math.round(q.y), q.v]); s.pj = g.pj.slice(0, 90).map((b) => [Math.round(b.x), Math.round(b.y), Math.round(b.vx), Math.round(b.vy), b.k]); s.mg = g.magT > 0; s.nl = Math.round(g.nl * 100) / 100; s.nd = g.dif === DIFF.hard ? 0.8 : 0.62; s.vp = !!g.ev; s.cp = g.order.length === 1 && !!g.pl[g.order[0]].offer; s.cr = g.crates.map((c) => [c.x, c.y, c.k]); s.upg = g.upg; s.ucost = UPC[g.upg] || 0; s.slots = slotsOpen(g.upg); s.sh = g.shots; s.fx = g.fx; s.ev = g.ev ? { t: g.ev.t, q: g.ev.q, o: g.ev.o, votes: g.ev.votes, left: g.ev.left } : null; s.evR = g.evR ? g.evR.done : null; s.buff = g.buffAtk > 0; s.slow = g.slowT > 0; }
  if (g.ph === 'result') { s.res = g.res; s.ans = g.ans; }
  return s;
}

// =====================================================================
//  클라이언트 (모든 기기: 화면 / 입력)
// =====================================================================
let V = null;                // 최신 스냅샷
const RP = new Map();        // id -> 화면 표시 좌표(부드럽게)
let me = { name: '', role: 'archer' };
let sel = -1, lastIn = [0, 0], joy = { on: false, id: null, ox: 0, oy: 0, x: 0, y: 0 }, keys = {};
let lastPh = '', lastRd = -1, lastOffer = '', lastEvKey = '', draftSel = { start: 0, dur: 300 };
const cam = { x: 0, y: 0, rd: -1, t0: 0 };
const ST = (() => { let o = {}; try { o = JSON.parse(localStorage.getItem('jd_set') || '{}'); } catch (e) {} return Object.assign({ joy: 'm', hand: 'R', q: 'auto', snd: 'on' }, o); })();
let autoLow = false, fAcc = 0, fN = 0, skipF = 0, bossBan = 0, bossName = '';
const isLow = () => ST.q === 'low' || (ST.q === 'auto' && autoLow);
const JRS = { s: 42, m: 55, l: 72 }; let JR = 55;
function saveSt() { try { localStorage.setItem('jd_set', JSON.stringify(ST)); } catch (e) {} }
function toast(m) { let d = document.getElementById('toast'); if (!d) { d = document.createElement('div'); d.id = 'toast'; document.getElementById('stage').appendChild(d); } d.textContent = m; d.style.opacity = 1; clearTimeout(d._t); d._t = setTimeout(() => (d.style.opacity = 0), 4200); }
function applySt() { JR = JRS[ST.joy] || 55; const ring = $('joyRing'), knob = $('joyKnob'); ring.style.width = ring.style.height = JR * 2 + 'px'; $('sBattle').classList.toggle('lefty', ST.hand === 'L');
  const rs = isLow() ? 0.75 : 1, nw = Math.round(W * rs); if (cv.width !== nw) { cv.width = nw; cv.height = Math.round(H * rs); }
  document.querySelectorAll('#setBox [data-k]').forEach((b) => b.classList.toggle('on', ST[b.dataset.k] === b.dataset.v)); }
const CAPS = {};
const effects = []; // 클라이언트 쪽 효과 {x,y,r,k,a}
// ---- 도트 아이콘 (12x12, 코드로 그려요) ----
const PALX = { k: '#3b2a1a', w: '#ffffff', g: '#b4bfca', G: '#6a7580', r: '#d9453a', o: '#ff9a2e', y: '#ffd84a', b: '#a8723a', B: '#5b3a1c', n: '#3f7fd6', c: '#7fe3ff', p: '#9b6bd6', l: '#5aa84a' };
const PIXMAP = {
  spear: ['.....gg.....', '....gwwg....', '....gwwg....', '.....gg.....', '.....kk.....', '.....rr.....', '.....bb.....', '.....bb.....', '.....bb.....', '.....bb.....', '.....bb.....', '.....BB.....'],
  gong: ['....kkkk....', '...kyyyyk...', '..kyyoooyk..', '.kyyoyyoyyk.', '.kyoyyyyoyk.', '.kyoyyyyoyk.', '.kyyoyyoyyk.', '..kyyoooyk..', '...kyyyyk...', '....kkkk....', '...b....b...', '..bb....bb..'],
  bomb: ['.........y..', '........yoy.', '.......ko...', '....kkkkk...', '...kGGGGGk..', '..kGgGGGGGk.', '..kGgGGGGGk.', '..kGGGGGGGk.', '..kGGGGGGGk.', '...kGGGGGk..', '....kkkkk...', '............'],
  hwacha: ['..r.r.r.r...', '..r.r.r.r...', '..w.w.w.w...', '.kkkkkkkkk..', '.kbbbbbbbk..', '.kbbbbbbbk..', '.kkkkkkkkk..', '..kk....kk..', '.kggk..kggk.', '.kgGk..kgGk.', '..kk....kk..', '............'],
  gun: ['............', '............', '............', '.kbbk.......', 'kbBBbkGGGGGG', 'kbBBbkgggggG', '.kbbkGGGGGGk', '..kk.y......', '............', '............', '............', '............'],
  powder: ['..y..o..y...', '...o.y.o....', '............', '..kkkkkkk...', '.kBbbbbbBk..', '.kkkkkkkkk..', '.kBbbbbbBk..', '.kBbbbbbBk..', '.kkkkkkkkk..', '.kBbbbbbBk..', '..kkkkkkk...', '............'],
  bow: ['............', '..kk..w.....', '.kb...w.....', 'kb....w.....', 'kb..wwwwwwg.', 'kb....w.....', '.kb...w.....', '..kk..w.....', '............', '............', '............', '............'],
  horse: ['...kk.......', '..kbbk......', '..kbbbk.....', '.kbbbbbk....', '.kbwkbbbk...', '.kbbbbbbbk..', '..kbbbbbbk..', '...kbbbbk...', '....kbbk....', '...kBBBBk...', '..kBBBBBBk..', '............'],
  armor: ['.kk......kk.', 'kggk....kggk', 'kgggkkkkgggk', '.kgggggggggk', '..kgGgggGgk.', '..kgGgggGgk.', '..kgggggggk.', '..kgGgggGgk.', '..kgGgggGgk.', '...kgggggk..', '....kkkkk...', '............'],
  soul: ['.....c......', '....cc......', '....cwc.....', '...cwwwc....', '...cwwwc....', '..cwwcwwc...', '..cwcccwc...', '..ccccccc...', '...ccccc....', '....ccc.....', '............', '............'],
  magnet: ['.rr......rr.', '.rr......rr.', '.rr......rr.', '.rr......rr.', '.rr......rr.', '.rrr....rrr.', '..rrr..rrr..', '...rrrrrr...', '....rrrr....', '..ww....ww..', '..ww....ww..', '............']
};
const ORD = ['spear', 'gong', 'bomb', 'hwacha', 'gun', 'powder', 'bow', 'horse', 'armor'];
const ICC = {}, ICU = {};
function ICOC(id) { if (id.startsWith('evo_')) id = id.slice(4); if (ICC[id]) return ICC[id]; const m = PIXMAP[id] || PIXMAP.soul, c = document.createElement('canvas'); c.width = 12; c.height = 12; const g = c.getContext('2d');
  m.forEach((row, y) => { for (let x = 0; x < 12; x++) { const ch = row[x]; if (ch && ch !== '.' && PALX[ch]) { g.fillStyle = PALX[ch]; g.fillRect(x, y, 1, 1); } } }); return ICC[id] = c; }
function ICON(id) { if (id.startsWith('evo_')) id = id.slice(4); if (ICU[id]) return ICU[id]; const c = document.createElement('canvas'); c.width = 48; c.height = 48; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(ICOC(id), 0, 0, 48, 48); return ICU[id] = c.toDataURL(); }
// ---- 효과음 (코드로 만든 소리, 파일 없음) ----
const SFX = { ctx: null, last: {}, TH: { hit: 70, slash: 90, bow: 80, gun: 120, boom: 120, gong: 300, pop: 80, pick: 50, lvl: 300, boss: 1000, night: 1000, cannon: 200 },
  init() { if (this.ctx) return; try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} },
  tone(f0, f1, d, type, v) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02); },
  noise(d, v, f) { const c = this.ctx, n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; fl.type = 'lowpass'; fl.frequency.value = f; g.gain.value = v; s.connect(fl); fl.connect(g); g.connect(c.destination); s.start(); },
  p(n) { if (!this.ctx || ST.snd === 'off') return; const t = performance.now(); if (t - (this.last[n] || 0) < (this.TH[n] || 50)) return; this.last[n] = t;
    if (n === 'hit') { this.noise(0.07, 0.16, 2600); this.tone(220, 90, 0.07, 'square', 0.05); }
    else if (n === 'slash') { this.noise(0.12, 0.13, 5200); }
    else if (n === 'bow') { this.tone(520, 160, 0.09, 'triangle', 0.09); }
    else if (n === 'gun') { this.noise(0.18, 0.28, 1800); this.tone(120, 50, 0.15, 'sawtooth', 0.08); }
    else if (n === 'cannon') { this.noise(0.25, 0.3, 900); this.tone(90, 40, 0.25, 'sine', 0.2); }
    else if (n === 'boom') { this.noise(0.4, 0.4, 700); this.tone(80, 30, 0.4, 'sine', 0.25); }
    else if (n === 'gong') { this.tone(196, 150, 0.9, 'sine', 0.3); this.tone(392, 300, 0.7, 'sine', 0.12); this.noise(0.15, 0.1, 3000); }
    else if (n === 'pop') { this.tone(300, 120, 0.1, 'sine', 0.07); }
    else if (n === 'pick') { this.tone(700, 1300, 0.12, 'sine', 0.1); }
    else if (n === 'lvl') { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, f * 1.01, 0.22, 'triangle', 0.16), i * 90)); }
    else if (n === 'boss') { this.tone(70, 55, 0.9, 'sawtooth', 0.22); setTimeout(() => this.tone(60, 45, 0.9, 'sawtooth', 0.22), 450); this.noise(0.6, 0.15, 400); }
    else if (n === 'night') { this.tone(300, 150, 1.2, 'sine', 0.15); } }
};
['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, () => { SFX.init(); if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume(); }, { passive: true }));

const gems = []; let shake = 0, lastBh = -1, lastPjV = null, pjT = 0, nightC = null, nightBan = 0, lastXp = 0, lastRdX = -1;

function sendHost(m) { if (Net.host) hostMsg(Net.id, m); else Net.send('host', m); }
function show(id) { for (const s of document.querySelectorAll('.screen')) s.classList.toggle('on', s.id === id); }
function esc(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
const SRC = { '교': ['교과서', '#4aa3ff'], '지': ['지도서', '#7ad07a'], '보': ['교과서 밖 보충', '#ffb347'] };

// ----- 로비 -----
function initLobby() {
  $('relayUrl').value = localStorage.getItem('hdg_relay') || DEFAULT_RELAY; $('nick').value = localStorage.getItem('hdg_nick') || '';
  const sc = $('selStart'); sc.innerHTML = CH.map((c, i) => `<option value="${i * (i < 2 ? 10 : 5) + (i === 3 ? 0 : 0)}">${i + 1}. ${c.n}</option>`).join('');
  sc.innerHTML = [0, 10, 20, 25].map((v, i) => `<option value="${v}">${i + 1}. ${CH[i].n}</option>`).join('');
  $('btnSingle').onclick = () => startAs('single');
  $('btnCreate').onclick = () => startAs('create');
  $('btnJoin').onclick = () => startAs('join');
  let diffSel = 'normal'; const DT_ = { easy: '적이 적고 약해요 · 영웅 체력 +30% · 시작 군량 +50', normal: '기본 난이도예요', hard: '적이 많고 강해요 · 영웅 체력 −10% · 시작 군량 −20' };
  const setDiff = (d) => { diffSel = d; document.querySelectorAll('#diffRow button').forEach((x) => x.classList.toggle('on', x.dataset.d === d)); $('diffTip').textContent = DT_[d]; }; document.querySelectorAll('#diffRow button').forEach((b) => (b.onclick = () => setDiff(b.dataset.d))); setDiff('normal');
  const roleTip = (r) => { const R0 = ROLE[r]; $('roleTip').innerHTML = `<b>${R0.n}</b> — ${R0.d}<br>` + R0.tag.map((x) => `<span class="tg">${x}</span>`).join(''); }; roleTip('archer');
  $('btnStart').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: diffSel }; hostCtl('start', draftSel); };
  $('btnLeave').onclick = () => location.reload();
  document.querySelectorAll('#roleRow button').forEach((b) => { b.onclick = () => { me.role = b.dataset.r; sendProf(); roleTip(b.dataset.r); document.querySelectorAll('#roleRow button').forEach((x) => x.classList.toggle('on', x === b)); }; });
  document.querySelector('#roleRow button').classList.add('on');
}
function sendProf() { sendHost({ k: 'prof', name: me.name, role: me.role }); }
async function startAs(mode) {
  me.name = ($('nick').value || '').trim().slice(0, 8) || '학생'; localStorage.setItem('hdg_nick', me.name);
  $('err').textContent = '';
  try {
    if (mode === 'single') { Net.mode = 'single'; Net.host = true; Net.id = 'me'; }
    else {
      const url = $('relayUrl').value.trim(); localStorage.setItem('hdg_relay', url);
      if (!/^wss?:\/\//.test(url) || url.includes('YOUR-WORKER')) throw '릴레이 주소를 먼저 넣어 주세요(선생님이 한 번만 설정)';
      let code = ($('roomCode').value || '').trim().toUpperCase();
      if (mode === 'create') code = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[rint(32)]).join('');
      else if (!code) throw '방 코드를 입력해 주세요';
      await Net.connect(url, code, mode === 'create');
    }
  } catch (e) { $('err').textContent = typeof e === 'string' ? e : '연결 실패'; return; }
  Net.onClosed = () => { alert('방이 닫혔어요. 처음 화면으로 돌아갑니다.'); location.reload(); };
  if (Net.host) {
    G = newG(); addPlayer(Net.id, me.name, me.role);
    Net.onJoin = () => {}; Net.onLeave = (id) => { if (G.pl[id]) { delete G.pl[id]; G.order = G.order.filter((x) => x !== id); if (G.ev) delete G.ev.votes[id]; } };
    Net.onData = (from, d) => { if (d.k === 'prof' && !G.pl[from] && G.ph !== 'lobby') return; hostMsg(from, d); };
    setInterval(hostTick, 1000 / 30); setInterval(hostBroadcast, 1000 / 15);
  } else { Net.onData = (from, d) => { if (d.s) { V = d.s; } }; sendProf(); }
  $('roomLabel').textContent = Net.mode === 'online' ? '방 코드  ' + Net.room : '혼자 하기';
  $('hostBox').style.display = Net.host ? 'block' : 'none'; $('guestBox').style.display = Net.host ? 'none' : 'block';
  show('sRoom'); requestAnimationFrame(frame);
}
let acc = 0, lastT = performance.now();
function hostTick() { const now = performance.now(); let dt = Math.min(0.1, (now - lastT) / 1000); lastT = now; if (G.ph === 'battle') { stepBattle(dt); if (FAST && window.__ff) {} } }
function hostBroadcast() { const s = makeSnap(); V = s; if (Net.mode === 'online') Net.send('all', { s }); G.shots = []; G.fx = []; }

// ----- 입력 -----
function setupInput() {
  document.querySelectorAll('#setBox [data-k]').forEach((b) => b.onclick = () => { ST[b.dataset.k] = b.dataset.v; if (b.dataset.k === 'q') autoLow = false; saveSt(); applySt(); });
  $('btnPause').onpointerdown = () => sendHost({ k: 'pause', v: true }); $('pResume').onclick = () => sendHost({ k: 'pause', v: false });
  $('pHelp').onclick = () => openTut(); $('setHelp').onclick = () => { $('setBox').classList.remove('on'); openTut(); };
  $('tutNext').onclick = () => tutGo(1); $('tutPrev').onclick = () => tutGo(-1); $('tutSkip').onclick = () => closeTut();
  $('btnGear').onpointerdown = () => $('setBox').classList.toggle('on'); $('btnGearL').onclick = () => $('setBox').classList.toggle('on'); $('setClose').onclick = () => $('setBox').classList.remove('on');
  const z = $('joyZone'), knob = $('joyKnob'), ring = $('joyRing');
  const pt = (e) => { const r = $('stage').getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  z.addEventListener('pointerdown', (e) => { z.setPointerCapture(e.pointerId); const [x, y] = pt(e); joy = { on: true, id: e.pointerId, ox: x, oy: y, x, y }; ring.style.display = knob.style.display = 'block'; ring.style.left = x - JR + 'px'; ring.style.top = y - JR + 'px'; knob.style.left = x - 24 + 'px'; knob.style.top = y - 24 + 'px'; });
  z.addEventListener('pointermove', (e) => { if (!joy.on || e.pointerId !== joy.id) return; const [x, y] = pt(e); joy.x = x; joy.y = y; let dx = x - joy.ox, dy = y - joy.oy; const l = Math.hypot(dx, dy); if (l > JR) { dx *= JR / l; dy *= JR / l; } knob.style.left = joy.ox + dx - 24 + 'px'; knob.style.top = joy.oy + dy - 24 + 'px'; });
  const up = (e) => { if (e.pointerId !== joy.id) return; joy.on = false; ring.style.display = knob.style.display = 'none'; };
  z.addEventListener('pointerup', up); z.addEventListener('pointercancel', up);
  addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = 1; if (e.key === ' ') sendHost({ k: 'skill' }); if (e.key === 'Enter') sendHost({ k: 'summon' }); });
  addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = 0; });
  $('btnSummon').onpointerdown = () => sendHost({ k: 'summon' }); $('btnUp').onpointerdown = () => sendHost({ k: 'upg' });
  $('btnSkill').onpointerdown = () => sendHost({ k: 'skill' });
  $('cv').addEventListener('pointerdown', (e) => { if (!V || V.ph !== 'battle') return; const [px, py] = pt(e), x = px / Z + cam.x, y = py / Z + cam.y; let hit = -1, bd = 34; for (let i = 0; i < (V.slots || 8); i++) { const s = slotPos(i, V.ax, V.ay), d = Math.hypot(s[0] - x, s[1] - 6 - y); if (d < bd) { bd = d; hit = i; } }
    if (hit < 0) { sel = -1; return; }
    if (sel < 0) { if (V.un && V.un[hit]) sel = hit; } else { if (sel !== hit) sendHost({ k: 'merge', a: sel, b: hit }); sel = -1; } });
  $('btnNext').onclick = () => hostCtl('next'); $('btnRetry').onclick = () => hostCtl('retry'); $('btnSkip').onclick = () => hostCtl('skip');
  $('btnFight').onclick = () => hostCtl('fight'); $('btnHome').onclick = () => location.reload();
}
function sendMove() {
  let mx = 0, my = 0;
  if (joy.on) { mx = (joy.x - joy.ox) / JR; my = (joy.y - joy.oy) / JR; }
  if (keys.a || keys.arrowleft) mx -= 1; if (keys.d || keys.arrowright) mx += 1; if (keys.w || keys.arrowup) my -= 1; if (keys.s || keys.arrowdown) my += 1;
  const l = Math.hypot(mx, my); if (l > 1) { mx /= l; my /= l; } if (l < 0.18 && !(keys.a || keys.d || keys.w || keys.s)) { mx = 0; my = 0; }
  if (Math.abs(mx - lastIn[0]) > 0.04 || Math.abs(my - lastIn[1]) > 0.04) { lastIn = [mx, my]; sendHost({ k: 'in', mx, my }); }
}

// ----- 화면 갱신 (단계가 바뀔 때만 DOM 재구성) -----
function myP() { return V && V.pl.find((p) => p.id === Net.id); }
function syncUI() {
  if (!V) return;
  const key = V.ph + ':' + V.rd + ':' + (V.res ? V.res.win : '');
  if (V.ph === 'lobby') {
    $('plist').innerHTML = V.pl.map((p) => `<li><b>${esc(p.name)}</b> <span style="color:${ROLE[p.role].c}">${ROLE[p.role].n}</span>${p.id === Net.id ? ' (나)' : ''}</li>`).join('');
    if (lastPh !== 'lobby') show('sRoom');
  } else if (lastPh !== V.ph || lastRd !== V.rd) {
    if (V.ph === 'brief') buildBrief(); else if (V.ph === 'battle') { show('sBattle'); } else if (V.ph === 'result') buildResult(); else if (V.ph === 'end') buildEnd();
  }
  if (V.ph === 'lobby' && Net.host) { $('btnStart').disabled = false; }
  if (V.ph === 'result') updateResult();
  if (V.ph === 'battle') updateHUD();
  if (lastPh !== V.ph) RP.clear();
  lastPh = V.ph; lastRd = V.rd;
}
const TUT = [
  ['🎯 라운드마다 목표가 달라요', '🏯 성을 지켜라 · 🚩 탈출하라 · ⏳ 끝까지 버텨라<br>⚔️ 적장을 쓰러뜨려라 · 🔥 보급창고를 부숴라<br><small>역사 속 전투 모습에 맞춰 목표가 바뀌어요.</small>'],
  ['🕹 움직이기와 공격', '화면 왼쪽을 누르고 끌면 영웅이 움직여요.<br>영웅은 가까운 적을 <b>자동으로 공격</b>해요.<br><small>조총·활 병사의 탄환은 날아오는 게 보여요 — 움직여서 피하세요! 영웅마다 공격 방식이 달라요 — 궁수는 관통, 의병은 베기, 승병은 튕겨내기, 화포수는 폭발!</small>'],
  ['🛡 병력 소집과 합치기', '<b>소집</b> 버튼으로 군량을 써서 병사를 불러요.<br>같은 병사 두 명을 차례로 누르면 <b>합쳐져서 더 강해져요.</b><br><small>🌾 군량은 적을 쓰러뜨리거나 상자를 열면 얻어요.</small>'],
  ['⭐ 레벨업과 무기 키우기', '적을 쓰러뜨리면 <b>조선인의 혼</b>(파란 불꽃)이 떨어져요. 가까이 가서 먹으면 레벨업!<br>🧲 자석을 먹으면 모든 혼이 빨려 와요.<br>레벨이 오르면 카드를 골라요 — 새 무기를 얻거나 무기를 <b>레벨 5까지</b> 키울 수 있어요.<br><small>회전 창 · 징 · 비격진천뢰 · 화차 · 능력 카드</small>'],
  ['🏯 성과 진영 강화', '<b>성 강화</b>(또는 진영 강화)는 군량으로 5번까지 올려요.<br>성 체력이 늘고 성이 화살을 쏘거나, 병사가 더 세지고 병사 칸이 늘어요.<br><small>📜 전투가 끝나면 역사 이야기와 퀴즈가 나와요. 퀴즈를 맞히면 군량이 늘어요!</small>']
];
let tutI = 0;
function openTut() { tutI = 0; $('tutBox').classList.add('on'); tutGo(0); }
function closeTut() { $('tutBox').classList.remove('on'); try { localStorage.setItem('jd_tut', '1'); } catch (e) {} }
function tutGo(d) { tutI += d; if (tutI >= TUT.length) { closeTut(); return; } if (tutI < 0) tutI = 0; const [h, b] = TUT[tutI]; $('tutH').innerHTML = h; $('tutB').innerHTML = b; $('tutPg').textContent = (tutI + 1) + ' / ' + TUT.length; $('tutNext').textContent = tutI === TUT.length - 1 ? '시작하기!' : '다음 ▶'; $('tutPrev').style.visibility = tutI ? 'visible' : 'hidden'; }
function buildBrief() {
  const r = R[V.rd], ch = CH[r.ch], s = SRC[r.src]; const first = r.ch !== (V.rd ? R[V.rd - 1].ch : -1);
  const idx = R.filter((x, i) => x.ch === r.ch && i <= V.rd).length, tot = R.filter((x) => x.ch === r.ch).length;
  $('bkChap').textContent = `${ch.n} (${ch.y}) · ${idx}/${tot}라운드`;
  $('bkName').textContent = r.nm; $('bkPlace').textContent = `${r.pl} · ${r.yr}년`;
  $('bkSrc').innerHTML = `<span class="tag" style="background:${s[1]}">${s[0]}</span> <small>${esc(r.pg)}</small>`;
  $('bkText').textContent = (first ? ch.sum + '\n\n' : '') + r.b;
  const cl = CLUE[r.cl]; $('bkClue').innerHTML = `<b>힌트</b> ${cl.t}<br><small>${cl.d}</small>`;
  const ob = ROUND_OBJ[V.rd], OI = OBJINFO[ob]; $('bkGoal').innerHTML = `<b>${OI.ic} 이번 목표: ${OI.n}</b><br><small>${objText(V.rd, V.obj || ob)}${r.df ? ' (역사에서는 어려웠던 싸움! 시간을 벌면 성공이에요)' : ''}</small>`;
  $('bkMap').style.background = `linear-gradient(135deg, #cfe9b8, #a9d4a0)`; $('bkMap').innerHTML = `<div style="font-size:54px;line-height:90px;text-align:center">${OI.ic}</div>`;
  $('btnFight').style.display = Net.host ? 'inline-block' : 'none'; $('bkWait').style.display = Net.host ? 'none' : 'block';
  show('sBrief'); { let seen = '1'; try { seen = localStorage.getItem('jd_tut') || ''; } catch (e) {} if (!seen) openTut(); }
}
function buildResult() {
  const r = R[V.rd], win = V.res.win; show('sResult');
  $('rsTitle').textContent = win ? (r.df ? '버텨 냈어요!' : '승리!') : '거점이 무너졌어요…';
  $('rsTitle').style.color = win ? '#2f6b2a' : '#a8322a';
  $('rsHist').innerHTML = `<b>역사 이야기</b><br>${esc(r.r)}` + (win && r.df ? `<br><small>※ 실제 역사에서 이 전투는 조선에게 어려운 싸움이었어요. 게임에서는 '시간 벌기'로 표현했어요.</small>` : '');
  $('qText').textContent = '퀴즈! ' + r.q[0];
  $('qOpts').innerHTML = r.q[1].map((o, i) => `<button class="qo" data-i="${i}">${esc(o)}</button>`).join('');
  document.querySelectorAll('.qo').forEach((b) => b.onclick = () => { if (b.disabled) return; sendHost({ k: 'ans', i: +b.dataset.i }); });
  $('qBox').style.display = win ? 'block' : 'none';
  $('qWhy').textContent = '';
  $('rsHost').style.display = Net.host ? 'block' : 'none';
  $('btnNext').style.display = win ? 'inline-block' : 'none'; $('btnRetry').style.display = win ? 'none' : 'inline-block';
  $('btnSkip').style.display = (!win && r.df) ? 'inline-block' : 'none';
  $('rsWait').style.display = Net.host ? 'none' : 'block';
}
function updateResult() {
  const r = R[V.rd]; if (!V.res.win) return; const mine = V.ans ? V.ans[Net.id] : null; const n = Object.keys(V.ans || {}).length;
  document.querySelectorAll('.qo').forEach((b) => { const i = +b.dataset.i; if (mine != null) { b.disabled = true; b.classList.toggle('ok', i === r.q[2]); b.classList.toggle('no', i === mine && i !== r.q[2]); } });
  $('qWhy').innerHTML = mine != null ? `${mine === r.q[2] ? '⭕ 정답!' : '❌ 아쉬워요'} ${esc(r.q[3])}<br><small>답한 친구 ${n}/${V.pl.length}명 · 정답자 1명당 다음 판 군량 +15</small>` : `<small>답한 친구 ${n}/${V.pl.length}명</small>`;
}
function buildEnd() {
  show('sEnd'); $('endText').innerHTML = CH.map((c) => `<p><b>${c.n}</b> — ${esc(c.sum)} <small>(${c.pg})</small></p>`).join('');
}

// HUD
function updateHUD() {
  const p = myP(); if (!p) return; const r = R[V.rd]; $('sBattle').classList.toggle('noarmy', V.obj === 'e');
  $('hudName').textContent = r.nm; const rem = Math.max(0, Math.ceil(V.dur - V.t)); $('hudT').textContent = String(Math.floor(rem / 60)).padStart(2, '0') + ':' + String(rem % 60).padStart(2, '0');
  $('barT').style.width = Math.min(100, V.t / V.dur * 100) + '%'; $('barB').style.width = (V.castle ? Math.max(0, V.bh / V.bm * 100) : Math.min(100, (V.obj === 'e' ? V.gi / Math.max(1, V.goals.length) : V.obj === 'r' ? (V.cpt - V.cpn) / Math.max(1, V.cpt) : V.t / V.dur) * 100)) + '%'; { const OI = OBJINFO[V.obj]; let extra = ''; if (V.obj === 'e') extra = ` ${V.gi}/${V.goals.length}`; else if (V.obj === 'r') extra = ` ${V.cpt - V.cpn}/${V.cpt}`; if (!V.castle) extra += `  ❤️×${Math.max(0, V.lives)}`; $('objBar').textContent = OI.ic + ' ' + OI.n + extra; }
  { const pb = $('pauseBox'); pb.classList.toggle('on', !!V.paused); if (V.paused) { const r = R[V.rd], OI = OBJINFO[V.obj]; $('pTitle').innerHTML = `⏸ 잠시 멈춤 <small>${r.nm} · ${r.yr}년</small>`; $('pText').textContent = r.b; $('pResume').style.display = (Net.host || V.pl.length === 1) ? 'inline-block' : 'none'; $('pWait').style.display = (Net.host || V.pl.length === 1) ? 'none' : 'block'; }
    $('btnPause').style.display = (Net.host || V.pl.length === 1) ? 'block' : 'none'; const tg = $('pauseTag'); tg.textContent = V.vp ? '🗳 투표하는 동안 게임이 멈춰요' : V.cp ? '⭐ 카드를 골라 주세요 (게임이 멈춰 있어요)' : ''; tg.style.display = (V.vp || V.cp) ? 'block' : 'none'; }
  $('hudFood').textContent = '🌾 ' + V.food; { const n = V.un.filter(Boolean).length; $('hudArmy').textContent = '🛡 병력 ' + n + '/' + V.slots; const me = V.pl.find((x) => x.id === Net.id); if (me) { let h = '<span class="wc">' + ROLE[me.role].n + ' · ' + ROLE[me.role].tag.join('·') + '</span>'; for (const k of ORD) { const lv = me.cards[k] || 0; if (!lv) continue; const ev = me.cards['evo_' + k]; h += `<span class="eq${WEAP[k] ? ' wp' : ''}${ev ? ' ev' : ''}" title="${CARDS.find((x) => x.id === k).n}"><img src="${ICON(k)}"><b>Lv.${lv}${ev ? '★' : ''}</b></span>`; } if (h !== $('hudWeap')._h) { $('hudWeap')._h = h; $('hudWeap').innerHTML = h; } }
    const bu = $('btnUp'); bu.innerHTML = (V.castle ? '성 강화' : '진영 강화') + (V.upg >= 5 ? '<br><small>최대</small>' : `<br><small>Lv.${V.upg} · 🌾${V.ucost}</small>`); bu.classList.toggle('dis', V.upg >= 5 || V.food < V.ucost); } $('btnSummon').innerHTML = `소집<br><small>군량 ${V.cost}</small>`; $('btnSummon').classList.toggle('dis', V.food < V.cost || !V.un.includes(null));
  $('btnSkill').innerHTML = p.cd > 0 ? `함성<br><small>${Math.ceil(p.cd)}초</small>` : '함성<br><small>준비!</small>'; $('btnSkill').classList.toggle('dis', p.cd > 0 || p.down > 0);
  $('barHp').style.width = Math.max(0, p.hp / p.mx * 100) + '%'; $('barXp').style.width = Math.min(100, V.xp / V.need * 100) + '%'; $('hudLv').textContent = 'Lv.' + p.lv; { const av = $('meAv'); if (av.dataset.r !== p.role && window.SPR && SPR[RSP[p.role]]) { av.dataset.r = p.role; av.src = SPR[RSP[p.role]].p || SPR[RSP[p.role]].d; } }
  const ok = p.offer ? p.offer.join() : ''; if (ok !== lastOffer) { lastOffer = ok; const box = $('cards'); if (!p.offer) box.style.display = 'none'; else { box.style.display = 'flex'; box.innerHTML = p.offer.map((id, i) => { const c = CARDS.find((x) => x.id === id), evo = id.startsWith('evo_'), base = evo ? id.slice(4) : id, cur = p.cards[id] || 0, pips = [1, 2, 3, 4, 5].map((n) => `<u class="${n <= cur ? 'f' : n === cur + 1 ? 'nx' : ''}"></u>`).join(''); return `<div class="card${evo ? ' evo' : ''}${!cur && !evo ? ' nw' : ''}" data-i="${i}">${evo ? '<em class="bd">★ 진화!</em>' : !cur ? '<em class="bd">NEW!</em>' : ''}<img class="ci" src="${ICON(base)}"><b>${c.n}</b><span class="ty">${WEAP[base] ? '무기' : '능력'}</span><span>${c.d}</span>${evo ? '' : `<div class="pp5">${pips}</div>`}<small>${c.t}</small></div>`; }).join(''); box.querySelectorAll('.card').forEach((d) => d.onpointerdown = () => { sendHost({ k: 'card', i: +d.dataset.i }); box.style.display = 'none'; lastOffer = ''; }); } }
  const ek = V.ev ? V.ev.t + V.ev.q : ''; const evb = $('evBox');
  if (ek !== lastEvKey) { lastEvKey = ek; if (!V.ev) evb.style.display = 'none'; else { evb.style.display = 'block'; evb.innerHTML = `<h3>${V.ev.t}</h3><p>${V.ev.q} <small>(친구들과 투표!)</small></p><div>${V.ev.o.map((o, i) => `<button class="evo" data-i="${i}"><b>${o.n}</b><small>${o.d}</small></button>`).join('')}</div><p id="evV"></p>`; evb.querySelectorAll('.evo').forEach((b) => b.onpointerdown = () => { sendHost({ k: 'vote', i: +b.dataset.i }); evb.querySelectorAll('.evo').forEach((x) => x.classList.toggle('on', x === b)); }); } }
  if (V.ev && $('evV')) { const c = [0, 0]; for (const k in V.ev.votes) c[V.ev.votes[k]]++; $('evV').textContent = `투표 ${c[0]} : ${c[1]}  ·  ${Math.ceil(V.ev.left)}초`; }
}

// ----- 그리기 -----
const cv = $('cv'), cx = cv.getContext('2d');
let lastFT = performance.now();
function frame() {
  requestAnimationFrame(frame); sendMove(); const nowF = performance.now(), dtF = nowF - lastFT; lastFT = nowF;
  if (V) { syncUI(); if (lastPh === 'battle') { fAcc += Math.min(dtF, 200); fN++; if (fN >= 90) { const avg = fAcc / fN; fAcc = 0; fN = 0; if (ST.q === 'auto' && !autoLow && avg > 36) { autoLow = true; applySt(); toast('기기가 느려서 저사양 모드로 바꿨어요 (⚙ 설정에서 바꿀 수 있어요)'); } } }
    if (isLow() && (skipF ^= 1)) return;
    if (lastPh === 'battle' || lastPh === 'result' || lastPh === 'brief') draw(); }
}
function lerpTo(id, x, y, k) { const now = performance.now() / 1000; let r = RP.get(id);
  if (!r) { r = [x, y, x, y, 0, 0, now, now]; RP.set(id, r); return r; }
  const dt = Math.min(0.1, now - r[7]); r[7] = now;
  if (x !== r[2] || y !== r[3]) { const di = Math.max(0.02, now - r[6]); if (Math.hypot(x - r[2], y - r[3]) > 300) { r[0] = x; r[1] = y; r[4] = r[5] = 0; } else { const nx = (x - r[2]) / di, ny = (y - r[3]) / di; r[4] += (nx - r[4]) * 0.6; r[5] += (ny - r[5]) * 0.6; } r[2] = x; r[3] = y; r[6] = now; }
  const ex = Math.min(0.09, now - r[6]), px = r[2] + r[4] * ex, py = r[3] + r[5] * ex, a = 1 - Math.exp(-dt * 22); // 스냅샷 사이 예측 + 시간 기준 부드러운 추적
  r[0] += (px - r[0]) * a; r[1] += (py - r[1]) * a;
  if (now - r[6] > 0.2) { r[4] *= 0.8; r[5] *= 0.8; }
  return r; }
function rr(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
function blob(x, y, r, c1, c2, ring, glow) {
  const g = cx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2);
  if (glow) { cx.shadowColor = glow; cx.shadowBlur = 12; } cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill(); cx.shadowBlur = 0;
  if (ring) { cx.strokeStyle = ring; cx.lineWidth = 3; cx.stroke(); }
}
function face(x, y, r, mood) { // 눈·표정
  const ex = r * 0.38, ey = r * 0.12, er = Math.max(2, r * 0.26);
  cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x - ex, y - ey, er, 0, 7); cx.arc(x + ex, y - ey, er, 0, 7); cx.fill();
  cx.fillStyle = '#26203a'; cx.beginPath(); cx.arc(x - ex + (mood === 'angry' ? 1 : 0), y - ey + 1, er * 0.55, 0, 7); cx.arc(x + ex - (mood === 'angry' ? 1 : 0), y - ey + 1, er * 0.55, 0, 7); cx.fill();
  cx.strokeStyle = '#26203a'; cx.lineWidth = Math.max(1.5, r * 0.11); cx.lineCap = 'round'; cx.beginPath();
  if (mood === 'angry') { cx.moveTo(x - ex - er, y - ey - er - 1); cx.lineTo(x - ex + er, y - ey - er * 0.2); cx.moveTo(x + ex + er, y - ey - er - 1); cx.lineTo(x + ex - er, y - ey - er * 0.2); }
  else if (mood === 'down') { cx.moveTo(x - ex - 2, y - ey - 1); cx.lineTo(x - ex + 2, y - ey + 1); cx.moveTo(x + ex - 2, y - ey + 1); cx.lineTo(x + ex + 2, y - ey - 1); }
  else { cx.moveTo(x - r * 0.25, y + r * 0.38); cx.quadraticCurveTo(x, y + r * 0.62, x + r * 0.25, y + r * 0.38); }
  cx.stroke();
}
function pill(txt, x, y, bg, fg) { cx.font = 'bold 12px sans-serif'; const w = cx.measureText(txt).width + 14; cx.fillStyle = bg; rr(x - w / 2, y - 9, w, 18, 9); cx.fill(); cx.fillStyle = fg; cx.textAlign = 'center'; cx.fillText(txt, x, y + 4.5); }
// ---- 캐릭터 꾸밈: 머리 장식 + 무기 (글자 대신 모양으로 구분) ----
function gear(kind, x, y, r) {
  cx.lineCap = 'round'; cx.lineJoin = 'round';
  if (kind === 'bow' || kind === 'archer') { // 투구 + 깃
    cx.fillStyle = '#9aa3b5'; cx.beginPath(); cx.arc(x, y - r * 0.15, r * 0.95, Math.PI, 0); cx.closePath(); cx.fill(); cx.strokeStyle = '#4b5366'; cx.lineWidth = 2; cx.stroke();
    cx.fillStyle = '#e05a4f'; cx.beginPath(); cx.arc(x, y - r * 1.05, r * 0.22, 0, 7); cx.fill();
  } else if (kind === 'spear' || kind === 'militia') { // 흰 머리띠
    cx.fillStyle = '#fff'; rr(x - r * 0.95, y - r * 0.6, r * 1.9, r * 0.32, r * 0.16); cx.fill(); cx.strokeStyle = '#c9ccd8'; cx.lineWidth = 1.5; cx.stroke();
    cx.fillStyle = '#fff'; cx.beginPath(); cx.moveTo(x + r * 0.9, y - r * 0.45); cx.lineTo(x + r * 1.5, y - r * 0.2); cx.lineTo(x + r * 0.95, y - r * 0.25); cx.fill();
  } else if (kind === 'gun' || kind === 'gunner') { // 전립(넓은 모자)
    cx.fillStyle = '#6b3f2a'; cx.beginPath(); cx.ellipse(x, y - r * 0.55, r * 1.35, r * 0.34, 0, 0, 7); cx.fill(); cx.strokeStyle = '#3d2216'; cx.lineWidth = 2; cx.stroke();
    cx.fillStyle = '#8a5236'; cx.beginPath(); cx.arc(x, y - r * 0.65, r * 0.62, Math.PI, 0); cx.closePath(); cx.fill(); cx.stroke();
  } else if (kind === 'cannon') { // 검은 투구
    cx.fillStyle = '#3a3f52'; cx.beginPath(); cx.arc(x, y - r * 0.15, r * 0.98, Math.PI, 0); cx.closePath(); cx.fill(); cx.strokeStyle = '#1d2030'; cx.lineWidth = 2; cx.stroke();
    cx.fillStyle = '#ffb347'; cx.beginPath(); cx.arc(x, y - r * 0.95, r * 0.2, 0, 7); cx.fill();
  } else if (kind === 'cav') { // 붉은 술 투구
    cx.fillStyle = '#b8c0d6'; cx.beginPath(); cx.arc(x, y - r * 0.15, r * 0.95, Math.PI, 0); cx.closePath(); cx.fill(); cx.strokeStyle = '#59627a'; cx.lineWidth = 2; cx.stroke();
    cx.strokeStyle = '#e03a3a'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(x, y - r * 1.05); cx.quadraticCurveTo(x + r * 0.5, y - r * 1.6, x + r * 0.7, y - r * 1.0); cx.stroke();
  } else if (kind === 'monk') { // 승려: 민머리 + 염주
    cx.fillStyle = 'rgba(255,255,255,.35)'; cx.beginPath(); cx.arc(x - r * 0.3, y - r * 0.7, r * 0.18, 0, 7); cx.fill();
    cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 3; cx.setLineDash([2, 4]); cx.beginPath(); cx.arc(x, y + r * 0.7, r * 0.7, 0.2, Math.PI - 0.2); cx.stroke(); cx.setLineDash([]);
  }
}
function weapon(kind, x, y, r, ang) {
  cx.save(); cx.translate(x + r * 0.95, y + r * 0.1); cx.rotate(ang || -0.5); cx.lineCap = 'round';
  if (kind === 'bow' || kind === 'archer') { cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 3; cx.beginPath(); cx.arc(0, 0, r * 0.85, -1.2, 1.2); cx.stroke(); cx.strokeStyle = '#fff'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(Math.cos(-1.2) * r * 0.85, Math.sin(-1.2) * r * 0.85); cx.lineTo(Math.cos(1.2) * r * 0.85, Math.sin(1.2) * r * 0.85); cx.stroke(); }
  else if (kind === 'spear' || kind === 'militia') { cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(-r * 0.5, r * 0.6); cx.lineTo(r * 1.1, -r * 0.9); cx.stroke(); cx.fillStyle = '#e8edf7'; cx.beginPath(); cx.moveTo(r * 1.35, -r * 1.2); cx.lineTo(r * 0.95, -r * 0.95); cx.lineTo(r * 1.15, -r * 0.7); cx.closePath(); cx.fill(); }
  else if (kind === 'gun' || kind === 'gunner') { cx.fillStyle = '#6b4a2e'; rr(-r * 0.2, -r * 0.12, r * 0.7, r * 0.3, 3); cx.fill(); cx.fillStyle = '#3a3f4a'; rr(r * 0.4, -r * 0.08, r * 0.9, r * 0.2, 2); cx.fill(); }
  else if (kind === 'cannon') { cx.fillStyle = '#2f3342'; rr(-r * 0.1, -r * 0.3, r * 1.1, r * 0.6, 5); cx.fill(); cx.fillStyle = '#ffb347'; cx.beginPath(); cx.arc(r * 1.0, 0, r * 0.18, 0, 7); cx.fill(); cx.fillStyle = '#4a4f66'; cx.beginPath(); cx.arc(r * 0.1, r * 0.35, r * 0.28, 0, 7); cx.fill(); }
  else if (kind === 'cav') { cx.strokeStyle = '#e8edf7'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(0, r * 0.5); cx.lineTo(r * 1.2, -r * 0.6); cx.stroke(); }
  else if (kind === 'monk') { cx.strokeStyle = '#8a5a2b'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(-r * 0.4, r * 0.6); cx.lineTo(r * 0.9, -r * 0.8); cx.stroke(); cx.fillStyle = '#a97a45'; cx.beginPath(); cx.arc(r * 1.0, -r * 0.9, r * 0.28, 0, 7); cx.fill(); }
  cx.restore();
}
function drawHorse(x, y, r) { cx.fillStyle = '#8a5a3a'; cx.strokeStyle = '#4a2f1e'; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(x, y + r * 0.85, r * 1.15, r * 0.55, 0, 0, 7); cx.fill(); cx.stroke(); cx.beginPath(); cx.ellipse(x + r * 1.1, y + r * 0.35, r * 0.34, r * 0.5, -0.5, 0, 7); cx.fill(); cx.stroke(); }

// ---- 스프라이트 (AI 그림) ----
const IMG = {}, IMGW = {}, FACE = new Map(), KICK = new Map();
(function () { const S = window.SPR || {}; for (const k in S) { const im = new Image(); im.src = S[k].d; IMG[k] = im; } })();
const FOEP = { 왜군: 'jp', 후금군: 'hg', 청군: 'qg' }, ETK = { grunt: 'inf', shoot: 'rng', cav: 'cav', tank: 'tank', boss: 'boss' };
const EH = { camp: 70, grunt: 52, shoot: 52, cav: 62, tank: 60, boss: 86 };
const RSP = { archer: 'h_archer', militia: 'h_militia', monk: 'h_monk', gunner: 'h_cannon' };
const fr10 = (tm, ph) => Math.floor(tm * 10 + ph);
const USP = { bow: 'u_bow', spear: 'u_spear', gun: 'u_gun', cannon: 'u_cannon', cav: 'u_cav' };
const GR = {}, OUT = 5;
function okImg(n) { if (GR[n]) return GR[n]; const im = IMG[n]; if (!im || !im.complete || !im.naturalWidth) return null;
  const S = (window.SPR || {})[n] || {}, c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0);
  c.iw = c.width; c.ih = c.height; c.pad = 0; c.n = S.n || 1; c.fw = S.fw || c.width; c.step = S.step || 1;
  // 성능: 큰 그림을 화면에 그릴 크기 근처로 한 번만 줄여 둬요 (매 프레임 축소하면 끊겨요)
  const maxH = /^(gate|camp|orb|hwacha)/.test(n) ? 220 : 120;
  if (c.ih > maxH) { const f = maxH / c.ih, nn = c.n, fw0 = c.fw, fw2 = Math.max(1, Math.round(fw0 * f)), h2 = Math.round(c.ih * f), c2 = document.createElement('canvas'); c2.width = fw2 * nn; c2.height = h2; const g2 = c2.getContext('2d'); g2.imageSmoothingEnabled = true; g2.imageSmoothingQuality = 'high';
    for (let i = 0; i < nn; i++) g2.drawImage(c, i * fw0, 0, fw0, c.ih, i * fw2, 0, fw2, h2);
    c2.iw = c2.width; c2.ih = h2; c2.pad = 0; c2.n = nn; c2.fw = fw2; c2.step = c.step; return GR[n] = c2; }
  return GR[n] = c; }
function white(name) { if (IMGW[name]) return IMGW[name]; const im = okImg(name); if (!im) return null; const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); return IMGW[name] = c; }
function spr(name, x, y, h, o) { o = o || {}; const im = okImg(name); if (!im) return; h *= SPS; const k = h / im.ih, fw = im.fw, w = fw * k, hh = im.height * k, fi = im.n > 1 ? ((Math.floor((o.fr || 0) / im.step) % im.n) + im.n) % im.n : 0;
  cx.save(); cx.globalAlpha *= (o.alpha == null ? 1 : o.alpha); cx.translate(x + (o.dx || 0), y - (o.bob || 0) + (o.dy || 0)); cx.rotate(o.lean || 0); cx.scale((o.flip ? -1 : 1) * (o.sx || 1), o.sy || 1);
  cx.drawImage(im, fi * fw, 0, fw, im.height, -w / 2, -hh, w, hh);
  if (o.flash) { const wi = white(name); if (wi) { cx.globalAlpha *= 0.75; cx.drawImage(wi, fi * fw, 0, fw, im.height, -w / 2, -hh, w, hh); } }
  cx.restore(); }
function shade(x, y, w, a) { cx.fillStyle = 'rgba(0,0,0,' + (a || 0.33) + ')'; cx.beginPath(); cx.ellipse(x, y, w, w * 0.32, 0, 0, 7); cx.fill(); }
function kickOf(key, tm) { const k = KICK.get(key); if (!k) return { dx: 0, dy: 0, sx: 1, sy: 1 }; const t = (tm - k.t) / 0.2; if (t >= 1) return { dx: 0, dy: 0, sx: 1, sy: 1 }; const e = Math.sin(Math.PI * Math.min(1, t * 1.15)); return { dx: k.ux * 7 * e, dy: k.uy * 3 * e, sx: 1 + 0.07 * e, sy: 1 - 0.05 * e }; }
function noteShot(a, tm) { const dx = a[2] - a[0], dy = a[3] - a[1], L = Math.hypot(dx, dy) || 1; let key = null;
  if (V.un) for (let i = 0; i < SLOTN; i++) { const q = slotPos(i, V.ax, V.ay); if (V.un[i] && Math.abs(q[0] - a[0]) < 40 && Math.abs(q[1] - a[1]) < 40) { key = 'u' + i; break; } }
  if (!key) { let bd = 60; for (const p of V.pl) { const q = RP.get(p.id); if (!q) continue; const d = Math.hypot(q[0] - a[0], q[1] - a[1]); if (d < bd) { bd = d; key = 'h' + p.id; } } }
  if (key) { KICK.set(key, { t: tm, ux: dx / L, uy: dy / L }); FACE.set(key, dx < 0); } }

// ---- 수묵채색 배경 (한 번만 그려서 재사용) ----
const BGC = {};
function seedR(n) { let v = n; return () => (v = (v * 16807) % 2147483647) / 2147483647; }
function makeBg(th) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), rn = seedR(th.length * 977 + th.charCodeAt(0) * 31);
  const PAL = THEME[th]; let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, PAL[0]); gr.addColorStop(1, PAL[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2800; i++) { g.fillStyle = 'rgba(90,66,36,' + (0.03 + rn() * 0.05) + ')'; g.fillRect(rn() * W, rn() * H, 1 + rn() * 2, 1 + rn() * 2); }
  g.lineWidth = 1; for (let i = 0; i < 220; i++) { const x = rn() * W, y = rn() * H, a = rn() * 6.28, l = 6 + rn() * 14; g.strokeStyle = 'rgba(120,90,50,.06)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  const blur = (px, fn) => { g.save(); if ('filter' in g) g.filter = 'blur(' + px + 'px)'; fn(); g.restore(); };
  for (let i = 0; i < 6; i++) { const cx0 = 80 + i * 170 + rn() * 60, cy0 = 30 + rn() * 70, s = 0.8 + rn() * 0.7; g.fillStyle = 'rgba(255,255,255,.62)'; for (const [dx, dy, r] of [[0, 0, 22], [24, -6, 26], [52, 2, 20], [26, 8, 22]]) { g.beginPath(); g.arc(cx0 + dx * s, cy0 + dy * s, r * s, 0, 7); g.fill(); } }
  const ridge = (y0, amp, jag, alpha, hue) => { const pts = []; let n = 36; for (let i = 0; i <= n; i++) { const x = i / n * (W + 40) - 20; pts.push([x, y0 - amp * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.52 + rn() * 1.6 + jag))) * (0.6 + rn() * 0.4)]); }
    g.beginPath(); g.moveTo(-20, y0 + 120); pts.forEach((p) => g.lineTo(p[0], p[1])); g.lineTo(W + 20, y0 + 120); g.closePath(); const f = g.createLinearGradient(0, y0 - amp, 0, y0 + 40); f.addColorStop(0, 'rgba(' + hue + ',' + alpha + ')'); f.addColorStop(1, 'rgba(' + hue + ',0)'); g.fillStyle = f; g.fill(); };
  const pines = (y0, n, a) => { for (let i = 0; i < n; i++) { const x = rn() * W, y = y0 + rn() * 40, h = 14 + rn() * 14; g.fillStyle = 'rgba(40,52,36,' + a + ')'; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x - h * 0.28, y); g.lineTo(x + h * 0.28, y); g.fill(); g.fillRect(x - 0.8, y, 1.6, 4); } };
  const mist = (y, a) => blur(6, () => { const f = g.createLinearGradient(0, y - 30, 0, y + 30); f.addColorStop(0, 'rgba(255,250,235,0)'); f.addColorStop(0.5, 'rgba(255,250,235,' + a + ')'); f.addColorStop(1, 'rgba(255,250,235,0)'); g.fillStyle = f; g.fillRect(0, y - 30, W, 60); });
  if (th === 'plain') { blur(2, () => { ridge(150, 60, 0.3, 0.32, '60,60,70'); ridge(190, 46, 1.2, 0.26, '70,62,50'); }); mist(150, 0.5); mist(215, 0.35); }
  else if (th === 'mount') { blur(2.5, () => { ridge(140, 110, 0.4, 0.4, '45,60,60'); ridge(190, 90, 1.5, 0.32, '50,62,48'); ridge(240, 60, 2.2, 0.25, '55,60,40'); }); pines(150, 18, 0.35); pines(200, 22, 0.32); mist(170, 0.55); mist(250, 0.4); }
  else if (th === 'sea') { const hz = 140; g.fillStyle = 'rgba(255,250,235,.28)'; g.fillRect(0, 0, W, hz); const sg = g.createLinearGradient(0, hz, 0, H); sg.addColorStop(0, 'rgba(70,110,125,.38)'); sg.addColorStop(1, 'rgba(40,80,100,.5)'); g.fillStyle = sg; g.fillRect(0, hz, W, H - hz);
    blur(2, () => { ridge(hz + 4, 40, 0.5, 0.35, '55,70,75'); }); g.lineCap = 'round'; for (let i = 0; i < 90; i++) { const x = rn() * W, y = hz + 14 + rn() * (H - hz - 14), l = 14 + (y - hz) * 0.08 + rn() * 12; g.strokeStyle = 'rgba(235,245,240,' + (0.14 + rn() * 0.18) + ')'; g.lineWidth = 1.2 + (y - hz) * 0.004; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 4, x + l, y); g.stroke(); } mist(hz + 6, 0.55); }
  else { blur(2, () => { ridge(150, 70, 0.8, 0.3, '55,65,70'); ridge(195, 45, 1.9, 0.24, '60,70,55'); }); mist(160, 0.5); g.fillStyle = 'rgba(70,115,125,.14)'; g.fillRect(0, 320, W, 90); mist(330, 0.25); g.lineCap = 'round'; for (let i = 0; i < 60; i++) { const x = rn() * W, y = 400 + rn() * 130, h = 16 + rn() * 22; g.strokeStyle = 'rgba(80,92,50,' + (0.25 + rn() * 0.2) + ')'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 3, y - h * 0.6, x + 6 * (rn() - 0.3), y - h); g.stroke(); } }
  if (th !== 'sea') { g.lineCap = 'round'; for (let i = 0; i < 80; i++) { const x = rn() * W, y = 260 + rn() * 270; g.strokeStyle = 'rgba(70,80,40,' + (0.2 + rn() * 0.2) + ')'; g.lineWidth = 1.3; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + k * 2, y - 6, x + k * 5, y - 10 - rn() * 3); g.stroke(); } } }
  const vg = g.createRadialGradient(W / 2, H / 2, 240, W / 2, H / 2, 640); vg.addColorStop(0, 'rgba(60,40,20,0)'); vg.addColorStop(1, 'rgba(60,50,30,.2)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  
  return c;
}

// ---- 넓은 들판 (한 번만 그려서 재사용) ----
const WLD = {};
function makeWorld(th, ww, wh, obj, key) {
  const c = document.createElement('canvas'); c.width = ww; c.height = wh; const g = c.getContext('2d'), rn = seedR(key * 7919 + 13);
  const sea = th === 'sea', base = sea ? '#9ed3dc' : th === 'mount' ? '#a8d29a' : th === 'river' ? '#b4dba4' : '#bde3a0';
  g.fillStyle = base; g.fillRect(0, 0, ww, wh);
  for (let i = 0; i < ww * wh / 9000; i++) { const x = rn() * ww, y = rn() * wh, r = 40 + rn() * 90; g.fillStyle = rn() < 0.5 ? 'rgba(255,255,255,.10)' : 'rgba(40,110,60,.07)'; g.beginPath(); g.ellipse(x, y, r, r * 0.6, 0, 0, 7); g.fill(); }
  if (sea) { g.lineCap = 'round'; for (let i = 0; i < ww * wh / 4000; i++) { const x = rn() * ww, y = rn() * wh, l = 20 + rn() * 30; g.strokeStyle = 'rgba(255,255,255,' + (0.18 + rn() * 0.2) + ')'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 6, x + l, y); g.stroke(); }
    const dw = ww * 0.62, dh = wh * 0.62, dx = (ww - dw) / 2, dy = (wh - dh) / 2; g.fillStyle = 'rgba(60,40,20,.25)'; g.fillRect(dx + 10, dy + 14, dw, dh); g.fillStyle = '#c99a62'; g.fillRect(dx, dy, dw, dh); for (let y = dy; y < dy + dh; y += 38) { g.fillStyle = (Math.floor((y - dy) / 38) % 2) ? '#bd8d56' : '#d3a86f'; g.fillRect(dx, y, dw, 37); g.strokeStyle = 'rgba(80,50,20,.35)'; g.lineWidth = 2; g.strokeRect(dx, y, dw, 38); }
    g.strokeStyle = '#7a4a24'; g.lineWidth = 14; g.strokeRect(dx, dy, dw, dh); }
  else {
    if (th === 'river') { g.fillStyle = 'rgba(120,190,215,.9)'; g.beginPath(); g.moveTo(0, wh * 0.78); for (let x = 0; x <= ww; x += 60) g.lineTo(x, wh * 0.78 + Math.sin(x / 190) * 40 - 30); for (let x = ww; x >= 0; x -= 60) g.lineTo(x, wh * 0.78 + 110 + Math.sin(x / 150 + 2) * 30); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 4; g.stroke(); }
    // 길
    const rd = []; const horiz = obj === 'e' || obj === 'r'; for (let i = 0; i <= 12; i++) rd.push(horiz ? [i / 12 * ww, wh * 0.5 + Math.sin(i * 1.3) * 130] : [ww / 2 + Math.sin(i * 1.1) * 160, i / 12 * wh]);
    const road = (w, col) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); rd.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke(); }; road(74, 'rgba(120,90,50,.28)'); road(64, '#d9be86'); road(52, '#ecd9a6');
    // 바위/덤불
    for (let i = 0; i < ww * wh / 30000; i++) { const x = rn() * ww, y = rn() * wh, r = 8 + rn() * 12; g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.ellipse(x, y + r * 0.7, r * 1.2, r * 0.4, 0, 0, 7); g.fill(); g.fillStyle = '#b8b3a6'; g.beginPath(); g.ellipse(x, y, r, r * 0.75, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.25, 0, 0, 7); g.fill(); }
    // 꽃
    for (let i = 0; i < ww * wh / 2500; i++) { g.fillStyle = ['#fff6a8', '#ffd0dc', '#ffffff'][rint(3)]; g.beginPath(); g.arc(rn() * ww, rn() * wh, 2.2, 0, 7); g.fill(); }
    { const ch = R[key - 1].ch, cast = obj === 'd' || obj === 'b', cxm = ww / 2, cym = wh / 2, far = (x, y) => !(cast && Math.hypot(x - cxm, y - cym) < 340);
      if (ch >= 2) { g.fillStyle = 'rgba(238,246,255,.36)'; g.fillRect(0, 0, ww, wh); for (let i = 0; i < ww * wh / 22000; i++) { const x = rn() * ww, y = rn() * wh, r = 20 + rn() * 50; g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(x, y, r, r * 0.55, 0, 0, 7); g.fill(); } }
      for (let i = 0; i < ww * wh / 800000; i++) { const x = 120 + rn() * (ww - 360), y = 120 + rn() * (wh - 300), w = 150 + rn() * 130, h = 90 + rn() * 70; if (!far(x, y) || !far(x + w, y + h)) continue; g.fillStyle = ch >= 2 ? '#dfe9d6' : '#9fcb6a'; g.fillRect(x, y, w, h); g.strokeStyle = ch >= 2 ? '#b9c8ad' : '#7fae4e'; g.lineWidth = 2; for (let yy = y + 10; yy < y + h; yy += 12) { g.beginPath(); g.moveTo(x + 4, yy); g.lineTo(x + w - 4, yy); g.stroke(); } g.strokeStyle = '#b89462'; g.lineWidth = 5; g.strokeRect(x, y, w, h); }
      for (let i = 0; i < 4 + (ww > 3000 ? 3 : 0); i++) { const x = 160 + rn() * (ww - 520), y = 160 + rn() * (wh - 320), w = 180 + rn() * 160; if (!far(x, y) || !far(x + w, y)) continue; g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + 6, y + 18, w, 18); g.fillStyle = '#c9c2b2'; g.fillRect(x, y, w, 28); g.strokeStyle = '#7d7566'; g.lineWidth = 3; g.strokeRect(x, y, w, 28); g.beginPath(); for (let xx = x + 24; xx < x + w; xx += 24) { g.moveTo(xx, y); g.lineTo(xx, y + 28); } g.stroke(); for (let xx = x; xx < x + w - 10; xx += 28) { g.fillStyle = '#d6cfbf'; g.fillRect(xx + 2, y - 11, 16, 12); g.strokeRect(xx + 2, y - 11, 16, 12); } }
      for (let i = 0; i < ww * wh / 700000; i++) { const x = 140 + rn() * (ww - 300), y = 150 + rn() * (wh - 300); if (!far(x, y)) continue; g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + 30, 58, 13, 0, 0, 7); g.fill(); g.fillStyle = '#f4ead2'; g.fillRect(x - 38, y - 8, 76, 36); g.strokeStyle = '#6a4a2a'; g.lineWidth = 2.5; g.strokeRect(x - 38, y - 8, 76, 36); g.fillStyle = '#4a4f58'; g.beginPath(); g.moveTo(x - 58, y - 4); g.quadraticCurveTo(x - 40, y - 8, x - 28, y - 34); g.lineTo(x + 28, y - 34); g.quadraticCurveTo(x + 40, y - 8, x + 58, y - 4); g.quadraticCurveTo(x, y + 6, x - 58, y - 4); g.fill(); g.stroke(); g.fillStyle = '#7a4a24'; g.fillRect(x - 8, y + 4, 16, 24); }
      for (let i = 0; i < 9; i++) { const x = 100 + rn() * (ww - 200), y = 140 + rn() * (wh - 240); if (!far(x, y)) continue; const col = rn() < 0.5 ? '#d9453a' : '#3f6fd6'; g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + 4, 14, 5, 0, 0, 7); g.fill(); g.fillStyle = '#6a4222'; g.fillRect(x - 2, y - 62, 4, 66); g.fillStyle = col; g.beginPath(); g.moveTo(x + 2, y - 62); g.quadraticCurveTo(x + 30, y - 58, x + 40, y - 46); g.quadraticCurveTo(x + 22, y - 36, x + 2, y - 36); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.stroke(); }
      for (let i = 0; i < 8; i++) { const x = 120 + rn() * (ww - 240), y = 120 + rn() * (wh - 240); if (!far(x, y)) continue; g.fillStyle = 'rgba(50,38,30,.32)'; g.beginPath(); g.ellipse(x, y, 46 + rn() * 26, 22 + rn() * 12, 0, 0, 7); g.fill(); for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#ff9a2e' : '#ffd84a'; g.fillRect(x + rn() * 60 - 30, y + rn() * 24 - 12, 3, 3); } g.strokeStyle = '#4a3320'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 10, y + 6); g.lineTo(x + 10, y - 6); g.moveTo(x + 10, y + 6); g.lineTo(x - 10, y - 6); g.stroke(); }
      for (let i = 0; i < 10; i++) { const x = 100 + rn() * (ww - 200), y = 120 + rn() * (wh - 220); if (!far(x, y)) continue; g.strokeStyle = '#6a4a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 12, y + 6); g.lineTo(x + 14, y - 14); g.stroke(); g.fillStyle = '#b4bfca'; g.beginPath(); g.moveTo(x + 14, y - 14); g.lineTo(x + 20, y - 24); g.lineTo(x + 8, y - 18); g.fill(); }
    }
    // 초가집
    for (let i = 0; i < ww * wh / 260000; i++) { const x = 140 + rn() * (ww - 280), y = 140 + rn() * (wh - 280); g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + 24, 46, 12, 0, 0, 7); g.fill(); g.fillStyle = '#f1e3c4'; g.fillRect(x - 30, y - 8, 60, 30); g.fillStyle = '#d8b66e'; g.beginPath(); g.moveTo(x - 42, y - 6); g.lineTo(x, y - 40); g.lineTo(x + 42, y - 6); g.closePath(); g.fill(); g.strokeStyle = '#8c6a44'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#8c6a44'; g.fillRect(x - 6, y + 4, 12, 18); }
    // 나무 (먼저 아래쪽부터)
    const trees = []; for (let i = 0; i < ww * wh / 17000; i++) { const tx = rn() * ww, ty = rn() * wh; if (Math.hypot(tx - ww / 2, ty - wh / 2) < 230 && obj !== 'e' && obj !== 'r') continue; if (obj === 'e' && tx < 420) continue; trees.push([tx, ty, 22 + rn() * 18]); } trees.sort((A, B) => A[1] - B[1]);
    for (const [x, y, r] of trees) { g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y + r * 0.9, r * 0.9, r * 0.28, 0, 0, 7); g.fill(); g.fillStyle = '#8c6a44'; g.fillRect(x - 3, y, 6, r * 0.9); const cl = th === 'mount' ? ['#4f9a5c', '#68b36f'] : ['#69b36a', '#86cc7f']; g.fillStyle = cl[0]; g.beginPath(); g.arc(x, y - r * 0.2, r, 0, 7); g.fill(); g.fillStyle = cl[1]; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.45, r * 0.65, 0, 7); g.fill(); }
  }
  g.strokeStyle = 'rgba(70,50,30,.35)'; g.lineWidth = 10; g.strokeRect(0, 0, ww, wh);
  return c;
}
function drawCamp(x, y, hp, tm) {
  cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(x, y + 4, 44, 13, 0, 0, 7); cx.fill();
  cx.fillStyle = '#c8b58a'; cx.fillRect(x - 32, y - 38, 64, 40); cx.fillStyle = '#9c3f34'; cx.beginPath(); cx.moveTo(x - 44, y - 36); cx.lineTo(x, y - 74); cx.lineTo(x + 44, y - 36); cx.closePath(); cx.fill(); cx.strokeStyle = '#5e2118'; cx.lineWidth = 2.5; cx.stroke();
  cx.fillStyle = '#6e4a2a'; cx.fillRect(x - 8, y - 22, 16, 24); cx.fillStyle = '#d9453a'; cx.fillRect(x + 36, y - 82, 3, 60); cx.beginPath(); cx.moveTo(x + 39, y - 82); cx.lineTo(x + 62, y - 74 + Math.sin(tm * 4) * 2); cx.lineTo(x + 39, y - 64); cx.fill();
  const bw = 70; cx.fillStyle = 'rgba(0,0,0,.55)'; rr(x - bw / 2, y - 94, bw, 7, 3.5); cx.fill(); cx.fillStyle = '#ff9a3c'; rr(x - bw / 2, y - 94, bw * Math.max(0.04, hp), 7, 3.5); cx.fill();
}
function lobbyArt() {
  const cv = document.getElementById('lobCv'); if (cv) { const g = cv.getContext('2d'); g.drawImage(makeBg('mount'), 0, 0);
    const sx = 700, sy = 150; let rg = g.createRadialGradient(sx, sy, 20, sx, sy, 190); rg.addColorStop(0, 'rgba(210,90,60,.55)'); rg.addColorStop(1, 'rgba(210,90,60,0)'); g.fillStyle = rg; g.fillRect(sx - 200, sy - 200, 400, 400);
    g.fillStyle = 'rgba(176,44,34,.92)'; g.beginPath(); g.arc(sx, sy, 64, 0, 7); g.fill();
    const peak = (x, h, a, w) => { g.beginPath(); g.moveTo(x - w, 360); g.quadraticCurveTo(x - w * 0.4, 360 - h * 0.45, x - w * 0.08, 360 - h * 0.92); g.quadraticCurveTo(x, 360 - h * 1.02, x + w * 0.1, 360 - h * 0.9); g.quadraticCurveTo(x + w * 0.45, 360 - h * 0.45, x + w, 360); g.closePath(); const f = g.createLinearGradient(0, 360 - h, 0, 370); f.addColorStop(0, 'rgba(40,46,44,' + a + ')'); f.addColorStop(1, 'rgba(40,46,44,.08)'); g.fillStyle = f; g.fill(); };
    g.save(); if ('filter' in g) g.filter = 'blur(1.6px)'; peak(430, 120, 0.34, 150); peak(560, 190, 0.5, 170); peak(700, 150, 0.42, 150); peak(830, 210, 0.55, 170); peak(930, 120, 0.4, 120); g.restore();
    g.fillStyle = 'rgba(240,230,205,.65)'; const mg = g.createLinearGradient(0, 300, 0, 380); mg.addColorStop(0, 'rgba(240,230,205,0)'); mg.addColorStop(0.6, 'rgba(240,230,205,.7)'); mg.addColorStop(1, 'rgba(240,230,205,0)'); g.fillStyle = mg; g.fillRect(0, 300, 960, 80);
    const gd = g.createLinearGradient(0, 400, 0, 540); gd.addColorStop(0, 'rgba(110,86,52,0)'); gd.addColorStop(1, 'rgba(80,58,30,.55)'); g.fillStyle = gd; g.fillRect(0, 400, 960, 140);
    g.strokeStyle = 'rgba(30,24,16,.8)'; g.lineCap = 'round'; for (let i = 0; i < 6; i++) { const bx = 560 + i * 26 + (i % 2) * 8, by = 70 + (i % 3) * 16 + i * 4; g.lineWidth = 2; g.beginPath(); g.moveTo(bx - 8, by); g.quadraticCurveTo(bx - 3, by - 6, bx, by); g.quadraticCurveTo(bx + 3, by - 6, bx + 8, by); g.stroke(); }
    const lg = g.createLinearGradient(0, 0, 560, 0); lg.addColorStop(0, 'rgba(238,228,202,.82)'); lg.addColorStop(0.6, 'rgba(238,228,202,.45)'); lg.addColorStop(1, 'rgba(238,228,202,0)'); g.fillStyle = lg; g.fillRect(0, 0, 560, 540);
    // 소나무 가지 (오른쪽 위)
    g.strokeStyle = '#2a2016'; g.lineWidth = 7; g.beginPath(); g.moveTo(980, 20); g.quadraticCurveTo(900, 40, 840, 18); g.stroke(); g.lineWidth = 4; g.beginPath(); g.moveTo(900, 36); g.quadraticCurveTo(880, 70, 850, 84); g.stroke();
    for (const [px, py, r] of [[850, 22, 34], [815, 26, 24], [858, 88, 28], [925, 40, 30], [880, 50, 22]]) for (let k = 0; k < 26; k++) { const an = k * 0.35 + px, rr2 = r * (0.5 + (k % 5) * 0.12); g.strokeStyle = 'rgba(38,58,36,.75)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(an) * rr2, py + Math.sin(an) * rr2 * 0.7 + 6); g.stroke(); }
  }
  const el = document.getElementById('lobArt'); if (!el || !window.SPR) return;
  const L = [['gate', 360, 110, 0.55], ['jp_boss', 20, 150, 1], ['h_militia', 80, 215, 1], ['h_archer', 175, 262, 1], ['h_monk', 285, 228, 1], ['h_cannon', 372, 205, 1]];
  L.forEach(([n, x, h, o], i) => { const S = SPR[n]; if (!S) return; const im = document.createElement('img'); im.src = S.p || S.d; im.style.left = x + 'px'; im.style.height = h + 'px'; im.style.opacity = o; im.style.animationDelay = (i * 0.5) + 's'; if (n === 'gate') { im.style.bottom = '140px'; im.style.left = '395px'; im.style.animation = 'none'; } el.appendChild(im); });
}
function unitFig(kind, x, y, lv, c, tm) {
  const r = 12 + lv * 1.5, bob = Math.sin(tm * 4 + x) * 1.2; y += bob;
  if (kind === 'cav') drawHorse(x, y, r);
  weapon(kind, x, y, r); blob(x, y, r, '#ffffff', c, '#fff', c); face(x, y + 1, r * 0.9, 'happy'); gear(kind, x, y, r);
}
function draw() {
  if (V.ph !== 'battle' && V.ph !== 'result') return; const th = THEME[R[V.rd].th], tm = performance.now() / 1000;
  if (lastBh >= 0 && V.bh < lastBh - 0.5) shake = Math.max(shake, 0.18); lastBh = V.bh;
  { const rs = cv.width / W; cx.setTransform(rs, 0, 0, rs, 0, 0); } const LOW = isLow(), DT = LOW ? 1 / 30 : 1 / 60;
  cx.save(); if (shake > 0) { cx.translate((Math.random() - 0.5) * shake * 26, (Math.random() - 0.5) * shake * 26); shake = Math.max(0, shake - 1 / 60); }
  if (!V.ww) { cx.restore(); return; }
  cx.fillStyle = th[1]; cx.fillRect(-20, -20, W + 40, H + 40);
  { const me = RP.get(Net.id) || [V.ax, V.ay]; const VW = W / Z, VH = H / Z, tx = Math.max(0, Math.min(V.ww - VW, me[0] - VW * (V.obj === 'e' ? 0.32 : 0.5))), ty = Math.max(0, Math.min(V.wh - VH, me[1] - VH / 2)); if (cam.rd !== V.rd || cam.t0 !== V.ww) { cam.x = tx; cam.y = ty; cam.rd = V.rd; cam.t0 = V.ww; } else { const ca = 1 - Math.exp(-DT * 9); cam.x += (tx - cam.x) * ca; cam.y += (ty - cam.y) * ca; } }
  cx.save(); cx.scale(Z, Z); cx.translate(-cam.x, -cam.y);
  const rth = R[V.rd].th; cx.drawImage(WLD[V.rd] || (WLD[V.rd] = makeWorld(rth, V.ww, V.wh, V.obj, V.rd + 1)), 0, 0);
  const SP = []; for (let i = 0; i < SLOTN; i++) SP.push(slotPos(i, V.ax, V.ay));
  // 성 / 목표물
  if (V.castle && rth === 'sea') { cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(V.ax, V.ay + 30, 150, 100, 0, 0, 7); cx.fill(); cx.fillStyle = '#6e4a2a'; cx.fillRect(V.ax - 6, V.ay - 110, 12, 150); cx.fillStyle = '#f3ead2'; cx.strokeStyle = '#8c6a44'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(V.ax + 6, V.ay - 104); cx.quadraticCurveTo(V.ax + 80 + Math.sin(tm * 2) * 5, V.ay - 70, V.ax + 6, V.ay - 20); cx.closePath(); cx.fill(); cx.stroke(); cx.fillStyle = '#d9453a'; cx.beginPath(); cx.moveTo(V.ax - 6, V.ay - 110); cx.lineTo(V.ax - 52, V.ay - 98 + Math.sin(tm * 4) * 3); cx.lineTo(V.ax - 6, V.ay - 84); cx.fill();
    cx.fillStyle = 'rgba(0,0,0,.55)'; rr(V.ax - 56, V.ay - 128, 112, 10, 5); cx.fill(); cx.fillStyle = V.bh / V.bm > 0.3 ? '#7ddf8b' : '#ff6b6b'; rr(V.ax - 56, V.ay - 128, 112 * Math.max(0.03, V.bh / V.bm), 10, 5); cx.fill(); }
  else if (V.castle) { const wob = Math.sin(tm * 2) * 0.01; cx.fillStyle = 'rgba(0,0,0,.16)'; cx.beginPath(); cx.ellipse(V.ax, V.ay + 20, 170, 120, 0, 0, 7); cx.fill(); cx.strokeStyle = '#a7a094'; cx.lineWidth = 14; cx.beginPath(); cx.ellipse(V.ax, V.ay + 8, 160, 112, 0, 0, 7); cx.stroke(); cx.strokeStyle = '#d6d0c2'; cx.lineWidth = 8; cx.stroke(); cx.fillStyle = 'rgba(214,186,130,.45)'; cx.fill();
    shade(V.ax, V.ay + 46, 50, 0.3); spr('gate', V.ax, V.ay + 44, 100, { lean: wob });
    cx.fillStyle = 'rgba(0,0,0,.55)'; rr(V.ax - 56, V.ay - 76, 112, 10, 5); cx.fill(); cx.fillStyle = V.bh / V.bm > 0.3 ? '#7ddf8b' : '#ff6b6b'; rr(V.ax - 56, V.ay - 76, 112 * Math.max(0.03, V.bh / V.bm), 10, 5); cx.fill(); }
  if (V.obj === 'e') (V.goals || []).forEach((q, i) => { const done = i < V.gi, cur = i === V.gi; cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(q[0], q[1] + 6, 40, 12, 0, 0, 7); cx.fill(); cx.fillStyle = '#7a4a24'; cx.fillRect(q[0] - 3, q[1] - 90, 6, 96); cx.fillStyle = done ? '#9aa39a' : (i === V.goals.length - 1 ? '#f0c040' : '#e04a3c'); cx.beginPath(); cx.moveTo(q[0] + 3, q[1] - 90); cx.lineTo(q[0] + 52, q[1] - 76 + Math.sin(tm * 4 + i) * 3); cx.lineTo(q[0] + 3, q[1] - 56); cx.fill(); if (cur) { cx.strokeStyle = '#ffd34d'; cx.lineWidth = 4; cx.setLineDash([8, 8]); cx.lineDashOffset = -tm * 20; cx.beginPath(); cx.ellipse(q[0], q[1] + 6, 85, 38, 0, 0, 7); cx.stroke(); cx.setLineDash([]); } });
  // 슬롯 바닥
  SP.forEach((s, i) => { if (i >= (V.slots || 8)) return; cx.fillStyle = 'rgba(70,46,22,.14)'; cx.beginPath(); cx.ellipse(s[0], s[1] + 16, 22, 9, 0, 0, 7); cx.fill(); cx.setLineDash([4, 5]); cx.strokeStyle = sel === i ? '#a8322a' : 'rgba(70,46,22,.4)'; cx.lineWidth = sel === i ? 3 : 1.5; cx.stroke(); cx.setLineDash([]); });
  for (const c of V.cr || []) { const bob = Math.sin(tm * 3 + c.length) * 2, chest = c[2] === 'chest'; cx.fillStyle = 'rgba(0,0,0,.2)'; cx.beginPath(); cx.ellipse(c[0], c[1] + 10, 22, 7, 0, 0, 7); cx.fill();
    cx.fillStyle = chest ? '#e6b53c' : '#c8985a'; cx.strokeStyle = chest ? '#7a4a00' : '#6e4a2a'; cx.lineWidth = 2.5; rr(c[0] - 17, c[1] - 24 + bob, 34, 30, 5); cx.fill(); cx.stroke(); cx.strokeStyle = chest ? '#fff3b0' : '#9c7040'; cx.beginPath(); cx.moveTo(c[0] - 17, c[1] - 12 + bob); cx.lineTo(c[0] + 17, c[1] - 12 + bob); cx.stroke();
    cx.font = '16px sans-serif'; cx.textAlign = 'center'; cx.fillText(chest ? '🎁' : '🌾', c[0], c[1] - 3 + bob); if (chest) { cx.globalAlpha = 0.4 + 0.3 * Math.sin(tm * 6); cx.strokeStyle = '#fff3b0'; cx.lineWidth = 3; cx.beginPath(); cx.arc(c[0], c[1] - 8, 26, 0, 7); cx.stroke(); cx.globalAlpha = 1; } }
  for (const c of V.cr || []) if (c[2] === 'magnet') { const bob = Math.sin(tm * 3 + c[0]) * 3; cx.fillStyle = 'rgba(255,80,60,.25)'; cx.beginPath(); cx.arc(c[0], c[1] - 12 + bob, 26, 0, 7); cx.fill(); cx.fillStyle = '#fff6e0'; cx.strokeStyle = '#7a2a1a'; cx.lineWidth = 2.5; cx.beginPath(); cx.arc(c[0], c[1] - 12 + bob, 17, 0, 7); cx.fill(); cx.stroke(); cx.imageSmoothingEnabled = false; cx.drawImage(ICOC('magnet'), c[0] - 11, c[1] - 24 + bob, 22, 22); cx.imageSmoothingEnabled = true; }
  for (const q of V.so || []) { const bb = Math.sin(tm * 4 + q[0] * 0.05) * 2.5, sz = q[2] > 2 ? 1.4 : 1; cx.fillStyle = 'rgba(120,215,255,.28)'; cx.beginPath(); cx.arc(q[0], q[1] - 7 + bb, 13 * sz, 0, 7); cx.fill(); cx.fillStyle = '#bff3ff'; cx.beginPath(); cx.moveTo(q[0], q[1] - 22 * sz + bb); cx.quadraticCurveTo(q[0] + 8 * sz, q[1] - 8 + bb, q[0], q[1] + bb); cx.quadraticCurveTo(q[0] - 8 * sz, q[1] - 8 + bb, q[0], q[1] - 22 * sz + bb); cx.fill(); cx.fillStyle = '#fff'; cx.beginPath(); cx.ellipse(q[0], q[1] - 7 + bb, 2.6 * sz, 5 * sz, 0, 0, 7); cx.fill(); }
  const FC = { 왜군: ['#ff9a8f', '#d9453a'], 후금군: ['#d9a4ff', '#8e3fd0'], 청군: ['#8fc2ff', '#2f6fd6'] }[CH[R[V.rd].ch].foe], FP = FOEP[CH[R[V.rd].ch].foe];
  const DL = []; // 깊이(y) 순서로 그리기
  SP.forEach((s, i) => { const u = V.un && V.un[i]; if (!u) return; DL.push([s[1] + 16, () => { const T = UT[u.t], key = 'u' + i, kk = kickOf(key, tm), h = 46 + u.lv * 4, fl = FACE.has(key) ? FACE.get(key) : false;
      shade(s[0], s[1] + 16, 15 + u.lv * 2); spr(USP[u.t], s[0], s[1] + 16, h, { fr: fr10(tm, i * 7), flip: fl, bob: Math.abs(Math.sin(tm * 2.2 + i)) * 1.2, dx: kk.dx, dy: kk.dy, sx: kk.sx, sy: kk.sy * (1 + Math.sin(tm * 2 + i) * 0.012) });
      if (u.lv > 1) { cx.strokeStyle = T.c; cx.globalAlpha = 0.6; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(s[0], s[1] + 16, 18 + u.lv * 2, 8 + u.lv, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
      for (let k = 0; k < u.lv; k++) { cx.fillStyle = '#ffd34d'; cx.strokeStyle = '#8a5a00'; cx.lineWidth = 1; cx.beginPath(); cx.arc(s[0] - (u.lv - 1) * 4.5 + k * 9, s[1] + 28, 3.4, 0, 7); cx.fill(); cx.stroke(); }
      if (sel === i) pill(T.n + ' Lv.' + u.lv, s[0], s[1] + 16 - h - 8, '#ffffff', '#2b2440'); }]); });
  for (const e of V.en || []) { const T = ET[e[1]], q = lerpTo('e' + e[0], e[2], e[3], 0.5), ek = 'e' + e[0], el = e[6], h = EH[e[1]] * (e[6] ? 1.25 : 1), ph = tm * (e[1] === 'cav' ? 12 : 8) + e[0] * 1.7, sn = Math.sin(ph);
    if (Math.abs(q[4] || 0) > 12) FACE.set(ek, q[4] < 0); const fl = FACE.get(ek) || false, fy = q[1] + 12;
    DL.push([fy, () => { if (e[1] === 'camp') { if (FP === 'jp') drawCamp(q[0], fy, e[4], tm); else { shade(q[0], fy, 44, 0.25); spr('camp', q[0], fy + 6, 72, { flash: e[5] }); const bw = 70; cx.fillStyle = 'rgba(0,0,0,.55)'; rr(q[0] - bw / 2, fy - 100, bw, 7, 3.5); cx.fill(); cx.fillStyle = '#ff9a3c'; rr(q[0] - bw / 2, fy - 100, bw * Math.max(0.04, e[4]), 7, 3.5); cx.fill(); } return; } const w = h * 0.32;
      if (e[1] === 'boss') { cx.strokeStyle = 'rgba(255,60,60,.6)'; cx.lineWidth = 4; cx.beginPath(); cx.ellipse(q[0], fy, 34 + Math.sin(tm * 5) * 3, 13, 0, 0, 7); cx.stroke(); }
      if (el) { cx.strokeStyle = '#ffcf33'; cx.lineWidth = 4; cx.globalAlpha = 0.6 + 0.3 * Math.sin(tm * 6); cx.beginPath(); cx.ellipse(q[0], fy, w * 1.15, w * 0.42, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
      shade(q[0], fy, w); if (!LOW) { cx.strokeStyle = FC[1]; cx.globalAlpha = 0.85; cx.lineWidth = 3; cx.beginPath(); cx.ellipse(q[0], fy, w * 0.95, w * 0.34, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
      spr(FP + '_' + ETK[e[1]], q[0], fy, h, { fr: fr10(tm, e[0] * 3), flip: fl, bob: Math.abs(sn) * (e[1] === 'cav' ? 4.5 : 3.2), lean: sn * 0.055, sx: 1 + Math.sin(ph * 2) * 0.025, sy: 1 - Math.sin(ph * 2) * 0.02, flash: e[5] });
      if (e[4] < 1 || el) { const bw = Math.max(26, h * 0.5), by = fy - h - 6; if (el) { cx.fillStyle = '#ffcf33'; cx.font = 'bold 13px sans-serif'; cx.textAlign = 'center'; cx.fillText('★정예', q[0], by - 4); } cx.fillStyle = 'rgba(0,0,0,.55)'; rr(q[0] - bw / 2, by, bw, 5, 2.5); cx.fill(); cx.fillStyle = '#ff6b6b'; rr(q[0] - bw / 2, by, bw * Math.max(0.05, e[4]), 5, 2.5); cx.fill(); } }]); }
  for (const p of V.pl) { const q = lerpTo(p.id, p.x, p.y, 0.45), mine = p.id === Net.id, key = 'h' + p.id, mv = Math.hypot(q[4] || 0, q[5] || 0) / 20, kk = kickOf(key, tm), fy = q[1] + 18, H = 62;
    if (Math.abs(q[4] || 0) > 25 && !(KICK.has(key) && tm - KICK.get(key).t < 0.5)) FACE.set(key, q[4] < 0);
    DL.push([mine ? fy + 70 : fy, () => { const walk = Math.min(1, mv / 4), sn = Math.sin(tm * 10 + p.id.length), dn = p.down > 0; cx.globalAlpha = dn ? 0.45 : (p.fz > 0 && Math.floor(performance.now() / 120) % 2 ? 0.65 : 1);
      if (p.cards && p.cards.spear && !dn) { const n = 1 + p.cards.spear + (p.cards.evo_spear ? 3 : 0), R0 = 84 + 6 * p.cards.spear + (p.cards.evo_spear ? 24 : 0); for (let k = 0; k < n; k++) { const a = tm * 3.4 + k * 6.283 / n, sx = q[0] + Math.cos(a) * R0, sy = q[1] + Math.sin(a) * R0 * 0.9; cx.save(); cx.translate(sx, sy); cx.rotate(a + 1.57); cx.scale(1.5, 1.5); cx.strokeStyle = '#6e4a2a'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(0, 20); cx.lineTo(0, -12); cx.stroke(); cx.fillStyle = 'rgba(255,255,255,.22)'; cx.beginPath(); cx.arc(0, -16, 17, 0, 7); cx.fill(); cx.fillStyle = '#e8eef2'; cx.strokeStyle = '#4a5560'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(0, -30); cx.lineTo(-6, -12); cx.lineTo(6, -12); cx.closePath(); cx.fill(); cx.stroke(); cx.restore(); } }
      shade(q[0], fy, 20);
      if (!dn && p.cards) { if (p.cards.powder) { cx.fillStyle = 'rgba(255,150,50,' + (0.14 + 0.05 * p.cards.powder) + ')'; cx.beginPath(); cx.ellipse(q[0], fy, 22 + p.cards.powder * 3, 9 + p.cards.powder, 0, 0, 7); cx.fill(); }
        if (p.cards.armor) { cx.strokeStyle = 'rgba(130,190,255,.6)'; cx.lineWidth = 1.5 + p.cards.armor * 0.5; cx.beginPath(); cx.ellipse(q[0], fy - 14, 18 + p.cards.armor * 2, 26 + p.cards.armor * 2, 0, 0, 7); cx.stroke(); } }
      if (mine) { if (p.rg && !dn) { cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.fillStyle = 'rgba(255,255,255,.07)'; cx.lineWidth = 2; cx.setLineDash([10, 9]); cx.beginPath(); cx.arc(q[0], fy - 18, p.rg, 0, 7); cx.fill(); cx.stroke(); cx.setLineDash([]); } cx.fillStyle = 'rgba(255,230,120,.35)'; cx.beginPath(); cx.ellipse(q[0], fy, 34, 13, 0, 0, 7); cx.fill(); cx.strokeStyle = '#e8402f'; cx.lineWidth = 4; cx.beginPath(); cx.ellipse(q[0], fy, 28 + Math.sin(tm * 4) * 1.5, 11, 0, 0, 7); cx.stroke(); }
      spr(RSP[p.role], q[0], fy, H, { fr: fr10(tm, p.id.length * 5), flip: !!FACE.get(key), bob: Math.abs(sn) * 3.5 * walk + Math.sin(tm * 2) * 0.8, lean: dn ? -1.35 : sn * 0.05 * walk, dx: kk.dx, dy: kk.dy, sx: kk.sx, sy: kk.sy });
      cx.globalAlpha = 1;
      if (mine) { const by = fy - H * SPS - 44 + Math.sin(tm * 5) * 4; cx.fillStyle = '#e8402f'; cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(q[0], by + 10); cx.lineTo(q[0] - 11, by - 8); cx.lineTo(q[0] + 11, by - 8); cx.closePath(); cx.stroke(); cx.fill(); }
      if (mine && p.cards) { const ks = ORD.filter((k) => p.cards[k]); cx.imageSmoothingEnabled = false; ks.forEach((k, i) => { const ix = q[0] - ks.length * 8 + i * 16; cx.fillStyle = 'rgba(30,22,10,.65)'; rr(ix - 1, fy - H * SPS - 43, 16, 16, 3); cx.fill(); cx.drawImage(ICOC(k), ix, fy - H * SPS - 42, 14, 14); }); cx.imageSmoothingEnabled = true; }
      pill(mine ? '★ ' + p.name : p.name, q[0], fy - H * SPS - 20, mine ? '#ffd34d' : 'rgba(20,18,40,.75)', mine ? '#2b2440' : '#fff');
      cx.fillStyle = 'rgba(0,0,0,.55)'; rr(q[0] - 20, fy - H * SPS - 11, 40, 5, 2.5); cx.fill(); cx.fillStyle = '#7dffa0'; rr(q[0] - 20, fy - H * SPS - 11, 40 * Math.max(0.05, p.hp / p.mx), 5, 2.5); cx.fill();
      if (dn) pill(Math.ceil(p.down) + '초 뒤 복귀', q[0], fy + 14, 'rgba(20,18,40,.8)', '#fff'); }]); }
  DL.sort((A, B) => A[0] - B[0]); for (const d of DL) d[1]();
  if (V !== lastPjV) { lastPjV = V; pjT = tm; } const pdt = Math.min(0.2, tm - pjT);
  for (const b of V.pj || []) { const x = b[0] + b[2] * pdt, y = b[1] + b[3] * pdt, L = Math.hypot(b[2], b[3]) || 1, ux = b[2] / L, uy = b[3] / L, gun = b[4] === 'gun'; cx.strokeStyle = gun ? 'rgba(255,190,80,.8)' : 'rgba(255,255,255,.75)'; cx.lineWidth = gun ? 3 : 2; cx.beginPath(); cx.moveTo(x - ux * (gun ? 18 : 14), y - uy * (gun ? 18 : 14)); cx.lineTo(x, y); cx.stroke(); cx.fillStyle = gun ? '#ff6a2a' : '#ffe9a0'; cx.beginPath(); cx.arc(x, y, gun ? 4 : 3, 0, 7); cx.fill(); cx.strokeStyle = 'rgba(255,50,40,.9)'; cx.lineWidth = 1.3; cx.beginPath(); cx.arc(x, y, gun ? 8 : 6, 0, 7); cx.stroke(); }
  // 새 연출 수집
  for (const s of V.sh || []) { effects.push({ k: 'sh', a: s, life: 0.2, mx: 0.2 }); noteShot(s, tm); const kd = s[5] || ''; SFX.p(kd === 'cannon' ? 'cannon' : (kd === 'gun' || kd === 'gunner') ? 'gun' : (kd === 'bow' || kd === 'archer' || kd === 'hwa' || kd === 'ebow') ? 'bow' : 'slash'); }
  if (V.rd !== lastRdX) { lastRdX = V.rd; lastXp = V.xp; } else { if (V.xp > lastXp) SFX.p('pick'); lastXp = V.xp; }
  for (const f of V.fx || []) {
    if (f[3] === 'dmg') { if (!LOW && effects.length < 260) effects.push({ k: 'spark', x: f[0], y: f[1] + 10, a: Math.random() * 6.28, life: 0.16, mx: 0.16 }); SFX.p('hit'); if ((f[2] >= 30 || Math.random() < 0.25) && effects.length < (LOW ? 30 : 120)) effects.push({ k: 'dmg', x: f[0], y: f[1], v: f[2], life: 0.7, mx: 0.7 }); continue; }
    effects.push({ k: f[3], x: f[0], y: f[1], r: f[2], life: f[3] === 'boss' ? 1.2 : f[3] === 'lvl' ? 1.0 : 0.38, mx: f[3] === 'boss' ? 1.2 : f[3] === 'lvl' ? 1.0 : 0.38 });
    if (f[3] === 'die' && f[4] && f[4] !== 'camp' && !LOW && effects.length < 300) effects.push({ k: 'corpse', x: f[0], y: f[1], ty: f[4], life: 0.55, mx: 0.55 });
    if (f[3] === 'die') SFX.p('pop'); else if (f[3] === 'boom') SFX.p('boom'); else if (f[3] === 'gong') SFX.p('gong'); else if (f[3] === 'lvl') SFX.p('lvl'); else if (f[3] === 'boss') SFX.p('boss'); else if (f[3] === 'puff') SFX.p('gun'); else if (f[3] === 'night') { nightBan = 3.6; SFX.p('night'); }
    if (f[3] === 'gong' || f[3] === 'boom') shake = Math.max(shake, f[3] === 'gong' ? 0.2 : 0.1); if (f[3] === 'boss') { bossBan = 3.6; bossName = ET.boss.n; } if (f[3] === 'roar' || f[3] === 'boss') shake = Math.max(shake, 0.35); }
  V.sh = []; V.fx = [];
  const dt = DT;
  for (let i = effects.length - 1; i >= 0; i--) { const f = effects[i]; f.life -= dt; if (f.life <= 0) { effects.splice(i, 1); continue; } const t = 1 - f.life / f.mx;
    if (f.k === 'sh') { const a = f.a, kd = a[5] || ''; const dx = a[2] - a[0], dy = a[3] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      if (kd === 'bow' || kd === 'archer' || kd === 'hwa' || kd === 'ebow') { const p = Math.min(1, t * 1.25), x = a[0] + dx * p, y = a[1] + dy * p; cx.strokeStyle = 'rgba(255,255,255,.35)'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(x - ux * 22, y - uy * 22); cx.lineTo(x, y); cx.stroke(); cx.strokeStyle = kd === 'ebow' ? '#ff9a8a' : '#f3e1b0'; cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(x - ux * 12, y - uy * 12); cx.lineTo(x, y); cx.stroke(); cx.fillStyle = '#fff'; cx.beginPath(); cx.moveTo(x + ux * 5, y + uy * 5); cx.lineTo(x - uy * 3, y + ux * 3); cx.lineTo(x + uy * 3, y - ux * 3); cx.fill(); }
      else if (kd === 'gun' || kd === 'gunner') { const p = Math.min(1, t * 2.2), x = a[0] + dx * p, y = a[1] + dy * p; if (t < 0.3) { cx.fillStyle = 'rgba(255,230,120,' + (1 - t * 3) + ')'; cx.beginPath(); cx.arc(a[0] + ux * 12, a[1] + uy * 12, 8 * (1 - t * 2), 0, 7); cx.fill(); } cx.strokeStyle = 'rgba(255,240,170,.5)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x - ux * 26, y - uy * 26); cx.lineTo(x, y); cx.stroke(); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x, y, 3.2, 0, 7); cx.fill(); }
      else if (kd === 'cannon') { const p = Math.min(1, t * 1.1), x = a[0] + dx * p, y = a[1] + dy * p - Math.sin(Math.PI * p) * 34; cx.fillStyle = 'rgba(0,0,0,.25)'; cx.beginPath(); cx.ellipse(a[0] + dx * p, a[1] + dy * p + 6, 6, 3, 0, 0, 7); cx.fill(); cx.fillStyle = '#2b2f3e'; cx.strokeStyle = '#ffb347'; cx.lineWidth = 2; cx.beginPath(); cx.arc(x, y, 5.5, 0, 7); cx.fill(); cx.stroke(); }
      else { const ang = Math.atan2(dy, dx); cx.globalAlpha = 1 - t; cx.strokeStyle = '#fff'; cx.lineWidth = 5 * (1 - t) + 1; cx.beginPath(); cx.arc(a[2] - ux * 8, a[3] - uy * 8, 15, ang - 1.1 + t * 0.6, ang + 1.1 + t * 0.6); cx.stroke(); cx.globalAlpha = 0.25 * (1 - t); cx.strokeStyle = '#ffe9a0'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(a[2], a[3]); cx.stroke(); cx.globalAlpha = 1; } }
    else if (f.k === 'spark') { cx.strokeStyle = '#fff3b0'; cx.lineWidth = 2; cx.globalAlpha = 1 - t; for (let k = 0; k < 3; k++) { const an = f.a + k * 2.1, r1 = 4 + t * 10, r2 = r1 + 6; cx.beginPath(); cx.moveTo(f.x + Math.cos(an) * r1, f.y + Math.sin(an) * r1); cx.lineTo(f.x + Math.cos(an) * r2, f.y + Math.sin(an) * r2); cx.stroke(); } cx.globalAlpha = 1; }
    else if (f.k === 'puff') { cx.fillStyle = 'rgba(235,235,235,' + (0.6 * (1 - t)) + ')'; cx.beginPath(); cx.arc(f.x, f.y - t * 8, f.r * (0.4 + t), 0, 7); cx.fill(); }
    else if (f.k === 'night') { }
    else if (f.k === 'corpse') { cx.globalAlpha = Math.max(0, 1 - t * 1.1); spr(FP + '_' + ETK[f.ty], f.x, f.y + 12, EH[f.ty], { lean: t * 1.1, sy: 1 - t * 0.2, dy: t * 6, flash: t < 0.3 }); cx.globalAlpha = 1; }
    else if (f.k === 'dmg') { const big = f.v >= 40; cx.globalAlpha = Math.min(1, f.life * 3); cx.font = 'bold ' + (big ? 17 : 13) + 'px sans-serif'; cx.textAlign = 'center'; cx.lineWidth = 3; cx.strokeStyle = 'rgba(20,10,40,.85)'; cx.fillStyle = big ? '#ffe36b' : '#ffffff'; const yy = f.y - t * 22; cx.strokeText(f.v, f.x, yy); cx.fillText(f.v, f.x, yy); cx.globalAlpha = 1; }
    else { const col = f.k === 'lvl' ? '#fff08a' : f.k === 'gong' ? '#ffd34d' : f.k === 'roar' ? '#ffe082' : f.k === 'merge' ? '#fff176' : f.k === 'sum' ? '#80e0ff' : f.k === 'boom' ? '#ffa94d' : f.k === 'die' ? '#6a4524' : '#ff8080'; cx.strokeStyle = col; cx.fillStyle = col; cx.globalAlpha = (1 - t) * 0.9; cx.lineWidth = 5 * (1 - t) + 1; cx.beginPath(); cx.arc(f.x, f.y, f.r * (0.35 + 0.65 * t), 0, 7); if (f.k === 'gong' || f.k === 'boom') { cx.globalAlpha = (1 - t) * 0.28; cx.fill(); cx.globalAlpha = (1 - t) * 0.95; cx.lineWidth = 8 * (1 - t) + 1; } cx.stroke(); if (f.k === 'lvl') { cx.font = 'bold 22px sans-serif'; cx.textAlign = 'center'; cx.lineWidth = 4; cx.strokeStyle = '#7a4a00'; cx.fillStyle = '#fff7a0'; cx.strokeText('LEVEL UP!', f.x, f.y - 60 - t * 34); cx.fillText('LEVEL UP!', f.x, f.y - 60 - t * 34); } if (f.k === 'die' || f.k === 'merge' || f.k === 'sum') { for (let k = 0; k < 6; k++) { const an = k * 1.047 + f.r; cx.beginPath(); cx.arc(f.x + Math.cos(an) * f.r * t * 1.3, f.y + Math.sin(an) * f.r * t * 1.3, 3 * (1 - t) + 0.5, 0, 7); cx.fill(); } } cx.globalAlpha = 1; } }
  // 경험치 구슬: 흩어졌다가 내 영웅에게 빨려 들어감
  const me2 = RP.get(Net.id);
  for (let i = gems.length - 1; i >= 0; i--) { const m = gems[i]; m.t += dt;
    if (m.t < 0.3) { m.x += m.vx * dt; m.y += m.vy * dt; m.vy += 260 * dt; } else if (me2) { const dx = me2[0] - m.x, dy = me2[1] - m.y, d = Math.hypot(dx, dy) || 1, sp = 160 + (m.t - 0.3) * 520; m.x += dx / d * sp * dt; m.y += dy / d * sp * dt; if (d < 14) { gems.splice(i, 1); continue; } } else if (m.t > 1.2) { gems.splice(i, 1); continue; }
    if (m.t > 4) { gems.splice(i, 1); continue; }
    { const oi = okImg('orb'); if (oi) cx.drawImage(oi, m.x - 8, m.y - 8, 16, 16); else { cx.fillStyle = '#9ff2ff'; cx.fillRect(m.x - 3, m.y - 3, 6, 6); } } }
  cx.restore();
  // 화면 밖 표시: 적(빨강) / 목표(노랑)
  if ((V.nl || 0) > 0.01) { if (!nightC) { nightC = document.createElement('canvas'); nightC.width = W; nightC.height = H; } const ng = nightC.getContext('2d'); ng.globalCompositeOperation = 'source-over'; ng.clearRect(0, 0, W, H); ng.fillStyle = 'rgba(6,10,36,' + (V.nd * V.nl) + ')'; ng.fillRect(0, 0, W, H); ng.globalCompositeOperation = 'destination-out';
    const hole = (wx, wy, rad, al) => { const x = (wx - cam.x) * Z, y = (wy - cam.y) * Z, r2 = rad * Z; if (x < -r2 || y < -r2 || x > W + r2 || y > H + r2) return; const gr = ng.createRadialGradient(x, y, r2 * 0.25, x, y, r2); gr.addColorStop(0, 'rgba(0,0,0,' + al + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); ng.fillStyle = gr; ng.beginPath(); ng.arc(x, y, r2, 0, 7); ng.fill(); };
    for (const pp of V.pl) { const q = RP.get(pp.id); if (q) hole(q[0], q[1], 250, 1); } if (V.castle) hole(V.ax, V.ay, 230, 0.9); for (const e of V.en || []) if (e[1] === 'boss' || e[1] === 'camp') { const q = RP.get('e' + e[0]); if (q) hole(q[0], q[1], 130, 0.75); } let ns = 0; for (const q of V.so || []) { if (ns++ > 70) break; hole(q[0], q[1], 48, 0.85); } for (const c of V.cr || []) hole(c[0], c[1], 64, 0.7); for (const b of V.pj || []) hole(b[0], b[1], 40, 0.9);
    cx.drawImage(nightC, 0, 0); }
  if (nightBan > 0) { nightBan -= DT; const a = Math.min(1, nightBan * 2, (3.6 - nightBan) * 4); cx.globalAlpha = a; cx.fillStyle = 'rgba(14,18,60,.88)'; rr(W / 2 - 250, 200, 500, 80, 22); cx.fill(); cx.strokeStyle = '#9fb4ff'; cx.lineWidth = 3; cx.stroke(); cx.textAlign = 'center'; cx.fillStyle = '#e8eeff'; cx.font = 'bold 32px sans-serif'; cx.fillText('🌙 야간 전투!', W / 2, 242); cx.font = '15px sans-serif'; cx.fillStyle = '#c9d4ff'; cx.fillText('시야가 좁아져요. 파란 혼과 탄환의 불빛을 잘 보세요', W / 2, 266); cx.globalAlpha = 1; }
  { const edge = (wx, wy, col, sz, isGoal) => { const sx = (wx - cam.x) * Z, sy = (wy - cam.y) * Z; if (sx > 14 && sx < W - 14 && sy > 14 && sy < H - 14) return false; const cxn = W / 2, cyn = H / 2, dx = sx - cxn, dy = sy - cyn, k = Math.min((W / 2 - 26) / Math.abs(dx || 1e-3), (H / 2 - 26) / Math.abs(dy || 1e-3)), ex = cxn + dx * k, ey = cyn + dy * k, an = Math.atan2(dy, dx);
      cx.save(); cx.translate(ex, ey); cx.rotate(an); cx.fillStyle = col; cx.strokeStyle = 'rgba(40,10,10,.7)'; cx.lineWidth = 2; cx.globalAlpha = isGoal ? 0.95 : 0.8; cx.beginPath(); cx.moveTo(sz, 0); cx.lineTo(-sz * 0.6, -sz * 0.75); cx.lineTo(-sz * 0.6, sz * 0.75); cx.closePath(); cx.fill(); cx.stroke(); cx.restore(); return true; };
    let cnt = 0; for (const e of V.en || []) { const q = RP.get('e' + e[0]); if (!q) continue; if (e[1] === 'camp') { edge(q[0], q[1], '#ffb347', 13, true); continue; } if (cnt < 40 && edge(q[0], q[1], e[1] === 'boss' ? '#ff2a2a' : '#ff6b5e', e[1] === 'boss' ? 14 : 8, false)) cnt++; }
    if (V.obj === 'e' && V.goals[V.gi]) edge(V.goals[V.gi][0], V.goals[V.gi][1], '#ffd34d', 15, true);
    if (!V.castle) { /* 병사 무리 위치 */ } }

  // 미니맵
  { const mw = 132, mh = Math.round(mw * V.wh / V.ww), mx = W - mw - 12, my = 150, k = mw / V.ww;
    cx.fillStyle = 'rgba(40,34,22,.45)'; rr(mx - 4, my - 4, mw + 8, mh + 8, 8); cx.fill(); cx.fillStyle = 'rgba(190,225,170,.75)'; cx.fillRect(mx, my, mw, mh);
    if (V.castle) { cx.fillStyle = '#fff'; cx.fillRect(mx + V.ax * k - 4, my + V.ay * k - 4, 8, 8); }
    if (V.obj === 'e') (V.goals || []).forEach((q, i) => { cx.fillStyle = i < V.gi ? '#8a948a' : '#ffd34d'; cx.fillRect(mx + q[0] * k - 3, my + q[1] * k - 5, 6, 10); });
    for (const e of V.en || []) { const q = RP.get('e' + e[0]); if (!q) continue; if (e[1] === 'camp') { cx.fillStyle = '#ff8c1a'; cx.fillRect(mx + q[0] * k - 3, my + q[1] * k - 3, 7, 7); } else { cx.fillStyle = e[1] === 'boss' ? '#ff1f1f' : '#e0453a'; const sz = e[1] === 'boss' ? 5 : 2; cx.fillRect(mx + q[0] * k - sz / 2, my + q[1] * k - sz / 2, sz, sz); } }
    for (const c of V.cr || []) { cx.fillStyle = c[2] === 'chest' ? '#ffd34d' : '#b98a4f'; cx.fillRect(mx + c[0] * k - 2, my + c[1] * k - 2, 5, 5); }
    for (const pp of V.pl) { const q = RP.get(pp.id); if (!q) continue; cx.fillStyle = pp.id === Net.id ? '#ffe14a' : '#3fa0ff'; cx.beginPath(); cx.arc(mx + q[0] * k, my + q[1] * k, pp.id === Net.id ? 4 : 3, 0, 7); cx.fill(); }
    cx.strokeStyle = '#fff'; cx.lineWidth = 1.5; cx.strokeRect(mx + cam.x * k, my + cam.y * k, W / Z * k, H / Z * k); }
  // 적장 체력바 + 등장 배너
  { const bs = (V.en || []).find((e) => e[1] === 'boss'); if (bs) { const bw = 300, bx = W / 2 - bw / 2, by = 112; cx.fillStyle = 'rgba(40,20,20,.7)'; rr(bx - 4, by - 4, bw + 8, 24, 12); cx.fill(); cx.fillStyle = '#ff5a4a'; rr(bx, by, bw * Math.max(0.03, bs[4]), 16, 8); cx.fill(); cx.fillStyle = '#fff'; cx.font = 'bold 13px sans-serif'; cx.textAlign = 'center'; cx.fillText('적장 ' + ((BOSSN[V.rd] || [''])[0]), W / 2, by + 13); }
    if (bossBan > 0) { bossBan -= DT; const tot = 3.6, el = tot - bossBan, a = Math.min(1, bossBan * 2, el * 4), bn = BOSSN[V.rd] || ['적장', ''], off = Math.max(0, 1 - el * 2.5) * 380; cx.save(); cx.globalAlpha = a; cx.fillStyle = 'rgba(0,0,0,.6)'; cx.fillRect(0, 0, W, 58); cx.fillRect(0, H - 58, W, 58); cx.fillStyle = 'rgba(110,16,16,.9)'; cx.fillRect(0, 188, W, 124);
      cx.textAlign = 'center'; cx.fillStyle = Math.floor(el * 6) % 2 ? '#ffd34d' : '#fff'; cx.font = 'bold 16px sans-serif'; cx.fillText('⚠ WARNING — 적장 등장 ⚠', W / 2 + 70, 214); cx.fillStyle = '#fff'; cx.font = 'bold 48px sans-serif'; cx.fillText(bn[0], W / 2 + 70 + off, 268); cx.fillStyle = '#ffe9a0'; cx.font = 'bold 18px sans-serif'; cx.fillText(bn[1] + ' · 쓰러뜨리면 전투의 흐름이 바뀌어요', W / 2 + 70 - off, 296); cx.restore(); cx.globalAlpha = a; spr(FP + '_boss', 150 - off, 312, 215, {}); cx.globalAlpha = 1; } }
  // 라운드 시작 안내
  if (V.ph === 'battle' && V.t < 5 && !V.paused) { const OI = OBJINFO[V.obj], r = R[V.rd], a = Math.min(1, (5 - V.t) * 1.2, V.t * 3 + 0.2); cx.globalAlpha = a; cx.fillStyle = 'rgba(40,30,20,.82)'; rr(W / 2 - 300, 190, 600, 112, 24); cx.fill(); cx.strokeStyle = '#ffe9a0'; cx.lineWidth = 3; cx.stroke(); cx.textAlign = 'center'; cx.fillStyle = '#ffe9a0'; cx.font = 'bold 15px sans-serif'; cx.fillText(r.yr + '년 · ' + r.pl + ' — ' + r.nm, W / 2, 218); cx.fillStyle = '#fff'; cx.font = 'bold 30px sans-serif'; cx.fillText(OI.ic + ' ' + OI.n, W / 2, 256); cx.font = '15px sans-serif'; cx.fillStyle = '#f3e7cc'; cx.fillText(objText(V.rd, V.obj), W / 2, 284); cx.globalAlpha = 1; }
  // 역사 자막
  { const rd = R[V.rd]; if (!CAPS[V.rd]) CAPS[V.rd] = (rd.b + ' ' + rd.r).split(/(?<=[.!?])\s+/).filter((x) => x.length > 6); const cs = CAPS[V.rd], prog = V.t / V.dur, win = Math.min(0.14, 8 / V.dur);
    const slots = [0.06, 0.38, 0.7]; let ci = -1; slots.forEach((a, i) => { if (prog >= a && prog < a + win) ci = i; });
    if (ci >= 0 && cs[ci] && V.ph === 'battle' && !V.paused && !V.vp && !((V.pl.find((x) => x.id === Net.id) || {}).offer)) { const txt = cs[ci]; cx.font = 'bold 16px sans-serif'; const lines = []; let cur = ''; for (const ch of txt) { cur += ch; if (cx.measureText(cur).width > 540) { lines.push(cur); cur = ''; } } if (cur) lines.push(cur);
      const hh = lines.length * 22 + 16, bx = W / 2 - 290, by = H - hh - 18; cx.fillStyle = 'rgba(252,244,224,.92)'; cx.strokeStyle = '#5b4636'; cx.lineWidth = 2.5; rr(bx, by, 580, hh, 14); cx.fill(); cx.stroke(); cx.fillStyle = '#4a2f1d'; cx.textAlign = 'left'; lines.slice(0, 3).forEach((l, i) => cx.fillText((i === 0 ? '📜 ' : '') + l, bx + 14, by + 26 + i * 22)); } }
  if (V.buff) { cx.fillStyle = 'rgba(255,200,0,.08)'; cx.fillRect(0, 0, W, H); }
  if (V.evR) { cx.fillStyle = 'rgba(20,16,40,.85)'; rr(250, 214, 460, 66, 33); cx.fill(); cx.fillStyle = '#fff'; cx.font = 'bold 22px sans-serif'; cx.textAlign = 'center'; cx.fillText('결정: ' + V.evR, 480, 255); }
  cx.restore();
}
function boot() { initLobby(); setupInput(); applySt(); show('sLobby'); window.__dbg = { get G() { return G; }, get V() { return V; }, Net, R, hostCtl, hostMsg, stepBattle, makeSnap }; }
boot();
lobbyArt();
if (window.BWJ) BWJ.init({ game: '조선의 위기 디펜스', ver: 'v0.14', parent: '#stage' });
