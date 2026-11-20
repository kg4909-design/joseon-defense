// 선생님 관리 화면 (열쇠가 있어야 글이 보여요). 열쇠는 이 주소에 저장되지 않고, 이 탭에만 잠시 기억돼요.
export const ADMIN_HTML = String.raw`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>배우자교실 의견함 (선생님용)</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;background:#f3efe4;color:#3b2a1a;font-size:16px}
header{position:sticky;top:0;z-index:5;background:#fff8e6;border-bottom:3px solid #7a4a24;padding:10px 14px}
h1{margin:0 0 8px;font-size:19px}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
input,select,textarea,button{font:inherit}
input,select,textarea{border:2px solid #7a4a24;border-radius:10px;padding:8px 10px;background:#fff;color:#3b2a1a}
button{border:2px solid #7a4a24;border-radius:10px;padding:8px 12px;background:#ffe9a0;color:#3b2a1a;font-weight:800;cursor:pointer}
button.s{background:#e8f3d6}button.d{background:#f6c9c3}button.g{background:#fff;font-weight:600}
#box{max-width:900px;margin:0 auto;padding:12px}
.card{background:#fff;border:2px solid #7a4a24;border-radius:14px;padding:12px;margin:10px 0;box-shadow:0 3px 0 #7a4a24}
.card.new{border-color:#e8832a;box-shadow:0 3px 0 #e8832a}
.tag{display:inline-block;border-radius:99px;padding:1px 9px;font-size:13px;font-weight:800;border:2px solid #7a4a24;background:#e8f3d6;margin-right:4px}
.tag.g{background:#dfe9ff}.tag.p{background:#ffe9a0}.tag.h{background:#ddd}
.txt{white-space:pre-wrap;word-break:break-word;margin:8px 0;line-height:1.5}
.meta{font-size:13px;color:#7a6652}
textarea{width:100%;min-height:64px;margin:6px 0}
#msg{margin:8px 0;font-weight:800}
</style></head><body>
<header><h1>💬 배우자교실 의견함 <small style="font-weight:400;font-size:13px">선생님 전용</small></h1>
<div class="row"><input id="key" type="password" placeholder="관리 열쇠" autocomplete="off" style="flex:1;min-width:160px"><button id="go">열기</button>
<select id="fg"><option value="">모든 게임</option></select>
<select id="fs"><option value="new">답장 안 한 글</option><option value="">전체</option><option value="done">답장·완료</option><option value="hidden">숨김</option><option value="pub">공개 중</option></select>
<button id="cp" class="g">📋 요약 복사</button></div><div id="msg"></div></header>
<div id="box"></div>
<script>
var KEY=sessionStorage.getItem('fbk')||'',POSTS=[],KN={bug:'🐞 버그 신고',fix:'🔧 오류 수정',idea:'✨ 콘텐츠 요청'};
var $=function(i){return document.getElementById(i)};
function say(t,bad){$('msg').textContent=t;$('msg').style.color=bad?'#a8322a':'#2f6b2a'}
function api(path,opt){opt=opt||{};opt.headers=Object.assign({'x-admin-key':KEY,'content-type':'application/json'},opt.headers||{});return fetch(path,opt).then(function(r){return r.json().then(function(j){if(!r.ok)throw j;return j})})}
function when(t){var d=new Date(t);return (d.getMonth()+1)+'/'+d.getDate()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function load(){if(!KEY){say('열쇠를 입력하고 「열기」를 눌러 주세요.');return}
 api('/api/admin/list').then(function(j){POSTS=j.posts;sessionStorage.setItem('fbk',KEY);fillGames();render();say('불러왔어요 · 전체 '+POSTS.length+'개 · 답장 안 한 글 '+POSTS.filter(function(p){return p.status==='new'}).length+'개')})
 .catch(function(e){sessionStorage.removeItem('fbk');say(e&&e.err==='auth'?'열쇠가 맞지 않아요.':e&&e.err==='noadmin'?'서버에 관리 열쇠가 아직 설정되지 않았어요.':'불러오지 못했어요. 잠시 뒤 다시 해 보세요.',1)})}
function fillGames(){var s=$('fg'),v=s.value,g={};POSTS.forEach(function(p){g[p.game]=1});s.innerHTML='<option value="">모든 게임</option>'+Object.keys(g).map(function(x){return '<option>'+x.replace(/[<&]/g,'')+'</option>'}).join('');s.value=v}
function shown(){var fg=$('fg').value,fs=$('fs').value;return POSTS.filter(function(p){return (!fg||p.game===fg)&&(!fs||(fs==='pub'?p.pub:p.status===fs))})}
function render(){var b=$('box');b.innerHTML='';var L=shown();if(!L.length){b.innerHTML='<div class="card">보여 줄 글이 없어요.</div>';return}
 L.forEach(function(p){var c=document.createElement('div');c.className='card '+p.status;
  var h=document.createElement('div');h.innerHTML='<span class="tag g"></span><span class="tag"></span>'+(p.pub?'<span class="tag p">공개 중</span>':'')+(p.status==='hidden'?'<span class="tag h">숨김</span>':'')+'<span class="meta"></span>';
  h.children[0].textContent=p.game+(p.ver?' '+p.ver:'');h.children[1].textContent=KN[p.kind]||p.kind;h.lastChild.textContent=' '+when(p.ts)+' · 보낸 기기 …'+p.who+' · 👍 '+p.likes+(p.rp?' · 🚩 신고 '+p.rp:'');c.appendChild(h);
  var t=document.createElement('div');t.className='txt';t.textContent=p.text;c.appendChild(t);
  var ta=document.createElement('textarea');ta.placeholder='학생에게 보낼 답장 (비워 두면 답장 없음)';ta.value=p.rep;ta.maxLength=600;c.appendChild(ta);
  var r=document.createElement('div');r.className='row';
  function btn(txt,cls,fn){var x=document.createElement('button');x.textContent=txt;x.className=cls||'';x.onclick=fn;r.appendChild(x)}
  function upd(o,ok){o.id=p.id;api('/api/admin/update',{method:'POST',body:JSON.stringify(o)}).then(function(j){if(j.deleted)POSTS=POSTS.filter(function(x){return x.id!==p.id});else Object.assign(p,j.post);render();say(ok||'저장했어요')}).catch(function(){say('저장하지 못했어요',1)})}
  btn('답장 저장 (그 학생에게만)','s',function(){upd({rep:ta.value},'답장을 저장했어요. 학생이 의견 창을 열면 보여요.')});
  btn('답장+공개','',function(){upd({rep:ta.value,pub:true},'공개했어요. 같은 게임의 모든 학생에게 보여요.')});
  if(p.pub)btn('공개 내리기','g',function(){upd({pub:false})});
  btn(p.status==='done'?'다시 열기':'완료로 표시','g',function(){upd({status:p.status==='done'?'new':'done'})});
  btn(p.status==='hidden'?'숨김 풀기':'숨기기','g',function(){upd({status:p.status==='hidden'?'new':'hidden'})});
  btn('삭제','d',function(){if(confirm('이 글을 완전히 지울까요? 되돌릴 수 없어요.'))upd({del:true},'지웠어요')});
  c.appendChild(r);b.appendChild(c)})}
$('go').onclick=function(){KEY=$('key').value.trim()||KEY;load()};$('key').onkeydown=function(e){if(e.key==='Enter')$('go').onclick()};
$('fg').onchange=$('fs').onchange=render;
$('cp').onclick=function(){var L=shown().slice(0,60).map(function(p){return '['+p.game+' '+(KN[p.kind]||'')+' '+when(p.ts)+'] '+p.text.replace(/\n/g,' ')+(p.rep?' → 답장: '+p.rep:'')}).join('\n');
 (navigator.clipboard?navigator.clipboard.writeText(L):Promise.reject()).then(function(){say('요약을 복사했어요. Claude에게 붙여 넣으면 정리해 줘요.')},function(){say('복사하지 못했어요.',1)})};
setInterval(function(){if(KEY&&document.visibilityState==='visible')load()},60000);
if(KEY){$('key').value='';load()}
</script></body></html>`;
