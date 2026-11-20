f='src/game.js'; s=open(f).read()
def rep(a,b):
    global s
    assert s.count(a)==1,a[:60]; s=s.replace(a,b)
rep("snd: 'on' }, o); })();","snd: 'on', bgm: 'on' }, o); })();")
bgm = r"""
// ===== 배경음(코드로 만드는 음악: 파일·인터넷 없이 재생) =====
const BGM = { on: false, lv: 0, step: 0, next: 0, bus: null, timer: null, SC: [293.66, 349.23, 392, 440, 523.25, 587.33, 698.46], BPM: 104,
  PH: [[0,-1,-1,2,-1,3,-1,-1,4,-1,3,-1,2,-1,-1,-1,0,-1,-1,2,-1,3,-1,-1,5,-1,4,-1,3,-1,-1,-1], [3,-1,-1,4,-1,5,-1,-1,4,-1,3,-1,2,-1,0,-1,2,-1,-1,3,-1,2,-1,0,1,-1,0,-1,0,-1,-1,-1], [0,-1,2,-1,3,-1,4,-1,5,-1,-1,4,3,-1,2,-1,3,-1,4,-1,5,-1,6,-1,5,-1,4,-1,3,-1,-1,-1], [4,-1,-1,3,-1,2,-1,-1,3,-1,2,-1,0,-1,-1,-1,2,-1,-1,0,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1]],
  start() { if (this.on || !SFX.ctx || ST.bgm === 'off') return; const c = SFX.ctx; this.bus = c.createGain(); this.bus.gain.value = 0.5; this.bus.connect(c.destination); this.on = true; this.next = c.currentTime + 0.15; this.step = 0; this.timer = setInterval(() => this.tick(), 90); },
  stop() { if (!this.on) return; this.on = false; clearInterval(this.timer); try { this.bus.gain.setTargetAtTime(0, SFX.ctx.currentTime, 0.2); } catch (e) {} },
  sync() { if (ST.bgm === 'off') { this.stop(); return; } if (!this.on) { this.start(); } if (!this.on) return; const v = (typeof V !== 'undefined') ? V : null; let lv = 0; if (v && v.ph === 'battle') { lv = v.paused ? 1 : v.du ? 3 : (v.en || []).some((e) => e[1] === 'boss') ? 3 : (v.t < 30 && !v.endless) ? 1 : 2; } this.lv = lv; },
  osc(f, t, d, type, v, lp) { const c = SFX.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0004, t + d); let n = o; if (lp) { const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); n = fl; } n.connect(g); g.connect(this.bus); o.start(t); o.stop(t + d + 0.05); },
  thud(t, v, f0) { const c = SFX.ctx, o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0 || 150, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.16); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.26); o.connect(g); g.connect(this.bus); o.start(t); o.stop(t + 0.3); },
  tak(t, v) { const c = SFX.ctx, n = Math.floor(c.sampleRate * 0.05), b = c.createBuffer(1, n, c.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; fl.type = 'bandpass'; fl.frequency.value = 1900; g.gain.value = v; s.connect(fl); fl.connect(g); g.connect(this.bus); s.start(t); },
  tick() { if (!this.on || !SFX.ctx) return; const c = SFX.ctx; if (c.state !== 'running') { this.next = c.currentTime + 0.1; return; } const sd = 60 / this.BPM / 4;
    while (this.next < c.currentTime + 0.35) { const t = this.next, i = this.step % 128, b = i % 16, lv = this.lv, bar = Math.floor(i / 16);
      if (b === 0 && bar % 2 === 0) { this.osc(73.42, t, sd * 30, 'triangle', 0.05, 380); this.osc(110, t, sd * 30, 'triangle', 0.03, 380); }
      const m = this.PH[Math.floor(i / 32)][i % 32]; if (m >= 0) { const f = this.SC[m]; this.osc(f, t, sd * 3.2, 'triangle', lv >= 2 ? 0.075 : 0.09, 2200); this.osc(f * 2.003, t, sd * 1.6, 'sine', 0.018); }
      if (lv >= 1 && (b === 0 || (lv >= 2 && b === 8))) this.thud(t, lv >= 2 ? 0.2 : 0.11, 150);
      if (lv >= 2) { if (b === 11 || b === 6) this.thud(t, 0.12, 120); if (b === 4 || b === 12) this.tak(t, 0.05); if (b === 14) this.tak(t, 0.025); }
      if (lv >= 3) { if (b % 2 === 0) this.thud(t, 0.07, 100); if (b === 0 && bar % 2 === 0) { this.osc(98, t, sd * 14, 'sawtooth', 0.03, 500); this.osc(138.6, t, sd * 14, 'sawtooth', 0.02, 500); } if (b === 8) this.tak(t, 0.06); }
      this.next += sd; this.step++; } } };
setInterval(() => { try { BGM.sync(); } catch (e) {} }, 400);
document.addEventListener('visibilitychange', () => { if (!SFX.ctx) return; if (document.hidden) SFX.ctx.suspend(); else SFX.ctx.resume(); });
"""
rep("['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, () => { SFX.init(); if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume(); }, { passive: true }));",
    bgm + "['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, () => { SFX.init(); if (SFX.ctx && SFX.ctx.state === 'suspended') SFX.ctx.resume(); BGM.sync(); }, { passive: true }));")
open(f,'w').write(s)
t='src/template.html'; h=open(t).read()
a='<div class="sr"><b>소리</b><button data-k="snd" data-v="on">켜기</button><button data-k="snd" data-v="off">끄기</button></div>'
assert h.count(a)==1
h=h.replace(a,a.replace('<b>소리</b>','<b>효과음</b>')+'\n <div class="sr"><b>배경음</b><button data-k="bgm" data-v="on">켜기</button><button data-k="bgm" data-v="off">끄기</button></div>')
open(t,'w').write(h)
