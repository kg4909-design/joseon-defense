const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const poison of ['wss://YOUR-WORKER.workers.dev/ws', '', null]) {
    const p = await b.newPage(); await p.addInitScript((v) => { localStorage.setItem('jd_tut', '1'); localStorage.setItem('jd_upd_seen', 'v0.38'); if (v !== null) localStorage.setItem('hdg_relay', v); }, poison);
    await p.goto('file:///home/claude/joseon-defense/index.html'); await p.waitForSelector('#bwj-intro', { state: 'detached' });
    const val = await p.inputValue('#relayUrl'); await p.fill('#roomCode', 'ABCD'); await p.click('#btnJoin'); await p.waitForTimeout(1500);
    console.log(JSON.stringify(poison), '→ 입력칸:', val, '| 오류문구:', await p.textContent('#err'), '| 저장값:', await p.evaluate(() => localStorage.getItem('hdg_relay')));
    await p.close();
  }
  await b.close();
})();
