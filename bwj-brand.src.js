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
    '#bwj-fb .b{font:700 15px sans-serif;border:0;border-radius:10px;padding:10px 14px;background:#3d6ef0;color:#fff;text-decoration:none;display:inline-block}#bwj-fb .b.s{background:#4b5568}#bwj-fb .b:disabled{opacity:.45}' +
    '#bwj-fb .bx{max-height:92vh;overflow-y:auto;-webkit-overflow-scrolling:touch;max-width:520px}#bwj-fb h3 small{font-size:13px;font-weight:400;color:#9aa}' +
    '#bwj-fb .tabs{display:flex;gap:6px;margin:6px 0 10px}#bwj-fb .tabs button{flex:1;font:700 14px sans-serif;border:2px solid #4b5568;border-radius:10px;padding:8px 4px;background:#262c3c;color:#cbd}#bwj-fb .tabs button.on{background:#3d6ef0;border-color:#3d6ef0;color:#fff}' +
    '#bwj-fb .lbl{font-weight:800;margin:8px 0 4px}#bwj-fb .kinds{display:flex;gap:6px;flex-wrap:wrap}#bwj-fb .kd{flex:1 1 140px;text-align:left;font:inherit;border:2px solid #4b5568;border-radius:10px;padding:8px 10px;background:#262c3c;color:#fff}#bwj-fb .kd b{display:block;font-size:15px}#bwj-fb .kd span{display:block;font-size:12px;color:#aab;margin-top:2px}#bwj-fb .kd.on{border-color:#ffd98a;background:#3a3420}' +
    '#bwj-fb textarea{width:100%;min-height:96px;border-radius:10px;border:2px solid #4b5568;background:#11151f;color:#fff;padding:8px 10px;font:15px/1.5 sans-serif;resize:vertical}#bwj-fb .sm{font-size:12.5px;color:#aab;margin-top:6px}#bwj-fb .msg{font-size:14px;margin-top:8px;font-weight:700}#bwj-fb .ok{background:#1f3a2a;border-radius:10px;padding:12px;font-size:16px;margin-top:6px}#bwj-fb .ok small{display:block;color:#bde;margin-top:4px;font-size:13px}' +
    '#bwj-fb .pc{background:#262c3c;border-radius:10px;padding:10px 12px;margin:8px 0}#bwj-fb .ph{font-size:12px;color:#aab}#bwj-fb .pt{white-space:pre-wrap;word-break:break-word;margin:4px 0;font-size:15px}#bwj-fb .pr{background:#3a3420;border-left:4px solid #ffd98a;border-radius:6px;padding:7px 10px;margin-top:6px;font-size:14.5px;white-space:pre-wrap}#bwj-fb .pw{font-size:12.5px;color:#9aa;margin-top:4px}#bwj-fb .pa{margin-top:6px}#bwj-fb .pa .b{padding:6px 10px;font-size:13px}#bwj-fb .lk.on{background:#c9a24a;color:#222}' +
    '@media (max-height:520px){#bwj-fb{padding:6px}#bwj-fb .bx{padding:10px 14px}#bwj-fb h3{margin:0 0 2px;font-size:16px}#bwj-fb .tabs{margin:4px 0 6px}#bwj-fb .tabs button{padding:5px 2px;font-size:13px}#bwj-fb .kd span{display:none}#bwj-fb .kd{padding:6px 8px}#bwj-fb .lbl{margin:4px 0 2px;font-size:14px}#bwj-fb textarea{min-height:52px}#bwj-fb .sm{font-size:11.5px;margin-top:3px}#bwj-fb .row{margin-top:6px}#bwj-fb .b{padding:7px 12px}}' +
    '#bwj-badge button{position:relative}.bwjdot{position:absolute;top:-7px;right:-5px;min-width:19px;height:19px;border-radius:99px;background:#e5362a;color:#fff;font:800 11px/19px sans-serif;text-align:center;padding:0 4px;box-shadow:0 0 0 2px #fff}#bwj-fb .bwjdot2{color:#ffd98a}';
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
    setTimeout(function () { checkReplies(); setInterval(checkReplies, 300000); }, 3500);
    b.querySelector('button').addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  }
  // ===== 통합 의견함: 게임 안에서 바로 쓰고, 선생님 답장도 여기서 받아요 =====
  var API = 'https://bwj-feedback.kimsky4409.workers.dev';
  var KN = { bug: '🐞 버그 신고', fix: '🔧 오류 수정', idea: '✨ 콘텐츠 요청' };
  var KH = { bug: '멈추거나, 숫자가 이상하거나, 눌러도 안 될 때', fix: '글자·내용·그림이 틀렸거나 어색할 때', idea: '이런 게 있으면 좋겠다 싶을 때' };
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function did() { var d = ls('bwj-did'); if (!d || !/^[a-z0-9]{8,40}$/.test(d)) { var a = new Uint8Array(12); try { crypto.getRandomValues(a); } catch (e) { for (var i = 0; i < 12; i++) a[i] = Math.floor(Math.random() * 256); } d = ''; for (var k = 0; k < 12; k++) d += ('0' + a[k].toString(16)).slice(-2); ls('bwj-did', d); } return d; }
  function api(path, body) {
    var ac = typeof AbortController !== 'undefined' ? new AbortController() : null, t = ac && setTimeout(function () { ac.abort(); }, 9000);
    var o = body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {}; if (ac) o.signal = ac.signal;
    return fetch(API + path, o).then(function (r) { clearTimeout(t); return r.json().then(function (j) { if (!r.ok) throw j; return j; }); });
  }
  function ago(t) { var m = Math.floor((Date.now() - t) / 60000); return m < 1 ? '방금' : m < 60 ? m + '분 전' : m < 1440 ? Math.floor(m / 60) + '시간 전' : Math.floor(m / 1440) + '일 전'; }
  function unseen(posts) { var seen = +ls('bwj-seen') || 0, n = 0; for (var i = 0; i < posts.length; i++) if (posts[i].repAt > seen) n++; return n; }
  function setDot(n) { var b = document.querySelector('#bwj-badge button'); if (!b) return; var d = b.querySelector('.bwjdot'); if (n > 0) { if (!d) { d = el('span', { class: 'bwjdot' }); b.appendChild(d); } d.textContent = n > 9 ? '9+' : n; } else if (d) d.remove(); }
  function checkReplies() { if (!ls('bwj-posted')) return; api('/api/mine?did=' + did()).then(function (j) { setDot(unseen(j.posts)); }, function () {}); }
  function openFb(game, ver) {
    if (document.getElementById('bwj-fb')) return;
    var info = game + (ver ? ' ' + ver : '') + ' / ' + today(), tab = 'w', timer = 0, kind = '';
    var m = el('div', { id: 'bwj-fb' }, '<div class="bx"><h3>💬 의견 보내기 <small>' + game + '</small></h3>' +
      '<div class="tabs"><button type="button" data-t="w" class="on">✏️ 쓰기</button><button type="button" data-t="m">📬 내 의견<span class="bwjdot2"></span></button><button type="button" data-t="p">👥 친구들 의견</button></div>' +
      '<div id="bwjBody"></div><div class="row"><button class="b s" id="bwjX">닫기</button></div></div>');
    document.body.appendChild(m);
    var body = m.querySelector('#bwjBody');
    m.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    function close() { clearInterval(timer); m.remove(); }
    m.querySelector('#bwjX').onclick = close;
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    function tabs() { m.querySelectorAll('.tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-t') === tab); }); }
    function msg(t, bad) { var x = body.querySelector('.msg'); if (x) { x.textContent = t; x.style.color = bad ? '#ffb3a8' : '#9fb'; } }
    function fallback() { return '<div class="msg" style="color:#ffd98a">지금은 서버에 연결할 수 없어요. 아래 구글폼으로 보내 주세요.</div><div class="row"><a class="b" target="_blank" rel="noopener noreferrer" href="' + FORM + '">구글폼으로 보내기 ↗</a><button type="button" class="b s" id="bwjCopy">📋 게임 정보 복사</button></div>'; }
    function wireCopy() { var c = body.querySelector('#bwjCopy'); if (c) c.onclick = function () { var bt = this; try { navigator.clipboard.writeText(info).then(function () { bt.textContent = '복사했어요! 폼에 붙여 넣으세요'; }, function () { bt.textContent = info; }); } catch (e) { bt.textContent = info; } }; }
    function viewW() {
      body.innerHTML = '<div class="lbl">어떤 내용인가요?</div><div class="kinds">' + Object.keys(KN).map(function (k) { return '<button type="button" data-k="' + k + '" class="kd' + (k === kind ? ' on' : '') + '"><b>' + KN[k] + '</b><span>' + KH[k] + '</span></button>'; }).join('') + '</div>' +
        '<div class="lbl">무슨 일인가요?</div><textarea id="bwjTx" maxlength="500" placeholder="어디에서 무엇을 하다가 어떻게 됐는지 알려 주세요. 원하는 내용이면 그대로 적어 주세요."></textarea>' +
        '<div class="sm"><span id="bwjN">0/500</span> · ⚠ 이름·학교·전화번호·주소는 쓰지 마세요 (자동으로 막혀요). 보호자나 선생님과 함께 보내 주세요.</div>' +
        '<div class="row"><button type="button" class="b" id="bwjSend" disabled>보내기</button></div><div class="msg"></div>';
      var tx = body.querySelector('#bwjTx'), sd = body.querySelector('#bwjSend');
      function chk() { body.querySelector('#bwjN').textContent = tx.value.length + '/500'; sd.disabled = !(kind && tx.value.trim().length >= 5); }
      body.querySelectorAll('.kd').forEach(function (b) { b.onclick = function () { kind = b.getAttribute('data-k'); body.querySelectorAll('.kd').forEach(function (x) { x.classList.toggle('on', x === b); }); chk(); }; });
      tx.oninput = chk;
      sd.onclick = function () {
        sd.disabled = true; msg('보내는 중…');
        api('/api/post', { game: game, ver: ver || '', kind: kind, text: tx.value, did: did() }).then(function (j) {
          ls('bwj-posted', '1'); kind = ''; body.innerHTML = '<div class="ok">✅ 보냈어요! 고마워요 😊<br><small>선생님이 읽고 답장할 수 있어요. 답장이 오면 이 버튼에 빨간 점이 떠요. 오늘 ' + j.left + '번 더 보낼 수 있어요.</small></div><div class="row"><button type="button" class="b s" id="bwjMore">또 쓰기</button><button type="button" class="b s" id="bwjGoM">📬 내 의견 보기</button></div>';
          body.querySelector('#bwjMore').onclick = function () { tab = 'w'; render(); }; body.querySelector('#bwjGoM').onclick = function () { tab = 'm'; render(); };
        }, function (e) {
          sd.disabled = false;
          if (e && e.err === 'pii') msg('전화번호·메일·인터넷 주소처럼 보이는 글자가 있어요. 지우고 다시 보내 주세요.', 1);
          else if (e && e.err === 'limit') msg('오늘은 많이 보냈어요. 내일 또 보내 주세요 😊', 1);
          else if (e && e.err === 'short') msg('조금만 더 자세히 써 주세요.', 1);
          else { body.innerHTML = fallback(); wireCopy(); }
        });
      };
    }
    function card(p, mine) {
      var c = el('div', { class: 'pc' }); var h = el('div', { class: 'ph' }); h.textContent = (KN[p.kind] || '') + ' · ' + ago(p.ts) + (mine ? (p.pub ? ' · 공개 중' : '') : ''); c.appendChild(h);
      var t = el('div', { class: 'pt' }); t.textContent = p.text; c.appendChild(t);
      if (p.rep) { var r = el('div', { class: 'pr' }); var rh = el('b'); rh.textContent = '👩‍🏫 선생님 답장 '; r.appendChild(rh); r.appendChild(document.createTextNode(p.rep)); c.appendChild(r); } else if (mine) { var w = el('div', { class: 'pw' }); w.textContent = '선생님이 읽고 있어요… (답장이 없을 수도 있어요)'; c.appendChild(w); }
      return c;
    }
    function viewM() {
      api('/api/mine?did=' + did()).then(function (j) {
        if (tab !== 'm') return; body.innerHTML = '';
        if (!j.posts.length) { body.innerHTML = '<div class="sm">아직 보낸 의견이 없어요. 「쓰기」에서 첫 의견을 보내 보세요!</div>'; return; }
        j.posts.forEach(function (p) { body.appendChild(card(p, true)); }); var mx = 0; j.posts.forEach(function (p) { if (p.repAt > mx) mx = p.repAt; }); ls('bwj-seen', String(mx || Date.now())); setDot(0);
        var d = m.querySelector('.bwjdot2'); if (d) d.textContent = '';
      }, function () { body.innerHTML = fallback(); wireCopy(); });
    }
    function viewP() {
      api('/api/public?game=' + encodeURIComponent(game) + '&did=' + did()).then(function (j) {
        if (tab !== 'p') return; body.innerHTML = '';
        if (!j.posts.length) { body.innerHTML = '<div class="sm">아직 공개된 의견이 없어요. 선생님이 고른 의견과 답장이 여기에 올라와요.</div>'; return; }
        j.posts.forEach(function (p) {
          var c = card(p, false), r = el('div', { class: 'row pa' });
          var lk = el('button', { type: 'button', class: 'b s lk' }); lk.textContent = (p.liked ? '👍 ' : '👍 ') + p.likes; if (p.liked) lk.classList.add('on');
          lk.onclick = function () { api('/api/like', { id: p.id, did: did() }).then(function (x) { lk.textContent = '👍 ' + x.likes; lk.classList.toggle('on', x.liked); }, function () {}); };
          var rp = el('button', { type: 'button', class: 'b s rp' }); rp.textContent = '🚩 신고'; rp.onclick = function () { api('/api/report', { id: p.id, did: did() }).then(function () { rp.textContent = '신고했어요'; rp.disabled = true; }, function () {}); };
          r.appendChild(lk); r.appendChild(rp); c.appendChild(r); body.appendChild(c);
        });
      }, function () { body.innerHTML = fallback(); wireCopy(); });
    }
    function render() { tabs(); clearInterval(timer); if (tab === 'w') viewW(); else if (tab === 'm') { body.innerHTML = '<div class="sm">불러오는 중…</div>'; viewM(); timer = setInterval(viewM, 30000); } else { body.innerHTML = '<div class="sm">불러오는 중…</div>'; viewP(); timer = setInterval(viewP, 30000); } }
    m.querySelectorAll('.tabs button').forEach(function (b) { b.onclick = function () { tab = b.getAttribute('data-t'); render(); }; });
    if (ls('bwj-posted')) api('/api/mine?did=' + did()).then(function (j) { var n = unseen(j.posts), d = m.querySelector('.bwjdot2'); if (d && n > 0) d.textContent = ' ' + n; }, function () {});
    render();
  }
  window.BWJ = { init: init };
})();
