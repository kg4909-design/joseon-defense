const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const AUDIT = () => {
  const st = document.getElementById('stage'); const sr = st.getBoundingClientRect(); const k = sr.width / 960;
  const R = (e) => { const r = e.getBoundingClientRect(); return { l: (r.left - sr.left) / k, t: (r.top - sr.top) / k, r: (r.right - sr.left) / k, b: (r.bottom - sr.top) / k, w: r.width / k, h: r.height / k }; };
  const vis = (e) => { if (!e.offsetParent && getComputedStyle(e).position !== 'fixed') return false; const c = getComputedStyle(e); return c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity > 0.05; };
  let root = [...document.querySelectorAll('#setBox.on,#pauseBox.on,#tutBox.on,#cwBox.on,#saveBox.on,#updModal.on')]; if(!root.length) root=[...document.querySelectorAll('.screen.on')];
  const issues = []; const btns = [];
  const scroller = (e) => { let p = e.parentElement; while (p && p !== st) { const c = getComputedStyle(p); if (/(auto|scroll)/.test(c.overflowY) && p.scrollHeight > p.clientHeight + 2) return p; p = p.parentElement; } return null; };
  for (const rt of root) for (const e of rt.querySelectorAll('button,select,input,h1,h2,h3,.panel,.tag,#bkMap,li,b,span,div')) {
    if (!vis(e)) continue; const isB = /BUTTON|SELECT|INPUT/.test(e.tagName);
    const own = isB || [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()); if (!own && !e.classList.contains('panel')) continue;
    const r = R(e); if (!r.w || !r.h) continue; const sc = scroller(e);
    const tag = (e.id ? '#' + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '')) + ':' + (e.textContent || '').trim().slice(0, 10);
    if (!sc) { if (r.l < -1 || r.t < -1 || r.r > 961 || r.b > 541) issues.push('OUT ' + tag + ' ' + [r.l, r.t, r.r, r.b].map(Math.round)); }
    else { const s = R(sc); if (r.l < s.l - 1 || r.r > s.r + 1) issues.push('HCLIP ' + tag + ' ' + [r.l, r.r, s.l, s.r].map(Math.round)); }
    if (isB && e.tagName === 'BUTTON' && !e.closest('#bwj-badge')) {
      let rr=r; if(sc){const q=R(sc); rr={l:Math.max(r.l,q.l),t:Math.max(r.t,q.t),r:Math.min(r.r,q.r),b:Math.min(r.b,q.b)}; rr.w=rr.r-rr.l; rr.h=rr.b-rr.t; if(rr.h<=2||rr.w<=2) continue;} btns.push({ tag, r: rr, full:r, sc: !!sc, el: e });
      if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).whiteSpace === 'nowrap') issues.push('TXT ' + tag + ' ' + e.scrollWidth + '>' + e.clientWidth);
      if (e.scrollHeight > e.clientHeight + 3) issues.push('TXTH ' + tag);
    }
  }
  // 버튼끼리 겹침 / 배지와 겹침
  const badge = document.getElementById('bwj-badge'); const B = R(badge);
  const inter = (a, b) => !(a.r <= b.l + 1 || b.r <= a.l + 1 || a.b <= b.t + 1 || b.b <= a.t + 1);
  for (let i = 0; i < btns.length; i++) {
    const a = btns[i];
    if (!document.querySelector('#pauseBox.on,#tutBox.on,#cwBox.on,#saveBox.on,#setBox.on,#updModal.on') && inter(a.r, B) && getComputedStyle(badge).display !== 'none') issues.push('BADGE ' + a.tag);
    for (let j = i + 1; j < btns.length; j++) { const b = btns[j]; if (a.el.contains(b.el) || b.el.contains(a.el)) continue; if (inter(a.r, b.r)) issues.push('OVL ' + a.tag + ' | ' + b.tag); }
    if (a.full.h < 40 && a.tag.indexOf('umX') < 0 && a.tag.indexOf('btnGear') < 0) issues.push('SMALL ' + a.tag + ' h' + Math.round(a.r.h));
  }
  return { n: btns.length, issues: issues.slice(0, 12) };
};
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const [w, h] = [+process.argv[2] || 906, +process.argv[3] || 411]; const shots = process.argv[4] === 'shots';
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 1000 });
  p.on('pageerror', (e) => console.log('PAGEERR', String(e)));
  await p.addInitScript(() => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.36'); });
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=60'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
  const T = async (name) => { await p.waitForTimeout(500); const r = await p.evaluate(AUDIT); console.log(w + 'x' + h, name, r.n, r.issues.length ? JSON.stringify(r.issues) : 'OK'); if (shots) await p.screenshot({ path: `/tmp/ds/f${w}_${name}.png` }); };
  await T('lobby');
  await p.click('#btnUpdL'); await T('upd'); await p.click('#umAll'); await T('upd_all'); await p.click('#umX');
  await p.click('#btnGearL'); await T('set');
  await p.click('#setClose'); await p.click('#btnCw'); await T('cw'); await p.click('#cwClose');
  await p.click('#btnLoad'); await T('save'); await p.click('#svClose');
  for (const [id, n] of [['#btnDex', 'dex'], ['#btnPas', 'pas'], ['#btnRank', 'rank']]) { await p.click('#sLobby.on '+id).catch(async()=>{await p.click('#bookBack');await p.click(id)}); await T(n); await p.click('#bookBack'); }
  await p.click('#btnDex');
  for (const t of ['syn', 'hero', 'boss', 'rank', 'daily', 'ach', 'pas']) { await p.click(`#bookTabs button[data-t="${t}"]`); await T('book_' + t); }
  await p.click('#bookBack');
  await p.fill('#nick', '하늘'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await T('room');
  await p.selectOption('#selStart', '10'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await T('brief');
  await p.click('#bqOpts .qo'); await T('brief_ans'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on'); await T('battle');
  await p.click('#btnPause'); await T('pause'); await p.click('#pHelp'); await T('tut'); await p.click('#tutSkip'); await p.click('#pResume').catch(()=>{});
  await p.evaluate(() => { const G = __dbg.G; G.paused = false; G.t = G.dur; }); await p.waitForSelector('#sResult.on'); await p.evaluate(()=>{document.getElementById('pauseBox').classList.remove('on');document.getElementById('tutBox').classList.remove('on')}); await T('result');
  await p.waitForTimeout(800); const q = await p.$('#qOpts .qo'); if (q && await q.isVisible()) { await q.click({timeout:3000}).catch(()=>{}); await T('result_ans'); }
  await p.evaluate(() => window.show('sEnd')); await T('end');
  await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
