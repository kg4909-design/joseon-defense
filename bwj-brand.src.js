/* ===== 배우자교실 공통 브랜드 모듈 (모든 게임에 같은 파일을 넣어 쓰세요) =====
   1) 인트로: 배우자교실 로고가 나타났다 사라짐 (터치하면 바로 넘김)
   2) 로고 배지: 누르면 인스타그램, 옆에 「💬 오류 신고·건의」(구글폼 안내창)
   사용: BWJ.init({ game:'게임 이름', ver:'v0.1', parent:'#stage' })   ← parent는 생략하면 화면 오른쪽 아래에 고정
   이름·연락처는 받지 않습니다. 로고 그림은 이 파일 안에 포함되어 있어 별도 이미지 파일이 필요 없습니다. */
(function () {
  var LOGO = 'data:image/jpeg;base64,__LOGO__';
  var INSTA = 'https://www.instagram.com/bwj_class/';
  var FORM = 'https://forms.gle/TqxtkR5Pwae6mLfL6';
  var css = '' +
    '#bwj-intro{position:fixed;inset:0;z-index:99999;background:#0b0d12;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .7s ease;cursor:pointer}' +
    '#bwj-intro.in{opacity:1}#bwj-intro.out{opacity:0}' +
    '#bwj-intro .bx{background:#fff;border-radius:18px;padding:18px 28px;box-shadow:0 0 60px rgba(255,255,255,.18);transform:scale(.92);transition:transform 1.6s ease}' +
    '#bwj-intro.in .bx{transform:scale(1)}#bwj-intro img{display:block;height:min(26vh,150px);width:auto}' +
    '#bwj-intro p{position:absolute;bottom:9%;margin:0;color:#aab;font:14px sans-serif;letter-spacing:1px}' +
    '#bwj-badge{z-index:900;display:flex;align-items:center;gap:6px;font-family:inherit;pointer-events:auto}' +
    '#bwj-badge.fx{position:fixed;right:max(8px,env(safe-area-inset-right,0px));bottom:8px}#bwj-badge.ab{position:absolute;right:8px;top:52px}' +
    '#bwj-badge a.lg{display:block;background:#fff;border-radius:7px;padding:2px 5px;line-height:0;box-shadow:0 2px 8px rgba(0,0,0,.45)}#bwj-badge img{height:24px;width:auto;display:block}' +
    '#bwj-badge button{font:700 12px/1 inherit;font-family:inherit;border:0;border-radius:99px;padding:7px 10px;background:rgba(20,22,30,.82);color:#ffd98a;border:1px solid #c9a24a}' +
    '#bwj-fb{position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:14px}' +
    '#bwj-fb .bx{max-width:460px;width:100%;background:#1d2230;color:#fff;border-radius:16px;padding:18px 20px;font:15px/1.55 sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.6)}' +
    '#bwj-fb h3{margin:0 0 8px;font-size:19px}#bwj-fb ul{margin:6px 0 10px;padding-left:20px}#bwj-fb .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}' +
    '#bwj-fb .b{font:700 15px sans-serif;border:0;border-radius:10px;padding:10px 14px;background:#3d6ef0;color:#fff;text-decoration:none;display:inline-block}#bwj-fb .b.s{background:#4b5568}';
  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function init(o) {
    o = o || {}; var game = o.game || '게임', ver = o.ver || '';
    var st = el('style'); st.textContent = css; document.head.appendChild(st);
    // --- 인트로
    var ov = el('div', { id: 'bwj-intro' }, '<div class="bx"><img alt="배우자교실" src="' + LOGO + '"></div><p>만든이 · 배우자교실</p>');
    document.body.appendChild(ov);
    var done = false;
    function end() { if (done) return; done = true; ov.classList.remove('in'); ov.classList.add('out'); setTimeout(function () { ov.remove(); try { document.dispatchEvent(new Event('bwj-intro-done')); } catch (e) {} }, 750); }
    requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add('in'); }); });
    setTimeout(end, o.introMs || 2600); ov.addEventListener('pointerdown', end);
    // --- 배지
    var par = o.parent ? document.querySelector(o.parent) : null;
    var b = el('div', { id: 'bwj-badge', class: par ? 'ab' : 'fx' },
      '<a class="lg" href="' + INSTA + '" target="_blank" rel="noopener noreferrer" title="만든 사람: 배우자교실 인스타그램"><img alt="배우자교실" src="' + LOGO + '"></a><button type="button">💬 오류 신고·건의</button>');
    (par || document.body).appendChild(b);
    b.querySelector('button').addEventListener('click', function () { openFb(game, ver); });
    b.querySelector('button').addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  }
  function openFb(game, ver) {
    if (document.getElementById('bwj-fb')) return;
    var key = 'bwj-fb-day:' + game, sent = false; try { sent = localStorage.getItem(key) === today(); } catch (e) {}
    var info = game + (ver ? ' ' + ver : '') + ' / ' + today();
    var m = el('div', { id: 'bwj-fb' }, '<div class="bx"><h3>💬 오류 신고·건의</h3>' +
      '<div style="background:#fff3c4;color:#4a3410;border-radius:10px;padding:8px 10px;margin-bottom:8px;font-size:14px">📌 폼의 첫 질문 <b>“어떤 게임인가요?”</b>에 <b>' + game + '</b> 라고 적어 주세요!</div>' +
      '<ul><li><b>버그 신고</b>: 어디서 무엇을 하다가 어떻게 됐는지 적어 주세요.</li><li><b>건의</b>: 바라는 점이나 아이디어를 적어 주세요.</li></ul>' +
      '<div style="font-size:13px;color:#cbd">⚠ 이름·학교·연락처 같은 <b>개인정보는 쓰지 마세요</b>. 보호자나 선생님과 함께 보내 주세요. 답장은 못 드리지만 모아서 고칠게요.</div>' +
      '<div style="font-size:13px;margin-top:8px;color:#9fb">' + (sent ? '오늘은 이미 보냈어요. 내일 또 보내 주세요 😊' : '하루에 한 번만 보내 주세요.') + '</div>' +
      '<div class="row"><button class="b s" id="bwjCopy">📋 게임 정보 복사</button>' + (sent ? '' : '<a class="b" id="bwjGo" href="' + FORM + '" target="_blank" rel="noopener noreferrer">의견 보내러 가기 ↗</a>') + '<button class="b s" id="bwjX">닫기</button></div></div>');
    document.body.appendChild(m);
    m.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    m.querySelector('#bwjX').onclick = function () { m.remove(); };
    m.querySelector('#bwjCopy').onclick = function () { var t = info, bt = this; try { navigator.clipboard.writeText(t).then(function () { bt.textContent = '복사했어요! 폼에 붙여 넣으세요'; }, function () { bt.textContent = t; }); } catch (e) { bt.textContent = t; } };
    var go = m.querySelector('#bwjGo'); if (go) go.onclick = function () { try { localStorage.setItem(key, today()); } catch (e) {} setTimeout(function () { m.remove(); }, 300); };
  }
  window.BWJ = { init: init };
})();
