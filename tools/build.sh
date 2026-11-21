#!/bin/sh
cd "$(dirname "$0")"
python3 - <<'PY'
t=open('src/template.html',encoding='utf8').read()
t=t.replace('/*FONT*/',open('src/fonts.css',encoding='utf8').read()).replace('/*SPR*/',open('src/sprites.js',encoding='utf8').read()).replace('/*DATA*/',open('src/data.js',encoding='utf8').read()).replace('/*BRAND*/',open('/home/claude/work/brand/bwj-brand.js',encoding='utf8').read()).replace('/*GAME*/',open('src/game.js',encoding='utf8').read())
open('dist/index.html','w',encoding='utf8').write(t)
PY
echo built $(wc -c < dist/index.html) bytes
