const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file:///home/claude/work/game/dist/index.html?fast=30');
  await p.waitForTimeout(1300); await p.screenshot({ path: 'test/b1_intro.png' });
  console.log('intro present @1.3s:', !!(await p.$('#bwj-intro')));
  await p.waitForSelector('#bwj-intro', { state: 'detached', timeout: 6000 }); console.log('intro removed ok');
  await p.screenshot({ path: 'test/b2_lobby.png' });
  await p.fill('#nick', 'a'); await p.click('#btnSingle'); await p.waitForSelector('#sRoom.on'); await p.click('#btnStart'); await p.waitForSelector('#sBrief.on'); await p.click('#btnFight'); await p.waitForSelector('#sBattle.on'); await p.waitForTimeout(800);
  await p.screenshot({ path: 'test/b3_battle.png' });
  await p.click('#bwj-badge button'); await p.waitForSelector('#bwj-fb'); await p.screenshot({ path: 'test/b4_fb.png' });
  console.log('form href:', await p.getAttribute('#bwjGo', 'href'), '| insta:', await p.getAttribute('#bwj-badge a.lg', 'href'));
  await p.click('#bwjX'); console.log('modal closed:', !(await p.$('#bwj-fb')));
  // 인트로 터치 건너뛰기
  const p2 = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p2.goto('file:///home/claude/work/game/dist/index.html'); await p2.waitForTimeout(500); await p2.mouse.click(300, 300); await p2.waitForSelector('#bwj-intro', { state: 'detached', timeout: 3000 }); console.log('skip by tap ok');
  console.log('errors', errs); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
