import json,sys,re
sys.path.insert(0,'/home/claude/joseon-defense/tools/qb')
import e0_2,e3_5,e6_9
Q=e0_2.Q+e3_5.Q+e6_9.Q
out=[]
seen=set()
for t in Q:
    e,q,a,w1,w2,why=t
    assert q not in seen,q; seen.add(q)
    assert len({a,w1,w2})==3,q
    out.append([e,q,[a,w1,w2],0,why])
js='const QB = '+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\nconst QERA = ["선사 시대","고조선과 여러 나라","삼국 시대","남북국 시대","고려 시대","조선 전기","임진왜란","정유재란","광해군·인조 시대","병자호란"];\n'
p='/home/claude/joseon-defense/src/data.js'
s=open(p,encoding='utf8').read()
s=re.sub(r'\n// ===QB START===.*?// ===QB END===\n','',s,flags=re.S)
s=s.rstrip('\n')+'\n// ===QB START===\n'+js+'// ===QB END===\n'
open(p,'w',encoding='utf8').write(s)
print(len(out))
