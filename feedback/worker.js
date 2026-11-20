// Cloudflare Worker + Durable Object: 배우자교실 통합 의견함
// 모든 게임이 같은 주소로 의견을 보내고, 선생님은 /admin 에서 답장해요.
import { handle } from './core.js';
import { ADMIN_HTML } from './admin.js';
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/admin') return new Response(ADMIN_HTML, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
    if (url.pathname === '/') return new Response('bwj feedback ok', { status: 200 });
    const stub = env.BOARD.get(env.BOARD.idFromName('main'));
    return stub.fetch(req);
  }
};
export class Board {
  constructor(ctx, env) {
    this.env = env; const st = ctx.storage;
    this.store = { get: (k) => st.get(k), put: (k, v) => st.put(k, v), del: (k) => st.delete(k), list: async (p) => [...(await st.list({ prefix: p })).entries()] };
  }
  async fetch(req) { return handle(req, this.store, this.env, req.headers.get('cf-connecting-ip') || ''); }
}
