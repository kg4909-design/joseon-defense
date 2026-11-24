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

// 무료 한도(Durable Objects 계산 시간)를 아끼기 위한 자동 정리:
//  - IDLE_MS: 이 시간(5분) 동안 아무 메시지도 안 오가면 방을 닫음(전투 중에는 방장이 초당 15번 보내므로 해당 없음)
//  - MAX_MS : 방 하나가 최대 이 시간(30분)까지만 열려 있음(깜빡 잊고 켜 둔 방 방지)
const IDLE_MS = 5 * 60 * 1000, MAX_MS = 30 * 60 * 1000, CHECK_MS = 30 * 1000;

export class Room {
  constructor() { this.socks = new Map(); this.hostId = null; this.seq = 0; this.last = 0; this.born = 0; this.timer = null; }
  startTimer() {
    if (this.timer) return; this.last = this.born = Date.now();
    this.timer = setInterval(() => {
      const n = Date.now();
      if (!this.socks.size) return this.stopTimer();
      if (n - this.last > IDLE_MS) this.shutdown('idle'); else if (n - this.born > MAX_MS) this.shutdown('max');
    }, CHECK_MS);
  }
  stopTimer() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
  shutdown(why) {
    this.bcast({ sys: 'closed', why });
    for (const s of this.socks.values()) try { s.close(1000, why); } catch {}
    this.socks.clear(); this.hostId = null; this.stopTimer();
  }
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
    this.socks.set(id, server); this.last = Date.now(); this.startTimer();
    server.send(JSON.stringify({ sys: 'hello', id, host: this.hostId, peers: [...this.socks.keys()] }));
    this.bcast({ sys: 'join', id }, id);
    server.addEventListener('message', (ev) => {
      this.last = Date.now();
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      const out = JSON.stringify({ from: id, d: m.d });
      if (m.to === 'all') { for (const [k, s] of this.socks) if (k !== id) try { s.send(out); } catch {} }
      else { const t = m.to === 'host' ? this.hostId : m.to; const s = this.socks.get(t); if (s && t !== id) try { s.send(out); } catch {} }
    });
    const leave = () => {
      if (!this.socks.delete(id)) return;
      if (id === this.hostId) { this.bcast({ sys: 'closed' }); for (const s of this.socks.values()) try { s.close(1000, 'host left'); } catch {} this.socks.clear(); this.hostId = null; this.stopTimer(); }
      else this.bcast({ sys: 'leave', id });
      if (!this.socks.size) this.stopTimer();
    };
    server.addEventListener('close', leave); server.addEventListener('error', leave);
    return new Response(null, { status: 101, webSocket: client });
  }
  bcast(o, except) { const s = JSON.stringify(o); for (const [k, w] of this.socks) if (k !== except) try { w.send(s); } catch {} }
}
