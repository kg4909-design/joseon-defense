import re
def rep(s,o,n,c=1):
    assert s.count(o)==c,(o[:50],s.count(o)); return s.replace(o,n)
t=open('src/template.html').read()
css='''
/* v0.33 휴대폰/태블릿/PC 공통 보정 */
.screen:not(#sBattle),.screen:not(#sBattle) *{touch-action:pan-y}
input[type=range]{touch-action:pan-x!important}
#updModal{justify-content:flex-start!important;padding-left:36px!important}
#updModal .um{width:min(560px,62%)!important}
#updModal .us{padding-left:44px;min-height:18px}
#sRoom>.row{flex-wrap:nowrap!important;gap:20px!important}#sRoom>.row>div:first-child{flex:1 1 0;min-width:0!important}#roleRow{flex-wrap:wrap}
#hostBox{flex:0 0 470px!important;width:470px!important;max-width:none!important;min-width:0!important;margin-top:0!important}
#rsStart{position:sticky;bottom:0;z-index:5;padding:8px 0 6px;background:linear-gradient(rgba(240,232,208,0),rgba(240,232,208,.96) 30%);display:flex;flex-wrap:wrap;gap:8px;align-items:center}
#rsStart button{margin:0}
'''
t=rep(t,'</style>\n',css+'</style>\n',1) if t.count('</style>\n')==1 else t
open('src/template.html','w').write(t)
t=open('src/template.html').read()
btns='<button id="btnStart">게임 시작</button> <button id="btnStartE" class="sec">♾ 무한 모드로 시작</button> <button id="btnCoop" class="sec">🤝 협동전으로 시작</button>\n      '
t=rep(t,btns,'',1)
t=rep(t,'  <div style="margin:18px 0 10px"><button id="btnLeave" class="sec">나가기</button></div>\n</div>',
 '  <div style="margin:10px 0 4px"><button id="btnLeave" class="sec">나가기</button></div>\n  <div id="rsStart"><button id="btnStart">게임 시작</button><button id="btnStartE" class="sec">♾ 무한 모드로 시작</button><button id="btnCoop" class="sec">🤝 협동전으로 시작</button></div>\n</div>',1)
open('src/template.html','w').write(t)
g=open('src/game.js').read()
g=rep(g,"$('hostBox').style.display = Net.host ? 'block' : 'none';","$('hostBox').style.display = Net.host ? 'block' : 'none'; $('rsStart').style.display = Net.host ? 'flex' : 'none';",1)
open('src/game.js','w').write(g)
