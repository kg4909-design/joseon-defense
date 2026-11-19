'use strict';
// ====== 조선의 위기 디펜스 : 클라이언트 + 호스트 시뮬레이션 ======
const W = 960, H = 540;
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
const ROLE = { // 영웅(플레이어)
  archer: { n: '궁수',   c: '#f2d65a', rg: 175, dmg: 10, rt: 1.3, hp: 120, sp: 120, aoe: 0 },
  militia:{ n: '의병',   c: '#6fd07d', rg: 80,  dmg: 20, rt: 1.1, hp: 200, sp: 125, aoe: 0 },
  monk:   { n: '승병',   c: '#d98cff', rg: 65,  dmg: 14, rt: 1.0, hp: 260, sp: 110, aoe: 40 },
  gunner: { n: '화포수', c: '#ff9a5a', rg: 195, dmg: 26, rt: 0.5, hp: 110, sp: 105, aoe: 32 }
};
const ET = { // 적
  grunt:  { n: '보병',   hp: 30,  sp: 38, dm: 6,  r: 9,  st: 0,   f: 8,  xp: 1 },
  shoot:  { n: '조총·궁수', hp: 24, sp: 34, dm: 5,  r: 8,  st: 120, f: 9,  xp: 1 },
  cav:    { n: '기병',   hp: 55,  sp: 82, dm: 9,  r: 11, st: 0,   f: 10, xp: 2 },
  tank:   { n: '중갑',   hp: 170, sp: 26, dm: 14, r: 14, st: 0,   f: 18, xp: 4 },
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
  { id: 'heal',   n: '의원',    d: '모든 동료 체력 50% 회복', t: '부상자 돌보기', ref: '' }
];
const EVENTS = [
  { t: '작전 회의', q: '어떻게 할까요?', o: [{ n: '성을 굳게 지킨다', d: '거점 체력 +25% 회복', k: 'wall' }, { n: '나가서 반격한다', d: '30초간 모든 공격력 +40%', k: 'atk' }] },
  { t: '백성의 도움', q: '백성이 도움을 청합니다!', o: [{ n: '백성을 보호한다', d: '군량 +80', k: 'food' }, { n: '의병으로 받아들인다', d: '무료 병사 3명 소집', k: 'volun' }] },
  { t: '정찰 보고', q: '적의 움직임을 알았어요!', o: [{ n: '길목을 막는다', d: '25초간 적 이동 속도 -40%', k: 'slow' }, { n: '기습 공격', d: '화면의 적 일부에게 큰 피해', k: 'raid' }] }
];

// ---------- 지형 / 길 ----------
const THEME = { plain: ['#cde8e4', '#e8dfbf'], mount: ['#d0e6e0', '#dedcbb'], sea: ['#cfe6ea', '#a9d3d6'], river: ['#d0e8e2', '#cfe0c4'] };
// 라운드 목표: d=성 수성 / e=탈출 / s=버티기 / b=적장 격파 / r=기습(보급창고 파괴)
const ROUND_OBJ = ['d', 'e', 's', 'b', 'b', 'd', 'r', 'r', 'd', 'd', 's', 'd', 'd', 'b', 's', 's', 'r', 'e', 'r', 'b', 'd', 'd', 's', 'd', 's', 'e', 'd', 's', 'b', 'd'];
const OBJINFO = { d: { n: '성을 지켜라', ic: '🏯', t: '성이 무너지지 않게 시간이 끝날 때까지 지켜요' }, e: { n: '탈출하라', ic: '🚩', t: '깃발을 차례로 지나 탈출 지점까지 가요' }, s: { n: '끝까지 버텨라', ic: '⏳', t: '쓰러지지 않고 시간이 끝날 때까지 버텨요' }, b: { n: '적장을 쓰러뜨려라', ic: '⚔️', t: '나타나는 적장을 쓰러뜨리면 승리해요' }, r: { n: '보급창고를 부숴라', ic: '🔥', t: '적의 보급창고를 모두 부수면 승리해요' } };
const WORLD = { d: [1800, 1100], b: [1800, 1100], s: [1800, 1100], e: [2800, 1100], r: [2400, 1400] };
const CR = 50; // 성 반경
function slotPos(i, ax, ay) { const ring = i < 6 ? 0 : 1, a = (i % 6) / 6 * Math.PI * 2 + ring * 0.52 - Math.PI / 2, r = ring ? 118 : 76; return [ax + Math.cos(a) * r, ay + Math.sin(a) * r * 0.78 + 8]; }
const SLOTN = 12;

