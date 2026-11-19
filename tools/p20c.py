t='src/template.html'; h=open(t).read()
def rep(a,b):
    global h
    assert h.count(a)==1,(h.count(a),a[:60]); h=h.replace(a,b)
rep('  <button id="btnUpdL">📢 업데이트 노트</button>','  <button id="btnUpdL">📢 업데이트 노트</button><button id="btnFs">⛶ 전체화면</button><div id="fsTip"></div>')
css="""
#btnFs{left:196px;bottom:14px;font-size:15px;padding:8px 14px}
#fsTip{display:none;left:50px;bottom:56px;max-width:420px;background:#fffaf0;border:2px solid #5b4636;border-radius:12px;padding:8px 12px;font-size:13px;line-height:1.4;color:#3b2a1c;font-weight:700}
#fsTip.on{display:block!important}
@media (max-height:620px){#btnFs{font-size:12px;padding:5px 10px;bottom:6px;left:150px}#fsTip{bottom:40px;font-size:12px}}
"""
i=h.rindex("</style>"); h=h[:i]+css+h[i:]
# manifest + meta for 홈 화면에 추가
rep('<meta name="viewport"','<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="theme-color" content="#1f2a36"><meta name="viewport"')
open(t,'w').write(h)
g='src/game.js'; s=open(g).read()
a="initUpd(); $('btnLoad')"
assert s.count(a)==1
s=s.replace(a,r"""initUpd();
  { // 전체화면 버튼 (앱 안 브라우저는 막혀 있어서 안내를 보여 줘요)
    const ua = navigator.userAgent, inApp = /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|Line\/|DaumApps/i.test(ua), de = document.documentElement;
    const can = !!(de.requestFullscreen || de.webkitRequestFullscreen), isFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement), tip = $('fsTip');
    const note = () => { tip.textContent = inApp ? '지금은 카카오톡 같은 앱 안의 브라우저라 전체화면이 안 돼요. 오른쪽 아래 ⋮ 메뉴에서 "다른 브라우저로 열기"를 눌러 크롬이나 삼성 인터넷에서 열어 주세요.' : /iPhone|iPad/.test(ua) ? '아이폰/아이패드는 전체화면 기능이 막혀 있어요. 공유 버튼 → "홈 화면에 추가"로 앱처럼 열면 주소창이 사라져요.' : '이 브라우저에서는 전체화면을 쓸 수 없어요. 크롬이나 삼성 인터넷으로 열어 보세요.'; tip.classList.add('on'); clearTimeout(note.t); note.t = setTimeout(() => tip.classList.remove('on'), 9000); };
    $('btnFs').onclick = async () => {
      if (isFs()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} return; }
      if (inApp || !can) { note(); return; }
      try { await (de.requestFullscreen || de.webkitRequestFullscreen).call(de); try { await screen.orientation.lock('landscape'); } catch (e) {} } catch (e) { note(); }
    };
    const sync = () => { $('btnFs').textContent = isFs() ? '⛶ 전체화면 끄기' : '⛶ 전체화면'; };
    document.addEventListener('fullscreenchange', sync); document.addEventListener('webkitfullscreenchange', sync);
    if (inApp && matchMedia('(pointer:coarse)').matches) setTimeout(() => { if (!isFs()) note(); }, 2500);
  }
  $('btnLoad')""")
open(g,'w').write(s)
