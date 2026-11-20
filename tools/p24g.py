f='src/game.js'; s=open(f).read()
def rep(a,b):
    global s
    assert s.count(a)==1,a[:70]; s=s.replace(a,b)
duel = r"""
// ===== 적장 일기토: 제한된 원형 무대에서 장수와 겨뤄요 (피하고 · 공격) =====
function beginDuel(e) {
  const all = G.order.map((id) => G.pl[id]); let sx = 0, sy = 0; for (const p of all) { sx += p.x; sy += p.y; } sx /= all.length; sy /= all.length;
  const R0 = 240, cx = Math.max(R0 + 30, Math.min(G.ww - R0 - 30, sx)), cy = Math.max(R0 + 30, Math.min(G.wh - R0 - 30, sy));
  const D = G.du = { b: e, ph: 'warn', tm: 2.8, cx, cy, R: R0, saved: all.map((p) => [p.id, p.x, p.y]), enSaved: G.en.filter((x) => x !== e), tl: [], pj: [], at: 1.4, last: '', dash: null };
  G.en = []; e.x = cx + R0 * 0.5; e.y = cy; e.st = 0; e.ef = 0;
  all.forEach((p, i) => { const a = Math.PI + (i - (all.length - 1) / 2) * 0.55; p.x = cx + Math.cos(a) * R0 * 0.55; p.y = cy + Math.sin(a) * R0 * 0.45; p.mvx = p.mvy = 0; if (p.down > 0) { p.down = 0; p.hp = p.mx * 0.4; } p.fz = 3; p.dcd = 0.6; });
  G.info = { id: Date.now() + Math.random(), tt: '⚔ 일기토! ' + (e.bn || '적장') + '의 도전', tx: '원 안에서 붉은 표시를 피하며 공격하세요 (함성 버튼 = 구르기)' };
}
function endDuel(win) {
  const D = G.du, b = D.b; G.du = null;
  for (const [id, x, y] of D.saved) { const p = G.pl[id]; p.x = x; p.y = y; p.mvx = p.mvy = 0; if (win) { if (p.hp <= 0) p.hp = p.mx * 0.4; p.hp = Math.min(p.mx, p.hp + p.mx * 0.35); } else p.hp = p.mx * 0.5; p.down = 0; p.fz = 3; }
  G.en = D.enSaved;
  if (win) { b.hp = 0; G.fx.push([D.cx, D.cy, 120, 'boom']); enemyDeath(b); G.food += 60; gainXp(8 + G.sc * 0.4); G.info = { id: Date.now() + Math.random(), tt: '🏆 일기토 승리!', tx: (b.bn || '적장') + '을(를) 쓰러뜨렸어요! 영웅들의 체력이 회복돼요' }; }
  else { b.dueled = true; b.bk = 3; const q = spawnPos() || [G.ax + 500, G.ay]; b.x = q[0]; b.y = q[1]; G.en.push(b); G.info = { id: Date.now() + Math.random(), tt: '😤 일기토에서 밀렸어요', tx: (b.bn || '적장') + '이(가) 남은 체력으로 전장에 뛰어들었어요!' }; }
}
function duelStep(dt) {
  const D = G.du, b = D.b, dmk = G.dif.dm * (1 + 0.02 * G.sc), alive = () => G.order.map((id) => G.pl[id]).filter((p) => p.hp > 0);
  const inArena = (o, r) => { const dx = o.x - D.cx, dy = o.y - D.cy, d = Math.hypot(dx, dy), m = D.R - r; if (d > m) { o.x = D.cx + dx / d * m; o.y = D.cy + dy / d * m; } };
  for (const id of G.order) { const p = G.pl[id]; if (p.fz > 0) p.fz -= dt; if (p.cd > 0) p.cd -= dt; if (p.hp <= 0) { p.hp = 0; continue; } const S = heroStats(p); p.x += p.mvx * S.sp * dt; p.y += p.mvy * S.sp * dt; inArena(p, 16); if (S.reg > 0) p.hp = Math.min(p.mx, p.hp + p.mx * S.reg * dt); }
  D.tm -= dt; if (b.ef > 0) b.ef -= dt;
  if (D.ph === 'warn') { if (D.tm <= 0) { D.ph = 'fight'; D.tm = 75; D.at = 1.0; } return; }
  const hs = alive(); if (!hs.length || D.tm <= 0) { endDuel(false); return; }
  // 영웅 공격 (카드가 많을수록 세져요)
  for (const p of hs) { p.dcd = (p.dcd || 0) - dt; const S = heroStats(p), rg = Math.min(360, Math.max(S.rg, 110)); if (p.dcd <= 0 && Math.hypot(b.x - p.x, b.y - p.y) <= rg + 30) { let wl = 0; for (const k in WEAP) wl += p.cards[k] || 0; p.dcd = 0.55 / S.as; const d = 20 * (1 + 0.2 * wl) * S.dmg * (rg < 200 ? 1.35 : 1); dmgEnemy(b, d); G.shots.push([p.x, p.y - 20, b.x, b.y - 20, 2, rg < 200 ? 'thrust' : 'bow']); if (G.shots.length > 40) G.shots.shift(); } }
  // 장수 행동
  const enr = b.hp / b.mx < 0.35, near = hs.slice().sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y))[0];
  if (D.dash) { const k = D.dash; k.t += dt; const f = Math.min(1, k.t / k.T); b.x = k.x0 + (k.x1 - k.x0) * f; b.y = k.y0 + (k.y1 - k.y0) * f; for (const p of hs) if (!k.hit[p.id] && p.fz <= 0 && Math.hypot(p.x - b.x, p.y - b.y) < 44) { k.hit[p.id] = 1; hurt(p, 30 * dmk); G.fx.push([p.x, p.y, 30, 'hit']); } if (f >= 1) D.dash = null; }
  else {
    const dd = Math.hypot(near.x - b.x, near.y - b.y); if (dd > 110) { const v = (enr ? 64 : 50) * dt; b.x += (near.x - b.x) / dd * v; b.y += (near.y - b.y) / dd * v; inArena(b, 30); }
    D.at -= dt; if (D.at <= 0) { D.at = enr ? 1.5 : 2.3; const P = ['ring', 'dash', 'fan', 'slam'].filter((x) => x !== D.last), k = P[rint(P.length)]; D.last = k;
      if (k === 'ring') D.tl.push({ k, x: b.x, y: b.y, r: enr ? 175 : 150, t: 1.1, t0: 1.1 });
      else if (k === 'slam') { for (let i = 0; i < 3; i++) { const h = hs[rint(hs.length)]; D.tl.push({ k, x: Math.max(D.cx - D.R + 30, Math.min(D.cx + D.R - 30, h.x + rnd(-60, 60))), y: Math.max(D.cy - D.R + 30, Math.min(D.cy + D.R - 30, h.y + rnd(-60, 60))), r: 72, t: 1.0 + i * 0.3, t0: 1.0 + i * 0.3 }); } }
      else if (k === 'dash') { const dx = near.x - b.x, dy = near.y - b.y, L = Math.hypot(dx, dy) || 1, len = Math.min(380, L + 120); let x2 = b.x + dx / L * len, y2 = b.y + dy / L * len; const o = { x: x2, y: y2 }; inArena(o, 30); D.tl.push({ k, x: b.x, y: b.y, x2: o.x, y2: o.y, t: 0.9, t0: 0.9 }); }
      else D.tl.push({ k: 'fan', x: b.x, y: b.y, a: Math.atan2(near.y - b.y, near.x - b.x), t: 0.75, t0: 0.75 }); } }
  for (let i = D.tl.length - 1; i >= 0; i--) { const t = D.tl[i]; t.t -= dt; if (t.t > 0) continue; D.tl.splice(i, 1);
    if (t.k === 'ring' || t.k === 'slam') { for (const p of hs) if (p.fz <= 0 && Math.hypot(p.x - t.x, p.y - t.y) < t.r) hurt(p, (t.k === 'ring' ? 28 : 22) * dmk); G.fx.push([t.x, t.y, t.r, 'boom']); }
    else if (t.k === 'dash') { D.dash = { x0: b.x, y0: b.y, x1: t.x2, y1: t.y2, t: 0, T: 0.28, hit: {} }; }
    else if (t.k === 'fan') { for (let j = -3; j <= 3; j++) { const a = t.a + j * 0.2; D.pj.push({ x: t.x, y: t.y, vx: Math.cos(a) * 250, vy: Math.sin(a) * 250, life: 1.7 }); } G.fx.push([t.x, t.y, 30, 'puff']); } }
  for (let i = D.pj.length - 1; i >= 0; i--) { const q = D.pj[i]; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt; let hit = false; for (const p of hs) if (p.fz <= 0 && Math.hypot(p.x - q.x, p.y - 8 - q.y) < 18) { hurt(p, 13 * dmk); G.fx.push([p.x, p.y - 12, 14, 'hit']); hit = true; break; } if (hit || q.life <= 0 || Math.hypot(q.x - D.cx, q.y - D.cy) > D.R + 50) D.pj.splice(i, 1); }
  for (const p of hs) if (p.fz <= 0 && Math.hypot(p.x - b.x, p.y - b.y) < 38) hurt(p, 14 * dmk * dt);
  for (const p of hs) if (p.hp <= 0) { p.hp = 0; G.fx.push([p.x, p.y, 30, 'die']); }
  if (b.hp <= 0) endDuel(true);
}
"""
rep("function bossAttack(e) {", duel + "function bossAttack(e) {")
rep("G.bn = nm; G.fx.push([q[0], q[1], 60, 'boss']); return e; }","G.bn = nm; G.fx.push([q[0], q[1], 60, 'boss']); if (!G.endless && !fixed && G.ph === 'battle' && !G.du) beginDuel(e); return e; }")
rep("  if (np === 1 && G.pl[G.order[0]].offer) return; // 혼자 할 때 카드 고르는 동안 멈춤\n","  if (np === 1 && G.pl[G.order[0]].offer) return; // 혼자 할 때 카드 고르는 동안 멈춤\n  if (G.du) { duelStep(dt); return; }\n")
# skill = roll in duel
rep("else if (m.k === 'skill' && G.ph === 'battle' && p.cd <= 0 && !p.down) {","else if (m.k === 'skill' && G.ph === 'battle' && G.du && G.du.ph === 'fight' && p.cd <= 0 && p.hp > 0) { p.cd = 6; p.fz = 0.7; const l = Math.hypot(p.mvx, p.mvy) || 1; const dx = (Math.abs(p.mvx) + Math.abs(p.mvy) > 0.05 ? p.mvx / l : 1), dy = (Math.abs(p.mvx) + Math.abs(p.mvy) > 0.05 ? p.mvy / l : 0); p.x += dx * 130; p.y += dy * 130; G.fx.push([p.x, p.y, 40, 'puff']); }\n  else if (m.k === 'skill' && G.ph === 'battle' && !G.du && p.cd <= 0 && !p.down) {")
rep("else if (m.k === 'summon' && G.ph === 'battle' && G.obj !== 'e') doSummon(false);","else if (m.k === 'summon' && G.ph === 'battle' && G.obj !== 'e' && !G.du) doSummon(false);")
# snapshot
rep("s.en = g.en.slice(0, 220).map(","s.du = g.du ? { cx: Math.round(g.du.cx), cy: Math.round(g.du.cy), R: g.du.R, ph: g.du.ph, tm: Math.ceil(Math.max(0, g.du.tm)), hp: g.du.b.hp / g.du.b.mx, bn: g.du.b.bn || '적장', tl: g.du.tl.map((t) => [t.k, Math.round(t.x), Math.round(t.y), t.r || 0, Math.round(t.x2 || 0), Math.round(t.y2 || 0), +(t.t / t.t0).toFixed(2), +(t.a || 0).toFixed(2)]), pj: g.du.pj.map((q) => [Math.round(q.x), Math.round(q.y)]) } : null;\n    s.en = (g.du ? [g.du.b] : g.en).slice(0, 220).map(")
rep("s.pj = g.pj.slice(0, 90).map(","s.pj = (g.du ? [] : g.pj).slice(0, 90).map(")
# client draw: arena
arena = r"""  if (V.du) { const D = V.du, VW2 = W / Z, VH2 = H / Z, pr = (a) => Math.min(1, Math.max(0, a)); cx.save(); cx.fillStyle = 'rgba(10,6,20,.5)'; cx.beginPath(); cx.rect(cam.x - 40, cam.y - 40, VW2 + 80, VH2 + 80); cx.arc(D.cx, D.cy, D.R, 0, 7); cx.fill('evenodd'); cx.fillStyle = 'rgba(255,240,200,.10)'; cx.beginPath(); cx.arc(D.cx, D.cy, D.R, 0, 7); cx.fill(); cx.strokeStyle = 'rgba(255,214,110,.95)'; cx.lineWidth = 6; cx.setLineDash([22, 12]); cx.stroke(); cx.setLineDash([]);
    for (const t of D.tl) { const k = 1 - t[6], al = 0.16 + 0.34 * k; cx.fillStyle = `rgba(255,50,40,${al})`; cx.strokeStyle = 'rgba(255,90,70,.9)'; cx.lineWidth = 3;
      if (t[0] === 'ring' || t[0] === 'slam') { cx.beginPath(); cx.arc(t[1], t[2], t[3], 0, 7); cx.fill(); cx.stroke(); cx.beginPath(); cx.arc(t[1], t[2], t[3] * k, 0, 7); cx.stroke(); }
      else if (t[0] === 'dash') { const a = Math.atan2(t[5] - t[2], t[4] - t[1]), L = Math.hypot(t[4] - t[1], t[5] - t[2]); cx.save(); cx.translate(t[1], t[2]); cx.rotate(a); cx.fillRect(0, -22, L, 44); cx.strokeRect(0, -22, L, 44); cx.restore(); }
      else if (t[0] === 'fan') { cx.beginPath(); cx.moveTo(t[1], t[2]); cx.arc(t[1], t[2], 430, t[7] - 0.62, t[7] + 0.62); cx.closePath(); cx.fill(); cx.stroke(); } }
    for (const q of D.pj) { cx.fillStyle = 'rgba(255,90,60,.35)'; cx.beginPath(); cx.arc(q[0], q[1] - 8, 13, 0, 7); cx.fill(); cx.fillStyle = '#7a1010'; cx.beginPath(); cx.arc(q[0], q[1] - 8, 7, 0, 7); cx.fill(); cx.strokeStyle = '#ffd0c0'; cx.lineWidth = 2; cx.stroke(); }
    cx.restore(); }
"""
rep("  for (const c of V.cr || []) { if (c[2] === 'gmc') continue;", arena + "  for (const c of V.cr || []) { if (c[2] === 'gmc') continue;")
hud = r"""    if (V.du) { const D = V.du, bw = Math.min(W * 0.5, 460), bx = (W - bw) / 2, by = Math.round(H * 0.17); cx.save(); cx.textAlign = 'center'; cx.fillStyle = 'rgba(30,10,10,.78)'; rr(bx - 10, by - 30, bw + 20, 58, 14); cx.fill(); cx.fillStyle = '#ffe9b0'; cx.font = 'bold 17px sans-serif'; cx.fillText('⚔ 일기토 · ' + D.bn + (D.ph === 'warn' ? ' · 준비!' : ' · ' + D.tm + '초'), W / 2, by - 8); cx.fillStyle = 'rgba(0,0,0,.6)'; rr(bx, by + 2, bw, 14, 7); cx.fill(); cx.fillStyle = D.hp > 0.35 ? '#ff6a4d' : '#ffb02e'; rr(bx, by + 2, Math.max(8, bw * Math.max(0, D.hp)), 14, 7); cx.fill(); cx.restore(); }
"""
rep("    if (bossBan > 0) { bossBan -= DT;", hud + "    if (bossBan > 0) { bossBan -= DT;")
rep("$('btnSkill').innerHTML = p.cd > 0 ? `함성<br><small>${Math.ceil(p.cd)}초</small>` : '함성<br><small>준비!</small>';","{ const sk = V.du ? '구르기' : '함성'; $('btnSkill').innerHTML = p.cd > 0 ? `${sk}<br><small>${Math.ceil(p.cd)}초</small>` : `${sk}<br><small>준비!</small>`; }")
rep("{ v: 'v0.24', d: '11/20', t: ['🌱","{ v: 'v0.24', d: '11/20', t: ['⚔ 적장 일기토: 적장이 나타나면 경고 화면 뒤에 원형 무대에서 1:1 승부! 붉은 표시를 피하고(함성 버튼 = 구르기) 공격하세요. 이기면 적장을 쓰러뜨려요', '🎵 배경음이 생겼어요 (설정에서 끌 수 있어요)', '🌱")
open(f,'w').write(s)
