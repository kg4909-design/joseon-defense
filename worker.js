// Cloudflare Worker + Durable Object: 방 코드 릴레이 (게임 내용은 전혀 모르는 "전달자")
// 프로토콜: 접속 ws://.../ws?room=코드[&create=1]
//   서버→클라: {sys:'hello',id,host,peers} {sys:'join',id} {sys:'leave',id} {sys:'closed'} {sys:'err',code}
//   클라→서버: {to:'host'|'all'|id, d:...}  → 상대에게 {from:id, d:...}
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname !== '/ws') return new Response('history-defense relay ok', { status: 200 });
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('expected websocket', { status: 426 });
    const room = (url.searchParams.get('room') || '').toUpperCase().slice(0, 8);
    if (!room) return new Response('room required', { status: 400 });
    const stub = env.ROOMS.get(env.ROOMS.idFromName(room));
    return stub.fetch(req);
  }
};

export class Room {
  constructor() { this.socks = new Map(); this.hostId = null; this.seq = 0; }
  async fetch(req) {
    const url = new URL(req.url);
    const create = url.searchParams.get('create') === '1';
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();
    const reject = (code) => { server.send(JSON.stringify({ sys: 'err', code })); server.close(1000, code); };
    if (create && this.hostId) { reject('exists'); return new Response(null, { status: 101, webSocket: client }); }
    if (!create && !this.hostId) { reject('noroom'); return new Response(null, { status: 101, webSocket: client }); }
    if (this.socks.size >= 4) { reject('full'); return new Response(null, { status: 101, webSocket: client }); }
    const id = 'p' + (++this.seq);
    if (create) this.hostId = id;
    this.socks.set(id, server);
    server.send(JSON.stringify({ sys: 'hello', id, host: this.hostId, peers: [...this.socks.keys()] }));
    this.bcast({ sys: 'join', id }, id);
    server.addEventListener('message', (ev) => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      const out = JSON.stringify({ from: id, d: m.d });
      if (m.to === 'all') { for (const [k, s] of this.socks) if (k !== id) try { s.send(out); } catch {} }
      else { const t = m.to === 'host' ? this.hostId : m.to; const s = this.socks.get(t); if (s && t !== id) try { s.send(out); } catch {} }
    });
    const leave = () => {
      if (!this.socks.delete(id)) return;
      if (id === this.hostId) { this.bcast({ sys: 'closed' }); for (const s of this.socks.values()) try { s.close(1000, 'host left'); } catch {} this.socks.clear(); this.hostId = null; }
      else this.bcast({ sys: 'leave', id });
    };
    server.addEventListener('close', leave); server.addEventListener('error', leave);
    return new Response(null, { status: 101, webSocket: client });
  }
  bcast(o, except) { const s = JSON.stringify(o); for (const [k, w] of this.socks) if (k !== except) try { w.send(s); } catch {} }
}