// =====================================================================
//  호스트 시뮬레이션 (방장 기기에서만 실행)
// =====================================================================
let G = null; // 호스트 상태
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (n) => Math.floor(Math.random() * n);
function newG() {
  return { ph: 'lobby', rd: 0, pl: {}, order: [], sel: { start: 0, dur: FAST || 300 }, shots: [], fx: [], bonus: 0, log: [], ans: {}, res: null, ev: null, nid: 1, sn: 0 };
}
function addPlayer(id, name, role) {
  const R0 = ROLE[role] || ROLE.archer;
  G.pl[id] = { id, name: name || '의병' + (G.order.length + 1), role: role || 'archer', x: 300, y: 270, hp: R0.hp, mx: R0.hp, lv: 1, down: 0, cd: 0, atk: 0, cards: {}, offer: null, offT: 0, mvx: 0, mvy: 0, st: {}, fz: 0 };
  G.order.push(id);
}
function heroStats(p) { // 카드 반영 스탯
  const b = ROLE[p.role], c = p.cards, n = (k) => c[k] || 0;
  return { dmg: b.dmg * (1 + 0.35 * n('gun')) * (G.buffAtk > 0 ? 1.4 : 1), rg: b.rg * (1 + 0.15 * n('gun')), rt: b.rt * (1 + 0.25 * n('bow')), sp: b.sp * (1 + 0.25 * n('horse')), aoe: Math.max(b.aoe, n('powder') ? 34 + 8 * n('powder') : 0) };
}
function startRound(i) {
  const rd = R[i], P = G.sel.dur, i0 = i - (i < 10 ? 0 : i < 20 ? 10 : i < 25 ? 20 : 25), ob = ROUND_OBJ[i];
  G.rd = i; G.ph = 'brief'; G.res = null; G.ans = {}; G.ev = null; G.obj = ob; G.castle = ob === 'd' || ob === 'b';
  G.path = rd.th; G.t = 0; G.dur = ob === 'e' ? Math.min(P, 150) : P; G.en = []; G.shots = []; G.fx = [];
  const [ww, wh] = WORLD[ob]; G.ww = ww; G.wh = wh; G.ax = ob === 'e' ? 220 : ob === 'r' ? 300 : ww / 2; G.ay = ob === 'e' ? wh / 2 : ob === 'r' ? wh / 2 + 150 : wh / 2;
  const k = 2 + (i >= 13 ? 1 : 0) + (i >= 22 ? 1 : 0), b0 = rnd(0, 6.283); G.dirs = []; for (let j = 0; j < k; j++) G.dirs.push(b0 + j * 6.283 / k);
  G.lives = G.castle ? 99 : G.order.length + 2; G.waveT = 22; G.gi = 0; G.bossOut = false; G.bossDead = false; G.campPos = [];
  G.goals = ob === 'e' ? [[ww * 0.36, wh * 0.26], [ww * 0.66, wh * 0.78], [ww - 170, wh * 0.4]] : [];
  G.evR = null; G.evShow = 0; G.units = new Array(SLOTN).fill(null); G.sumN = 0; G.sumMiss = 0; G.buffAtk = 0; G.slowT = 0; G.evDone = [false, false];
  G.baseMax = Math.round(600 * (1 + 0.2 * (G.wallN || 0))); G.baseHp = G.baseMax;
  G.food = 110 + G.bonus; G.bonus = 0; G.foodMul = 1; G.spawnT = 1.5; G.bossDone = false; G.xp = 0; G.need = 12;
  const hs = (1 + 0.09 * i) * (rd.df ? 1.1 : 1) * (G.sel.diff || 1);
  if (ob === 'r') { const n = 3 + (i >= 16 ? 1 : 0), pos = [[ww * 0.42, wh * 0.26], [ww * 0.72, wh * 0.7], [ww * 0.88, wh * 0.28], [ww * 0.55, wh * 0.88]]; for (let j = 0; j < n; j++) { G.campPos.push(pos[j]); spawn('camp', hs * 0.9, pos[j]); } G.campTotal = n; }
  for (let j = 0; j < Math.min(5, Math.floor(i0 / 4)); j++) doSummon(true);
  G.order.forEach((id, n) => { const p = G.pl[id]; p.mx = Math.round(ROLE[p.role].hp * (1 + 0.4 * (p.cards.armor || 0))); p.hp = p.mx; p.down = 0; p.cd = 0; p.offer = null; p.fz = 3; const a = n * 1.2; if (G.castle) { p.x = G.ax - 120 + Math.cos(a) * 30; p.y = G.ay + 70 + Math.sin(a) * 40; } else { p.x = G.ax + Math.cos(a) * 60; p.y = G.ay + 110 + Math.sin(a) * 40; } });
}
function beginBattle() { G.ph = 'battle'; }
function summonCost() { return Math.round(40 * (1 + 0.1 * G.sumN)); }
function doSummon(free) {
  const slot = G.units.indexOf(null); if (slot < 0) return false;
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
  if (id === 'armor') { const old = p.mx; p.mx = Math.round(ROLE[p.role].hp * (1 + 0.4 * p.cards.armor)); p.hp = Math.min(p.mx, p.hp + (p.mx - old) + p.mx * 0.3); }
  if (id === 'wall') { G.baseMax = Math.round(G.baseMax * 1.2); G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.12); G.wallN = (G.wallN || 0) + 1; }
  if (id === 'food') G.foodMul += 0.3;
  if (id === 'volun') { doSummon(true); doSummon(true); }
  if (id === 'heal') for (const q of G.order) { const h = G.pl[q]; h.hp = Math.min(h.mx, h.hp + h.mx * 0.5); }
}
function offerCards(p) { const ids = CARDS.map((c) => c.id); const o = []; while (o.length < 3) { const k = ids.splice(rint(ids.length), 1)[0]; o.push(k); } p.offer = o; p.offT = 14; }
function applyEvent(k) {
  if (k === 'wall') G.baseHp = Math.min(G.baseMax, G.baseHp + G.baseMax * 0.25);
  if (k === 'atk') G.buffAtk = 30;
  if (k === 'food') G.food += 80;
  if (k === 'volun') { doSummon(true); doSummon(true); doSummon(true); }
  if (k === 'slow') G.slowT = 25;
  if (k === 'raid') for (const e of G.en) if (Math.random() < 0.6) { e.hp -= 90; G.fx.push([e.x, e.y, 20, 'hit']); }
}
function spawn(type, hs, pos) {
  const T = ET[type], np = G.order.length, sc = hs * (type === 'boss' ? (1 + 0.5 * (np - 1)) : 1);
  const e = { id: G.nid++, t: type, hp: T.hp * sc, mx: T.hp * sc, sp: T.sp * rnd(0.9, 1.1), st: 0, x: pos[0], y: pos[1], ef: 0, ox: rnd(-34, 34), oy: rnd(-26, 26), ro: rnd(0, 36), gt: rnd(2, 5) };
  G.en.push(e); return e;
}
function clampW(x, y, m) { m = m || 30; return [Math.max(m, Math.min(G.ww - m, x)), Math.max(m, Math.min(G.wh - m, y))]; }
function aliveHeroes() { return G.order.map((id) => G.pl[id]).filter((p) => !p.down); }
function spawnPos() {
  if (G.castle) { const a = G.dirs[rint(G.dirs.length)] + rnd(-0.45, 0.45); return clampW(G.ax + Math.cos(a) * 640, G.ay + Math.sin(a) * 470, 24); }
  const hs = aliveHeroes(); if (!hs.length) return null;
  for (let k = 0; k < 8; k++) { const h = hs[rint(hs.length)], a = (G.obj === 'e' && Math.random() < 0.7) ? rnd(-1.3, 1.3) : rnd(0, 6.283), q = clampW(h.x + Math.cos(a) * 560, h.y + Math.sin(a) * 420, 24); if (hs.every((p) => Math.hypot(p.x - q[0], p.y - q[1]) > 470)) return q; }
  return null;
}
function pickType(rd) { const r = Math.random(), cvw = rd.cl === 'cav' ? 0.2 : 0.1, prog = G.t / G.dur; return r < 0.5 - cvw ? 'grunt' : r < 0.72 ? 'shoot' : r < 0.72 + cvw ? 'cav' : (prog > 0.25 && r < 0.97) ? 'tank' : 'grunt'; }
function enemyDeath(e) {
  const T = ET[e.t]; if (e.t === 'boss') G.bossDead = true; if (e.t === 'camp') G.fx.push([e.x, e.y, 60, 'boom']); G.food += Math.round(T.f * 0.35 * G.foodMul * (e.t === 'boss' ? 3 : 1)) + (Math.random() < 0.3 ? 1 : 0); G.xp += T.xp;
  G.fx.push([e.x, e.y, T.r + 6, 'die', e.t]);
  while (G.xp >= G.need) { G.xp -= G.need; G.need = Math.round(G.need * 1.35 + 4); for (const id of G.order) { const p = G.pl[id]; p.lv++; if (!p.offer) offerCards(p); } }
}
function dmgEnemy(e, d) { e.hp -= d; e.ef = 0.1; if (G.fx.length < 60) G.fx.push([e.x + rnd(-8, 8), e.y - ET[e.t].r - 4, Math.round(d), 'dmg']); }
function splash(x, y, r, d, except) { for (const o of G.en) if (o !== except && Math.hypot(o.x - x, o.y - y) <= r) dmgEnemy(o, d * 0.6); G.fx.push([x, y, r, 'boom']); }
function nearest(x, y, rg) { let b = null, bd = rg * rg; for (const e of G.en) { const dd = (e.x - x) ** 2 + (e.y - y) ** 2; if (dd < bd) { bd = dd; b = e; } } return b; }
function stepBattle(dt) {
  const rd = R[G.rd], np = G.order.length, prog = G.t / G.dur;
  G.t += dt; if (G.buffAtk > 0) G.buffAtk -= dt; if (G.slowT > 0) G.slowT -= dt;
  // 사건(투표)
  if (!G.ev) for (let k = 0; k < 2; k++) if (!G.evDone[k] && prog >= (k ? 0.68 : 0.35)) { G.evDone[k] = true; const E = EVENTS[(G.rd + k) % 3]; G.ev = { t: E.t, q: E.q, o: E.o, votes: {}, left: 14 }; break; }
  if (G.ev) { G.ev.left -= dt; const allVoted = G.order.every((id) => G.ev.votes[id] != null); if (G.ev.left <= 0 || allVoted) { const c = [0, 0]; for (const id in G.ev.votes) c[G.ev.votes[id]]++; const w = c[0] === c[1] ? rint(2) : (c[0] > c[1] ? 0 : 1); applyEvent(G.ev.o[w].k); G.ev.done = G.ev.o[w].n; G.evShow = 3; G.evR = G.ev; G.ev = null; } }
  if (G.evShow > 0) { G.evShow -= dt; if (G.evShow <= 0) G.evR = null; }
  // 스폰
  const hs = (1 + 0.09 * G.rd) * (rd.df ? 1.1 : 1) * (G.sel.diff || 1), hs2 = aliveHeroes();
  const rate = (0.55 + 0.9 * prog + 0.018 * G.rd) * (1 + 0.5 * (np - 1)) * (rd.df ? 1.12 : 1) * (G.obj === 'r' ? 0.45 : G.obj === 'e' ? 1.25 : 1);
  G.spawnT -= dt * rate; while (G.spawnT <= 0) { G.spawnT += 1; if (G.en.length >= 150) continue; const q = spawnPos(); if (q) spawn(pickType(rd), hs, q); }
  G.waveT -= dt; if (G.waveT <= 0 && G.obj !== 'e') { G.waveT = 26; const q = spawnPos(); if (q) { const n = 6 + Math.floor(G.rd / 3); for (let k = 0; k < n && G.en.length < 150; k++) spawn(pickType(rd), hs, clampW(q[0] + rnd(-70, 70), q[1] + rnd(-70, 70))); G.fx.push([q[0], q[1], 40, 'warn']); } }
  if (G.obj === 'b' && !G.bossOut && G.t >= 6) { G.bossOut = true; const q = spawnPos() || [G.ax + 500, G.ay]; spawn('boss', hs * 0.8, q); G.fx.push([q[0], q[1], 60, 'boss']); }
  else if ((G.obj === 'd' || G.obj === 's') && !G.bossDone && prog >= 0.85) { G.bossDone = true; const q = spawnPos(); if (q) { spawn('boss', hs * 0.8, q); G.fx.push([q[0], q[1], 60, 'boss']); } }
  // 탈출 지점
  if (G.obj === 'e') { const g = G.goals[G.gi]; if (g) for (const p of hs2) if (Math.hypot(p.x - g[0], p.y - g[1]) < 85) { G.fx.push([g[0], g[1], 60, 'sum']); G.gi++; break; } }
  // 적 이동 / 공격
  for (const e of G.en) { const T = ET[e.t]; if (e.ef > 0) e.ef -= dt;
    if (e.t === 'camp') { e.gt -= dt; if (e.gt <= 0) { e.gt = 7; for (let k = 0; k < 2 && G.en.length < 150; k++) spawn('grunt', hs, clampW(e.x + rnd(-50, 50), e.y + rnd(30, 70))); } continue; }
    if (e.st > 0) e.st -= dt; else { let tx, ty, reach, tp = null;
      if (G.castle) { tx = G.ax + e.ox; ty = G.ay + e.oy; reach = CR + 14 + T.st * 0.9 + e.ro; }
      else { let bd = 1e9; for (const p of hs2) { const d2 = (p.x - e.x) ** 2 + (p.y - e.y) ** 2; if (d2 < bd) { bd = d2; tp = p; } } if (!tp) continue; tx = tp.x; ty = tp.y; reach = T.r + 10 + T.st * 0.8; }
      const dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy) || 1;
      if (d > reach) { const v = e.sp * dt * (G.slowT > 0 ? 0.6 : 1); e.x += dx / d * v; e.y += dy / d * v; }
      else if (G.castle) G.baseHp -= T.dm * dt; else if (tp.fz <= 0) tp.hp -= T.dm * 0.6 * dt; }
    if (G.castle) for (const p of hs2) if (p.fz <= 0 && Math.hypot(p.x - e.x, p.y - e.y) < T.r + 12) p.hp -= T.dm * 0.6 * dt; }
  // 영웅
  for (const id of G.order) { const p = G.pl[id], S = heroStats(p), b = ROLE[p.role];
    if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt;
    if (p.offer) { p.offT -= dt; if (p.offT <= 0) { applyCard(p, p.offer[rint(3)]); p.offer = null; } }
    if (p.down > 0) { p.down -= dt; if (p.down <= 0) { p.hp = p.mx * (G.castle ? 0.5 : 0.6); p.fz = 3; } continue; }
    if (p.hp <= 0) { if (G.castle) p.down = 10; else if (G.lives > 0) { G.lives--; p.down = 6; } else p.down = 1e9; p.hp = 0; G.fx.push([p.x, p.y, 30, 'die']); continue; }
    p.x = Math.max(20, Math.min(G.ww - 20, p.x + p.mvx * S.sp * dt)); p.y = Math.max(30, Math.min(G.wh - 30, p.y + p.mvy * S.sp * dt));
    p.atk -= dt; if (p.atk <= 0) { const t = nearest(p.x, p.y, S.rg); if (t) { p.atk = 1 / S.rt; dmgEnemy(t, S.dmg); G.shots.push([p.x, p.y, t.x, t.y, 0, p.role]); if (S.aoe) splash(t.x, t.y, S.aoe, S.dmg, t); } }
    if (p.cards.hwacha) { p.hw = (p.hw || 0) - dt; if (p.hw <= 0) { p.hw = 8; let n = 0; for (const e of G.en) if (e.t !== 'camp' && n < 6 + 3 * p.cards.hwacha && Math.hypot(e.x - p.x, e.y - p.y) < 260) { dmgEnemy(e, 22 * p.cards.hwacha + 8); G.shots.push([p.x, p.y - 30, e.x, e.y, 1, 'hwa']); n++; } } } }
  // 병사 (성이 없으면 영웅들을 따라다녀요)
  if (!G.castle && hs2.length) { let sx = 0, sy = 0; for (const p of hs2) { sx += p.x; sy += p.y; } sx /= hs2.length; sy /= hs2.length; G.ax += (sx - G.ax) * Math.min(1, dt * 2.5); G.ay += (sy - G.ay) * Math.min(1, dt * 2.5); }
  G.units.forEach((u, i) => { if (!u) return; const T = UT[u.t]; u.cd -= dt; if (u.cd > 0) return; const s = slotPos(i, G.ax, G.ay); const t = nearest(s[0], s[1], T.rg); if (!t) return;
    u.cd = 1 / T.rt; const d = T.dmg * LVM[u.lv - 1] * (G.buffAtk > 0 ? 1.4 : 1); dmgEnemy(t, d); G.shots.push([s[0], s[1], t.x, t.y, 2 + (u.lv > 2 ? 1 : 0), u.t]); if (T.aoe) splash(t.x, t.y, T.aoe, d, t); });
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
  else if (m.k === 'summon' && G.ph === 'battle') doSummon(false);
  else if (m.k === 'merge' && G.ph === 'battle') { if (m.a >= 0 && m.a < SLOTN && m.b >= 0 && m.b < SLOTN) doMerge(m.a | 0, m.b | 0); }
  else if (m.k === 'card' && p.offer && m.i >= 0 && m.i < 3) { applyCard(p, p.offer[m.i | 0]); p.offer = null; }
  else if (m.k === 'vote' && G.ev && (m.i === 0 || m.i === 1)) G.ev.votes[from] = m.i;
  else if (m.k === 'ans' && G.ph === 'result' && G.ans[from] == null) G.ans[from] = m.i | 0;
}
function hostCtl(c, v) { // 방장 전용 조작
  if (c === 'start') { G.sel.start = v.start; G.sel.dur = FAST || v.dur; G.sel.diff = v.diff || 1; G.bonus = 0; G.wallN = 0; for (const id of G.order) G.pl[id].cards = {}; startRound(v.start); }
  else if (c === 'fight' && G.ph === 'brief') beginBattle();
  else if (c === 'next' && G.ph === 'result') { if (G.res.win) nextRound(); else startRound(G.rd); }
  else if (c === 'retry' && G.ph === 'result') startRound(G.rd);
  else if (c === 'skip' && G.ph === 'result' && !G.res.win && R[G.rd].df) nextRound();
  else if (c === 'lobby') { G.ph = 'lobby'; }
}
function makeSnap() {
  const g = G; const s = { ph: g.ph, rd: g.rd, t: g.t, dur: g.dur, sel: g.sel, order: g.order,
    pl: g.order.map((id) => { const p = g.pl[id]; return { id, name: p.name, role: p.role, x: p.x, y: p.y, hp: p.hp, mx: p.mx, lv: p.lv, down: p.down, cd: p.cd, offer: p.offer, offT: p.offT, cards: p.cards, fz: p.fz }; }) };
  if (g.ph === 'battle' || g.ph === 'result' || g.ph === 'brief') { s.ww = g.ww; s.wh = g.wh; s.ax = g.ax; s.ay = g.ay; s.obj = g.obj; s.castle = g.castle; s.lives = g.lives; s.gi = g.gi; s.goals = g.goals; s.dirs = g.dirs; s.cpos = g.campPos; s.cpn = g.en.filter((e) => e.t === 'camp').length; s.cpt = g.campTotal || 0; s.bh = g.baseHp; s.bm = g.baseMax; s.food = Math.floor(g.food); s.cost = summonCost(); s.un = g.units; s.xp = g.xp; s.need = g.need;
    s.en = g.en.slice(0, 160).map((e) => [e.id, e.t, e.x, e.y, e.hp / e.mx, e.ef > 0 ? 1 : 0]); s.sh = g.shots; s.fx = g.fx; s.ev = g.ev ? { t: g.ev.t, q: g.ev.q, o: g.ev.o, votes: g.ev.votes, left: g.ev.left } : null; s.evR = g.evR ? g.evR.done : null; s.buff = g.buffAtk > 0; s.slow = g.slowT > 0; }
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
const effects = []; // 클라이언트 쪽 효과 {x,y,r,k,a}
const gems = []; let shake = 0, lastBh = -1;

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
  $('btnStart').onclick = () => { draftSel = { start: +$('selStart').value, dur: +$('selDur').value, diff: +$('selDiff').value }; hostCtl('start', draftSel); };
  $('btnLeave').onclick = () => location.reload();
  document.querySelectorAll('#roleRow button').forEach((b) => { b.onclick = () => { me.role = b.dataset.r; sendProf(); document.querySelectorAll('#roleRow button').forEach((x) => x.classList.toggle('on', x === b)); }; });
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
  const z = $('joyZone'), knob = $('joyKnob'), ring = $('joyRing');
  const pt = (e) => { const r = $('stage').getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  z.addEventListener('pointerdown', (e) => { z.setPointerCapture(e.pointerId); const [x, y] = pt(e); joy = { on: true, id: e.pointerId, ox: x, oy: y, x, y }; ring.style.display = knob.style.display = 'block'; ring.style.left = x - 55 + 'px'; ring.style.top = y - 55 + 'px'; knob.style.left = x - 24 + 'px'; knob.style.top = y - 24 + 'px'; });
  z.addEventListener('pointermove', (e) => { if (!joy.on || e.pointerId !== joy.id) return; const [x, y] = pt(e); joy.x = x; joy.y = y; let dx = x - joy.ox, dy = y - joy.oy; const l = Math.hypot(dx, dy); if (l > 55) { dx *= 55 / l; dy *= 55 / l; } knob.style.left = joy.ox + dx - 24 + 'px'; knob.style.top = joy.oy + dy - 24 + 'px'; });
  const up = (e) => { if (e.pointerId !== joy.id) return; joy.on = false; ring.style.display = knob.style.display = 'none'; };
  z.addEventListener('pointerup', up); z.addEventListener('pointercancel', up);
  addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = 1; if (e.key === ' ') sendHost({ k: 'skill' }); if (e.key === 'Enter') sendHost({ k: 'summon' }); });
  addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = 0; });
  $('btnSummon').onpointerdown = () => sendHost({ k: 'summon' });
  $('btnSkill').onpointerdown = () => sendHost({ k: 'skill' });
  $('cv').addEventListener('pointerdown', (e) => { if (!V || V.ph !== 'battle') return; const [px, py] = pt(e), x = px + cam.x, y = py + cam.y; let hit = -1, bd = 34; for (let i = 0; i < SLOTN; i++) { const s = slotPos(i, V.ax, V.ay), d = Math.hypot(s[0] - x, s[1] - 6 - y); if (d < bd) { bd = d; hit = i; } }
    if (hit < 0) { sel = -1; return; }
    if (sel < 0) { if (V.un && V.un[hit]) sel = hit; } else { if (sel !== hit) sendHost({ k: 'merge', a: sel, b: hit }); sel = -1; } });
  $('btnNext').onclick = () => hostCtl('next'); $('btnRetry').onclick = () => hostCtl('retry'); $('btnSkip').onclick = () => hostCtl('skip');
  $('btnFight').onclick = () => hostCtl('fight'); $('btnHome').onclick = () => location.reload();
}
function sendMove() {
  let mx = 0, my = 0;
  if (joy.on) { mx = (joy.x - joy.ox) / 55; my = (joy.y - joy.oy) / 55; }
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
function buildBrief() {
  const r = R[V.rd], ch = CH[r.ch], s = SRC[r.src]; const first = r.ch !== (V.rd ? R[V.rd - 1].ch : -1);
  const idx = R.filter((x, i) => x.ch === r.ch && i <= V.rd).length, tot = R.filter((x) => x.ch === r.ch).length;
  $('bkChap').textContent = `${ch.n} (${ch.y}) · ${idx}/${tot}라운드`;
  $('bkName').textContent = r.nm; $('bkPlace').textContent = `${r.pl} · ${r.yr}년`;
  $('bkSrc').innerHTML = `<span class="tag" style="background:${s[1]}">${s[0]}</span> <small>${esc(r.pg)}</small>`;
  $('bkText').textContent = (first ? ch.sum + '\n\n' : '') + r.b;
  const cl = CLUE[r.cl]; $('bkClue').innerHTML = `<b>힌트</b> ${cl.t}<br><small>${cl.d}</small>`;
  const ob = ROUND_OBJ[V.rd], OI = OBJINFO[ob]; $('bkGoal').innerHTML = `<b>${OI.ic} 이번 목표: ${OI.n}</b><br><small>${OI.t}${r.df ? ' (역사에서는 어려웠던 싸움! 시간을 벌면 성공이에요)' : ''}</small>`;
  $('bkMap').style.background = `linear-gradient(135deg, #cfe9b8, #a9d4a0)`; $('bkMap').innerHTML = `<div style="font-size:54px;line-height:90px;text-align:center">${OI.ic}</div>`;
  $('btnFight').style.display = Net.host ? 'inline-block' : 'none'; $('bkWait').style.display = Net.host ? 'none' : 'block';
  show('sBrief');
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
  const p = myP(); if (!p) return; const r = R[V.rd];
  $('hudName').textContent = r.nm; const rem = Math.max(0, Math.ceil(V.dur - V.t)); $('hudT').textContent = String(Math.floor(rem / 60)).padStart(2, '0') + ':' + String(rem % 60).padStart(2, '0');
  $('barT').style.width = Math.min(100, V.t / V.dur * 100) + '%'; $('barB').style.width = (V.castle ? Math.max(0, V.bh / V.bm * 100) : Math.min(100, (V.obj === 'e' ? V.gi / Math.max(1, V.goals.length) : V.obj === 'r' ? (V.cpt - V.cpn) / Math.max(1, V.cpt) : V.t / V.dur) * 100)) + '%'; { const OI = OBJINFO[V.obj]; let extra = ''; if (V.obj === 'e') extra = ` ${V.gi}/${V.goals.length}`; else if (V.obj === 'r') extra = ` ${V.cpt - V.cpn}/${V.cpt}`; if (!V.castle) extra += `  ❤️×${Math.max(0, V.lives)}`; $('objBar').textContent = OI.ic + ' ' + OI.n + extra; }
  $('hudFood').textContent = '🌾 ' + V.food; $('btnSummon').innerHTML = `소집<br><small>군량 ${V.cost}</small>`; $('btnSummon').classList.toggle('dis', V.food < V.cost || !V.un.includes(null));
  $('btnSkill').innerHTML = p.cd > 0 ? `함성<br><small>${Math.ceil(p.cd)}초</small>` : '함성<br><small>준비!</small>'; $('btnSkill').classList.toggle('dis', p.cd > 0 || p.down > 0);
  $('barHp').style.width = Math.max(0, p.hp / p.mx * 100) + '%'; $('barXp').style.width = Math.min(100, V.xp / V.need * 100) + '%'; $('hudLv').textContent = 'Lv.' + p.lv; { const av = $('meAv'); if (av.dataset.r !== p.role && window.SPR && SPR[RSP[p.role]]) { av.dataset.r = p.role; av.src = SPR[RSP[p.role]].d; } }
  const ok = p.offer ? p.offer.join() : ''; if (ok !== lastOffer) { lastOffer = ok; const box = $('cards'); if (!p.offer) box.style.display = 'none'; else { box.style.display = 'flex'; box.innerHTML = p.offer.map((id, i) => { const c = CARDS.find((x) => x.id === id); return `<div class="card" data-i="${i}"><b>${c.n}</b><span>${c.d}</span><small>${c.t}</small></div>`; }).join(''); box.querySelectorAll('.card').forEach((d) => d.onpointerdown = () => { sendHost({ k: 'card', i: +d.dataset.i }); box.style.display = 'none'; lastOffer = ''; }); } }
  const ek = V.ev ? V.ev.t + V.ev.q : ''; const evb = $('evBox');
  if (ek !== lastEvKey) { lastEvKey = ek; if (!V.ev) evb.style.display = 'none'; else { evb.style.display = 'block'; evb.innerHTML = `<h3>${V.ev.t}</h3><p>${V.ev.q} <small>(친구들과 투표!)</small></p><div>${V.ev.o.map((o, i) => `<button class="evo" data-i="${i}"><b>${o.n}</b><small>${o.d}</small></button>`).join('')}</div><p id="evV"></p>`; evb.querySelectorAll('.evo').forEach((b) => b.onpointerdown = () => { sendHost({ k: 'vote', i: +b.dataset.i }); evb.querySelectorAll('.evo').forEach((x) => x.classList.toggle('on', x === b)); }); } }
  if (V.ev && $('evV')) { const c = [0, 0]; for (const k in V.ev.votes) c[V.ev.votes[k]]++; $('evV').textContent = `투표 ${c[0]} : ${c[1]}  ·  ${Math.ceil(V.ev.left)}초`; }
}

// ----- 그리기 -----
const cv = $('cv'), cx = cv.getContext('2d');
function frame() {
  requestAnimationFrame(frame); sendMove();
  if (V) { syncUI(); if (lastPh === 'battle' || lastPh === 'result' || lastPh === 'brief') draw(); }
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
const EH = {camp:80, grunt: 64, shoot: 64, cav: 78, tank: 72, boss: 104 };
const RSP = { archer: 'h_archer', militia: 'h_militia', monk: 'h_monk', gunner: 'h_cannon' };
const USP = { bow: 'u_bow', spear: 'u_spear', gun: 'u_gun', cannon: 'u_cannon', cav: 'u_cav' };
const GR = {}, OUT = 5;
function okImg(n) { if (GR[n]) return GR[n]; const im = IMG[n]; if (!im || !im.complete || !im.naturalWidth) return null;
  const iw = im.naturalWidth, ih = im.naturalHeight, pad = n === 'orb' ? 0 : OUT, c = document.createElement('canvas'); c.width = iw + pad * 2; c.height = ih + pad * 2; const g = c.getContext('2d');
  if (pad) { const sl = document.createElement('canvas'); sl.width = iw; sl.height = ih; const sg = sl.getContext('2d'); sg.drawImage(im, 0, 0); sg.globalCompositeOperation = 'source-atop'; sg.fillStyle = '#3a2a1c'; sg.fillRect(0, 0, iw, ih);
    for (let k = 0; k < 16; k++) g.drawImage(sl, pad + Math.cos(k * 0.3927) * pad, pad + Math.sin(k * 0.3927) * pad); }
  if ('filter' in g && n !== 'orb') g.filter = 'saturate(0.85) sepia(0.1) contrast(1.03) brightness(1.08)';
  g.drawImage(im, pad, pad); c.iw = iw; c.ih = ih; c.pad = pad; return GR[n] = c; }
function white(name) { if (IMGW[name]) return IMGW[name]; const im = okImg(name); if (!im) return null; const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); return IMGW[name] = c; }
function spr(name, x, y, h, o) { o = o || {}; const im = okImg(name); if (!im) return; const k = h / im.ih, w = im.width * k, hh = im.height * k, pd = im.pad * k;
  cx.save(); cx.globalAlpha *= (o.alpha == null ? 1 : o.alpha); cx.translate(x + (o.dx || 0), y - (o.bob || 0) + (o.dy || 0)); cx.rotate(o.lean || 0); cx.scale((o.flip ? -1 : 1) * (o.sx || 1), o.sy || 1);
  cx.drawImage(im, -w / 2, -hh + pd, w, hh);
  if (o.flash) { const wi = white(name); if (wi) { cx.globalAlpha *= 0.75; cx.drawImage(wi, -w / 2, -hh + pd, w, hh); } }
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
  L.forEach(([n, x, h, o], i) => { const S = SPR[n]; if (!S) return; const im = document.createElement('img'); im.src = S.d; im.style.left = x + 'px'; im.style.height = h + 'px'; im.style.opacity = o; im.style.animationDelay = (i * 0.5) + 's'; if (n === 'gate') { im.style.bottom = '140px'; im.style.left = '395px'; im.style.animation = 'none'; } el.appendChild(im); });
}
function unitFig(kind, x, y, lv, c, tm) {
  const r = 12 + lv * 1.5, bob = Math.sin(tm * 4 + x) * 1.2; y += bob;
  if (kind === 'cav') drawHorse(x, y, r);
  weapon(kind, x, y, r); blob(x, y, r, '#ffffff', c, '#fff', c); face(x, y + 1, r * 0.9, 'happy'); gear(kind, x, y, r);
}
function draw() {
  if (V.ph !== 'battle' && V.ph !== 'result') return; const th = THEME[R[V.rd].th], tm = performance.now() / 1000;
  if (lastBh >= 0 && V.bh < lastBh - 0.5) shake = Math.max(shake, 0.18); lastBh = V.bh;
  cx.save(); if (shake > 0) { cx.translate((Math.random() - 0.5) * shake * 26, (Math.random() - 0.5) * shake * 26); shake = Math.max(0, shake - 1 / 60); }
  if (!V.ww) { cx.restore(); return; }
  cx.fillStyle = th[1]; cx.fillRect(-20, -20, W + 40, H + 40);
  { const me = RP.get(Net.id) || [V.ax, V.ay]; const tx = Math.max(0, Math.min(V.ww - W, me[0] - W / 2)), ty = Math.max(0, Math.min(V.wh - H, me[1] - H / 2)); if (cam.rd !== V.rd || cam.t0 !== V.ww) { cam.x = tx; cam.y = ty; cam.rd = V.rd; cam.t0 = V.ww; } else { const ca = 1 - Math.exp(-(1 / 60) * 9); cam.x += (tx - cam.x) * ca; cam.y += (ty - cam.y) * ca; } }
  cx.save(); cx.translate(-cam.x, -cam.y);
  const rth = R[V.rd].th; cx.drawImage(WLD[V.rd] || (WLD[V.rd] = makeWorld(rth, V.ww, V.wh, V.obj, V.rd + 1)), 0, 0);
  const SP = []; for (let i = 0; i < SLOTN; i++) SP.push(slotPos(i, V.ax, V.ay));
  // 성 / 목표물
  if (V.castle && rth === 'sea') { cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(V.ax, V.ay + 30, 150, 100, 0, 0, 7); cx.fill(); cx.fillStyle = '#6e4a2a'; cx.fillRect(V.ax - 6, V.ay - 110, 12, 150); cx.fillStyle = '#f3ead2'; cx.strokeStyle = '#8c6a44'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(V.ax + 6, V.ay - 104); cx.quadraticCurveTo(V.ax + 80 + Math.sin(tm * 2) * 5, V.ay - 70, V.ax + 6, V.ay - 20); cx.closePath(); cx.fill(); cx.stroke(); cx.fillStyle = '#d9453a'; cx.beginPath(); cx.moveTo(V.ax - 6, V.ay - 110); cx.lineTo(V.ax - 52, V.ay - 98 + Math.sin(tm * 4) * 3); cx.lineTo(V.ax - 6, V.ay - 84); cx.fill();
    cx.fillStyle = 'rgba(0,0,0,.55)'; rr(V.ax - 56, V.ay - 128, 112, 10, 5); cx.fill(); cx.fillStyle = V.bh / V.bm > 0.3 ? '#7ddf8b' : '#ff6b6b'; rr(V.ax - 56, V.ay - 128, 112 * Math.max(0.03, V.bh / V.bm), 10, 5); cx.fill(); }
  else if (V.castle) { const wob = Math.sin(tm * 2) * 0.01; cx.fillStyle = 'rgba(0,0,0,.16)'; cx.beginPath(); cx.ellipse(V.ax, V.ay + 20, 170, 120, 0, 0, 7); cx.fill(); cx.strokeStyle = '#a7a094'; cx.lineWidth = 14; cx.beginPath(); cx.ellipse(V.ax, V.ay + 8, 160, 112, 0, 0, 7); cx.stroke(); cx.strokeStyle = '#d6d0c2'; cx.lineWidth = 8; cx.stroke(); cx.fillStyle = 'rgba(214,186,130,.45)'; cx.fill();
    cx.shadowColor = 'rgba(255,200,120,.5)'; cx.shadowBlur = 18; shade(V.ax, V.ay + 46, 50, 0.3); spr('gate', V.ax, V.ay + 50, 118, { lean: wob }); cx.shadowBlur = 0;
    cx.fillStyle = 'rgba(0,0,0,.55)'; rr(V.ax - 56, V.ay - 76, 112, 10, 5); cx.fill(); cx.fillStyle = V.bh / V.bm > 0.3 ? '#7ddf8b' : '#ff6b6b'; rr(V.ax - 56, V.ay - 76, 112 * Math.max(0.03, V.bh / V.bm), 10, 5); cx.fill(); }
  if (V.obj === 'e') (V.goals || []).forEach((q, i) => { const done = i < V.gi, cur = i === V.gi; cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.ellipse(q[0], q[1] + 6, 40, 12, 0, 0, 7); cx.fill(); cx.fillStyle = '#7a4a24'; cx.fillRect(q[0] - 3, q[1] - 90, 6, 96); cx.fillStyle = done ? '#9aa39a' : (i === V.goals.length - 1 ? '#f0c040' : '#e04a3c'); cx.beginPath(); cx.moveTo(q[0] + 3, q[1] - 90); cx.lineTo(q[0] + 52, q[1] - 76 + Math.sin(tm * 4 + i) * 3); cx.lineTo(q[0] + 3, q[1] - 56); cx.fill(); if (cur) { cx.strokeStyle = '#ffd34d'; cx.lineWidth = 4; cx.setLineDash([8, 8]); cx.lineDashOffset = -tm * 20; cx.beginPath(); cx.ellipse(q[0], q[1] + 6, 85, 38, 0, 0, 7); cx.stroke(); cx.setLineDash([]); } });
  // 슬롯 바닥
  SP.forEach((s, i) => { cx.fillStyle = 'rgba(70,46,22,.14)'; cx.beginPath(); cx.ellipse(s[0], s[1] + 16, 22, 9, 0, 0, 7); cx.fill(); cx.setLineDash([4, 5]); cx.strokeStyle = sel === i ? '#a8322a' : 'rgba(70,46,22,.4)'; cx.lineWidth = sel === i ? 3 : 1.5; cx.stroke(); cx.setLineDash([]); });
  const FC = { 왜군: ['#ff9a8f', '#d9453a'], 후금군: ['#d9a4ff', '#8e3fd0'], 청군: ['#8fc2ff', '#2f6fd6'] }[CH[R[V.rd].ch].foe], FP = FOEP[CH[R[V.rd].ch].foe];
  const DL = []; // 깊이(y) 순서로 그리기
  SP.forEach((s, i) => { const u = V.un && V.un[i]; if (!u) return; DL.push([s[1] + 16, () => { const T = UT[u.t], key = 'u' + i, kk = kickOf(key, tm), h = 62 + u.lv * 5, fl = FACE.has(key) ? FACE.get(key) : true;
      shade(s[0], s[1] + 16, 15 + u.lv * 2); spr(USP[u.t], s[0], s[1] + 16, h, { flip: fl, bob: Math.abs(Math.sin(tm * 2.2 + i)) * 1.2, dx: kk.dx, dy: kk.dy, sx: kk.sx, sy: kk.sy * (1 + Math.sin(tm * 2 + i) * 0.012) });
      if (u.lv > 1) { cx.strokeStyle = T.c; cx.globalAlpha = 0.6; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(s[0], s[1] + 16, 18 + u.lv * 2, 8 + u.lv, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1; }
      for (let k = 0; k < u.lv; k++) { cx.fillStyle = '#ffd34d'; cx.strokeStyle = '#8a5a00'; cx.lineWidth = 1; cx.beginPath(); cx.arc(s[0] - (u.lv - 1) * 4.5 + k * 9, s[1] + 28, 3.4, 0, 7); cx.fill(); cx.stroke(); }
      if (sel === i) pill(T.n + ' Lv.' + u.lv, s[0], s[1] + 16 - h - 8, '#ffffff', '#2b2440'); }]); });
  for (const e of V.en || []) { const T = ET[e[1]], q = lerpTo('e' + e[0], e[2], e[3], 0.5), ek = 'e' + e[0], h = EH[e[1]], ph = tm * (e[1] === 'cav' ? 12 : 8) + e[0] * 1.7, sn = Math.sin(ph);
    if (Math.abs(q[4] || 0) > 12) FACE.set(ek, q[4] < 0); const fl = FACE.get(ek) || false, fy = q[1] + 12;
    DL.push([fy, () => { if (e[1] === 'camp') { drawCamp(q[0], fy, e[4], tm); return; } const w = h * 0.32;
      if (e[1] === 'boss') { cx.strokeStyle = 'rgba(255,60,60,.6)'; cx.lineWidth = 4; cx.beginPath(); cx.ellipse(q[0], fy, 34 + Math.sin(tm * 5) * 3, 13, 0, 0, 7); cx.stroke(); }
      shade(q[0], fy, w); cx.strokeStyle = FC[1]; cx.globalAlpha = 0.85; cx.lineWidth = 3; cx.beginPath(); cx.ellipse(q[0], fy, w * 0.95, w * 0.34, 0, 0, 7); cx.stroke(); cx.globalAlpha = 1;
      spr(FP + '_' + ETK[e[1]], q[0], fy, h, { flip: fl, bob: Math.abs(sn) * (e[1] === 'cav' ? 4.5 : 3.2), lean: sn * 0.055, sx: 1 + Math.sin(ph * 2) * 0.025, sy: 1 - Math.sin(ph * 2) * 0.02, flash: e[5] });
      if (e[4] < 1) { const bw = Math.max(26, h * 0.5), by = fy - h - 6; cx.fillStyle = 'rgba(0,0,0,.55)'; rr(q[0] - bw / 2, by, bw, 5, 2.5); cx.fill(); cx.fillStyle = '#ff6b6b'; rr(q[0] - bw / 2, by, bw * Math.max(0.05, e[4]), 5, 2.5); cx.fill(); } }]); }
  for (const p of V.pl) { const q = lerpTo(p.id, p.x, p.y, 0.45), mine = p.id === Net.id, key = 'h' + p.id, mv = Math.hypot(q[4] || 0, q[5] || 0) / 20, kk = kickOf(key, tm), fy = q[1] + 22, H = 84;
    if (Math.abs(q[4] || 0) > 25 && !(KICK.has(key) && tm - KICK.get(key).t < 0.5)) FACE.set(key, q[4] < 0);
    DL.push([fy, () => { const walk = Math.min(1, mv / 4), sn = Math.sin(tm * 10 + p.id.length), dn = p.down > 0; cx.globalAlpha = dn ? 0.45 : (p.fz > 0 && Math.floor(performance.now() / 120) % 2 ? 0.65 : 1);
      shade(q[0], fy, 20); if (mine) { cx.strokeStyle = 'rgba(200,60,40,.9)'; cx.lineWidth = 3; cx.beginPath(); cx.ellipse(q[0], fy, 26 + Math.sin(tm * 4) * 1.5, 10, 0, 0, 7); cx.stroke(); }
      spr(RSP[p.role], q[0], fy, H, { flip: !!FACE.get(key), bob: Math.abs(sn) * 3.5 * walk + Math.sin(tm * 2) * 0.8, lean: dn ? -1.35 : sn * 0.05 * walk, dx: kk.dx, dy: kk.dy, sx: kk.sx, sy: kk.sy });
      cx.globalAlpha = 1;
      pill(p.name, q[0], fy - H - 20, mine ? '#ffd34d' : 'rgba(20,18,40,.75)', mine ? '#2b2440' : '#fff');
      cx.fillStyle = 'rgba(0,0,0,.55)'; rr(q[0] - 20, fy - H - 11, 40, 5, 2.5); cx.fill(); cx.fillStyle = '#7dffa0'; rr(q[0] - 20, fy - H - 11, 40 * Math.max(0.05, p.hp / p.mx), 5, 2.5); cx.fill();
      if (dn) pill(Math.ceil(p.down) + '초 뒤 복귀', q[0], fy + 14, 'rgba(20,18,40,.8)', '#fff'); }]); }
  DL.sort((A, B) => A[0] - B[0]); for (const d of DL) d[1]();
  // 새 연출 수집
  for (const s of V.sh || []) { effects.push({ k: 'sh', a: s, life: 0.2, mx: 0.2 }); noteShot(s, tm); }
  for (const f of V.fx || []) {
    if (f[3] === 'dmg') { if (effects.length < 300) effects.push({ k: 'dmg', x: f[0], y: f[1], v: f[2], life: 0.7, mx: 0.7 }); continue; }
    effects.push({ k: f[3], x: f[0], y: f[1], r: f[2], life: f[3] === 'boss' ? 1.2 : 0.38, mx: f[3] === 'boss' ? 1.2 : 0.38 });
    if (f[3] === 'die' && f[4] && f[4] !== 'camp' && effects.length < 300) effects.push({ k: 'corpse', x: f[0], y: f[1], ty: f[4], life: 0.55, mx: 0.55 });
    if (f[3] === 'die' && (f[2] < 28 || f[4] === 'boss')) for (let k = 0; k < 2; k++) gems.push({ x: f[0], y: f[1], vx: (Math.random() - 0.5) * 120, vy: -40 - Math.random() * 60, t: 0 });
    if (f[3] === 'roar' || f[3] === 'boss') shake = Math.max(shake, 0.35); }
  V.sh = []; V.fx = [];
  const dt = 1 / 60;
  for (let i = effects.length - 1; i >= 0; i--) { const f = effects[i]; f.life -= dt; if (f.life <= 0) { effects.splice(i, 1); continue; } const t = 1 - f.life / f.mx;
    if (f.k === 'sh') { const a = f.a, kd = a[5] || ''; const dx = a[2] - a[0], dy = a[3] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      if (kd === 'bow' || kd === 'archer' || kd === 'hwa') { const p = Math.min(1, t * 1.25), x = a[0] + dx * p, y = a[1] + dy * p; cx.strokeStyle = 'rgba(255,255,255,.35)'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(x - ux * 22, y - uy * 22); cx.lineTo(x, y); cx.stroke(); cx.strokeStyle = '#f3e1b0'; cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(x - ux * 12, y - uy * 12); cx.lineTo(x, y); cx.stroke(); cx.fillStyle = '#fff'; cx.beginPath(); cx.moveTo(x + ux * 5, y + uy * 5); cx.lineTo(x - uy * 3, y + ux * 3); cx.lineTo(x + uy * 3, y - ux * 3); cx.fill(); }
      else if (kd === 'gun' || kd === 'gunner') { const p = Math.min(1, t * 2.2), x = a[0] + dx * p, y = a[1] + dy * p; if (t < 0.3) { cx.fillStyle = 'rgba(255,230,120,' + (1 - t * 3) + ')'; cx.beginPath(); cx.arc(a[0] + ux * 12, a[1] + uy * 12, 8 * (1 - t * 2), 0, 7); cx.fill(); } cx.strokeStyle = 'rgba(255,240,170,.5)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x - ux * 26, y - uy * 26); cx.lineTo(x, y); cx.stroke(); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x, y, 3.2, 0, 7); cx.fill(); }
      else if (kd === 'cannon') { const p = Math.min(1, t * 1.1), x = a[0] + dx * p, y = a[1] + dy * p - Math.sin(Math.PI * p) * 34; cx.fillStyle = 'rgba(0,0,0,.25)'; cx.beginPath(); cx.ellipse(a[0] + dx * p, a[1] + dy * p + 6, 6, 3, 0, 0, 7); cx.fill(); cx.fillStyle = '#2b2f3e'; cx.strokeStyle = '#ffb347'; cx.lineWidth = 2; cx.beginPath(); cx.arc(x, y, 5.5, 0, 7); cx.fill(); cx.stroke(); }
      else { const ang = Math.atan2(dy, dx); cx.globalAlpha = 1 - t; cx.strokeStyle = '#fff'; cx.lineWidth = 5 * (1 - t) + 1; cx.beginPath(); cx.arc(a[2] - ux * 8, a[3] - uy * 8, 15, ang - 1.1 + t * 0.6, ang + 1.1 + t * 0.6); cx.stroke(); cx.globalAlpha = 0.25 * (1 - t); cx.strokeStyle = '#ffe9a0'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(a[2], a[3]); cx.stroke(); cx.globalAlpha = 1; } }
    else if (f.k === 'corpse') { cx.globalAlpha = Math.max(0, 1 - t * 1.1); spr(FP + '_' + ETK[f.ty], f.x, f.y + 12, EH[f.ty], { lean: t * 1.1, sy: 1 - t * 0.2, dy: t * 6, flash: t < 0.3 }); cx.globalAlpha = 1; }
    else if (f.k === 'dmg') { const big = f.v >= 40; cx.globalAlpha = Math.min(1, f.life * 3); cx.font = 'bold ' + (big ? 17 : 13) + 'px sans-serif'; cx.textAlign = 'center'; cx.lineWidth = 3; cx.strokeStyle = 'rgba(20,10,40,.85)'; cx.fillStyle = big ? '#ffe36b' : '#ffffff'; const yy = f.y - t * 22; cx.strokeText(f.v, f.x, yy); cx.fillText(f.v, f.x, yy); cx.globalAlpha = 1; }
    else { const col = f.k === 'roar' ? '#ffe082' : f.k === 'merge' ? '#fff176' : f.k === 'sum' ? '#80e0ff' : f.k === 'boom' ? '#ffa94d' : f.k === 'die' ? '#6a4524' : '#ff8080'; cx.strokeStyle = col; cx.fillStyle = col; cx.globalAlpha = (1 - t) * 0.9; cx.lineWidth = 5 * (1 - t) + 1; cx.beginPath(); cx.arc(f.x, f.y, f.r * (0.35 + 0.65 * t), 0, 7); cx.stroke(); if (f.k === 'die' || f.k === 'merge' || f.k === 'sum') { for (let k = 0; k < 6; k++) { const an = k * 1.047 + f.r; cx.beginPath(); cx.arc(f.x + Math.cos(an) * f.r * t * 1.3, f.y + Math.sin(an) * f.r * t * 1.3, 3 * (1 - t) + 0.5, 0, 7); cx.fill(); } } cx.globalAlpha = 1; } }
  // 경험치 구슬: 흩어졌다가 내 영웅에게 빨려 들어감
  const me2 = RP.get(Net.id);
  for (let i = gems.length - 1; i >= 0; i--) { const m = gems[i]; m.t += dt;
    if (m.t < 0.3) { m.x += m.vx * dt; m.y += m.vy * dt; m.vy += 260 * dt; } else if (me2) { const dx = me2[0] - m.x, dy = me2[1] - m.y, d = Math.hypot(dx, dy) || 1, sp = 160 + (m.t - 0.3) * 520; m.x += dx / d * sp * dt; m.y += dy / d * sp * dt; if (d < 14) { gems.splice(i, 1); continue; } } else if (m.t > 1.2) { gems.splice(i, 1); continue; }
    if (m.t > 4) { gems.splice(i, 1); continue; }
    cx.shadowColor = '#5af'; cx.shadowBlur = 8; { const oi = okImg('orb'); if (oi) cx.drawImage(oi, m.x - 8, m.y - 8, 16, 16); else { cx.fillStyle = '#9ff2ff'; cx.fillRect(m.x - 3, m.y - 3, 6, 6); } } cx.shadowBlur = 0; }
  cx.restore();
  // 화면 밖 표시: 적(빨강) / 목표(노랑)
  { const edge = (wx, wy, col, sz, isGoal) => { const sx = wx - cam.x, sy = wy - cam.y; if (sx > 14 && sx < W - 14 && sy > 14 && sy < H - 14) return false; const cxn = W / 2, cyn = H / 2, dx = sx - cxn, dy = sy - cyn, k = Math.min((W / 2 - 26) / Math.abs(dx || 1e-3), (H / 2 - 26) / Math.abs(dy || 1e-3)), ex = cxn + dx * k, ey = cyn + dy * k, an = Math.atan2(dy, dx);
      cx.save(); cx.translate(ex, ey); cx.rotate(an); cx.fillStyle = col; cx.strokeStyle = 'rgba(40,10,10,.7)'; cx.lineWidth = 2; cx.globalAlpha = isGoal ? 0.95 : 0.8; cx.beginPath(); cx.moveTo(sz, 0); cx.lineTo(-sz * 0.6, -sz * 0.75); cx.lineTo(-sz * 0.6, sz * 0.75); cx.closePath(); cx.fill(); cx.stroke(); cx.restore(); return true; };
    let cnt = 0; for (const e of V.en || []) { const q = RP.get('e' + e[0]); if (!q) continue; if (e[1] === 'camp') { edge(q[0], q[1], '#ffb347', 13, true); continue; } if (cnt < 40 && edge(q[0], q[1], e[1] === 'boss' ? '#ff2a2a' : '#ff6b5e', e[1] === 'boss' ? 14 : 8, false)) cnt++; }
    if (V.obj === 'e' && V.goals[V.gi]) edge(V.goals[V.gi][0], V.goals[V.gi][1], '#ffd34d', 15, true);
    if (!V.castle) { /* 병사 무리 위치 */ } }
  if (V.buff) { cx.fillStyle = 'rgba(255,200,0,.08)'; cx.fillRect(0, 0, W, H); }
  if (V.evR) { cx.fillStyle = 'rgba(20,16,40,.85)'; rr(250, 214, 460, 66, 33); cx.fill(); cx.fillStyle = '#fff'; cx.font = 'bold 22px sans-serif'; cx.textAlign = 'center'; cx.fillText('결정: ' + V.evR, 480, 255); }
  cx.restore();
}
function boot() { initLobby(); setupInput(); show('sLobby'); window.__dbg = { get G() { return G; }, get V() { return V; }, Net, R, hostCtl, hostMsg, stepBattle, makeSnap }; }
boot();
lobbyArt();
if (window.BWJ) BWJ.init({ game: '조선의 위기 디펜스', ver: 'v0.8.1', parent: '#stage' });
