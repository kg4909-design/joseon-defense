// 배우자교실 통합 의견함 — 순수 로직 (저장소는 get/put/del/list 4개 함수만 있으면 돼요)
// 개인정보는 받지 않아요: 이름·연락처 없음, 기기마다 임의 번호(did)만 써서 "내 의견"을 보여 줘요.
export const KINDS = ['bug', 'fix', 'idea'];
const J = (o, s = 200) => new Response(s === 204 ? null : JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type,x-admin-key', 'access-control-allow-methods': 'GET,POST,OPTIONS', 'cache-control': 'no-store' } });
const PII = [/\d{2,3}[-\s.]?\d{3,4}[-\s.]?\d{4}/, /[\w.+-]+@[\w-]+\.[\w.]+/, /https?:\/\/|www\./i, /\b\d{6}[-\s]?[1-4]\d{6}\b/];
export const hasPII = (t) => PII.some((r) => r.test(t));
const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); // 한국 날짜
async function sha(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].slice(0, 8).map((x) => x.toString(16).padStart(2, '0')).join(''); }
function same(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
const cut = (s, n) => String(s == null ? '' : s).trim().slice(0, n);
const pubView = (p, did) => ({ id: p.id, game: p.game, kind: p.kind, text: p.text, ts: p.ts, rep: p.rep || '', repAt: p.repAt || 0, likes: p.lk.length, liked: !!did && p.lk.includes(did) });
const mineView = (p) => ({ id: p.id, game: p.game, kind: p.kind, text: p.text, ts: p.ts, status: p.status, pub: p.pub, rep: p.rep || '', repAt: p.repAt || 0 });
const adminView = (p) => ({ id: p.id, game: p.game, ver: p.ver, kind: p.kind, text: p.text, ts: p.ts, status: p.status, pub: p.pub, rep: p.rep || '', repAt: p.repAt || 0, likes: p.lk.length, rp: p.rp || 0, who: p.did.slice(-4) });
const LIM = { did: 5, ip: 40 };
export async function handle(req, store, env, ip) {
  const url = new URL(req.url), path = url.pathname, m = req.method;
  if (m === 'OPTIONS') return J({}, 204);
  if (!path.startsWith('/api/')) return J({ err: 'nf' }, 404);
  const body = async () => { try { return await req.json(); } catch (e) { return {}; } };
  const getP = async (id) => (/^[a-z0-9]{6,30}$/.test(id || '') ? store.get('p:' + id) : null);
  const allP = async () => (await store.list('p:')).map((x) => x[1]);
  const didOk = (d) => typeof d === 'string' && /^[a-z0-9]{8,40}$/.test(d);

  if (path === '/api/post' && m === 'POST') {
    const b = await body(), text = cut(b.text, 500), game = cut(b.game, 30), did = b.did;
    if (!didOk(did) || !game || !KINDS.includes(b.kind)) return J({ err: 'bad' }, 400);
    if (text.length < 5) return J({ err: 'short' }, 400);
    if (hasPII(text)) return J({ err: 'pii' }, 400);
    const day = today(), kd = 'r:' + day + ':d:' + did, ih = await sha((ip || '?') + '|bwj'), ki = 'r:' + day + ':i:' + ih;
    const nd = (await store.get(kd)) || 0, ni = (await store.get(ki)) || 0;
    if (nd >= LIM.did || ni >= LIM.ip) return J({ err: 'limit' }, 429);
    await store.put(kd, nd + 1); await store.put(ki, ni + 1);
    if (Math.random() < 0.05) for (const [k] of await store.list('r:')) if (k.split(':')[1] < day) await store.del(k);
    const ts = Date.now(), id = ts.toString(36) + Math.random().toString(36).slice(2, 6);
    await store.put('p:' + id, { id, game, ver: cut(b.ver, 20), kind: b.kind, text, did, ts, status: 'new', pub: false, rep: '', repAt: 0, lk: [], rp: 0 });
    return J({ ok: true, id, left: LIM.did - nd - 1 });
  }
  if (path === '/api/mine' && m === 'GET') {
    const did = url.searchParams.get('did'); if (!didOk(did)) return J({ err: 'bad' }, 400);
    const L = (await allP()).filter((p) => p.did === did).sort((a, b) => b.ts - a.ts).slice(0, 30).map(mineView);
    return J({ posts: L });
  }
  if (path === '/api/public' && m === 'GET') {
    const game = url.searchParams.get('game') || '', did = url.searchParams.get('did') || '';
    const L = (await allP()).filter((p) => p.pub && p.status !== 'hidden' && (!game || p.game === game)).sort((a, b) => (b.repAt || b.ts) - (a.repAt || a.ts)).slice(0, 50).map((p) => pubView(p, did));
    return J({ posts: L });
  }
  if ((path === '/api/like' || path === '/api/report') && m === 'POST') {
    const b = await body(), p = await getP(b.id); if (!p || !p.pub || !didOk(b.did)) return J({ err: 'bad' }, 400);
    if (path === '/api/like') { const i = p.lk.indexOf(b.did); if (i >= 0) p.lk.splice(i, 1); else if (p.lk.length < 500) p.lk.push(b.did); }
    else { p.rp = (p.rp || 0) + 1; if (p.rp >= 3) p.pub = false; } // 신고 3번이면 공개에서 자동으로 내려요
    await store.put('p:' + p.id, p); return J({ ok: true, likes: p.lk.length, liked: p.lk.includes(b.did) });
  }
  if (path.startsWith('/api/admin/')) {
    if (!env.ADMIN_KEY) return J({ err: 'noadmin' }, 503);
    if (!same(req.headers.get('x-admin-key') || '', env.ADMIN_KEY)) return J({ err: 'auth' }, 401);
    if (path === '/api/admin/list' && m === 'GET') {
      const L = (await allP()).sort((a, b) => b.ts - a.ts).map(adminView);
      return J({ posts: L, day: today() });
    }
    if (path === '/api/admin/update' && m === 'POST') {
      const b = await body(), p = await getP(b.id); if (!p) return J({ err: 'nf' }, 404);
      if (b.del === true) { await store.del('p:' + p.id); return J({ ok: true, deleted: true }); }
      if (typeof b.rep === 'string') { const r = cut(b.rep, 600); if (r !== p.rep) { p.rep = r; p.repAt = r ? Date.now() : 0; } if (r && p.status === 'new') p.status = 'done'; }
      if (['new', 'done', 'hidden'].includes(b.status)) p.status = b.status;
      if (typeof b.pub === 'boolean') p.pub = b.pub && p.status !== 'hidden';
      if (p.status === 'hidden') p.pub = false;
      await store.put('p:' + p.id, p); return J({ ok: true, post: adminView(p) });
    }
  }
  return J({ err: 'nf' }, 404);
}
