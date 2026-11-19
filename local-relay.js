// 로컬 테스트용 릴레이 (Node 내장 모듈만 사용, worker.js와 같은 프로토콜)
// 실행: node local-relay.js [포트]   → 게임의 릴레이 주소에 ws://localhost:8787/ws
const http = require('http'), crypto = require('crypto');
const PORT = +process.argv[2] || 8787;
const rooms = new Map(); // code -> {socks:Map, host, seq}
function frame(str) { const b = Buffer.from(str); const n = b.length; let h;
  if (n < 126) h = Buffer.from([0x81, n]); else if (n < 65536) { h = Buffer.alloc(4); h[0] = 0x81; h[1] = 126; h.writeUInt16BE(n, 2); } else { h = Buffer.alloc(10); h[0] = 0x81; h[1] = 127; h.writeBigUInt64BE(BigInt(n), 2); }
  return Buffer.concat([h, b]); }
const srv = http.createServer((q, s) => { s.end('relay ok'); });
srv.on('upgrade', (req, sock) => {
  const u = new URL(req.url, 'http://x'); const code = (u.searchParams.get('room') || '').toUpperCase(); const create = u.searchParams.get('create') === '1';
  const key = req.headers['sec-websocket-key'];
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64') + '\r\n\r\n');
  const send = (s, o) => { try { s.write(frame(JSON.stringify(o))); } catch {} };
  let room = rooms.get(code);
  const bad = (c) => { send(sock, { sys: 'err', code: c }); sock.end(); };
  if (create && room) return bad('exists');
  if (!create && !room) return bad('noroom');
  if (create) { room = { socks: new Map(), host: null, seq: 0 }; rooms.set(code, room); }
  if (room.socks.size >= 4) return bad('full');
  const id = 'p' + (++room.seq); if (create) room.host = id; room.socks.set(id, sock);
  send(sock, { sys: 'hello', id, host: room.host, peers: [...room.socks.keys()] });
  for (const [k, s] of room.socks) if (k !== id) send(s, { sys: 'join', id });
  let buf = Buffer.alloc(0);
  const leave = () => { if (!room.socks.delete(id)) return;
    if (id === room.host) { for (const s of room.socks.values()) { send(s, { sys: 'closed' }); s.end(); } room.socks.clear(); rooms.delete(code); }
    else for (const s of room.socks.values()) send(s, { sys: 'leave', id }); };
  sock.on('data', (d) => { buf = Buffer.concat([buf, d]);
    for (;;) { if (buf.length < 2) return; const op = buf[0] & 15; let len = buf[1] & 127, off = 2;
      if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4; } else if (len === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); off = 10; }
      const masked = buf[1] & 128; if (buf.length < off + (masked ? 4 : 0) + len) return;
      let payload = buf.slice(off + (masked ? 4 : 0), off + (masked ? 4 : 0) + len);
      if (masked) { const m = buf.slice(off, off + 4); payload = Buffer.from(payload.map((x, i) => x ^ m[i % 4])); }
      buf = buf.slice(off + (masked ? 4 : 0) + len);
      if (op === 8) { sock.end(); return; } if (op === 9) { sock.write(Buffer.from([0x8a, 0])); continue; } if (op !== 1) continue;
      let m; try { m = JSON.parse(payload.toString()); } catch { continue; }
      if (m.to === 'all') { for (const [k, s] of room.socks) if (k !== id) send(s, { from: id, d: m.d }); }
      else { const t = m.to === 'host' ? room.host : m.to; const s = room.socks.get(t); if (s && t !== id) send(s, { from: id, d: m.d }); } } });
  sock.on('close', leave); sock.on('error', leave);
});
srv.listen(PORT, () => console.log('relay on ws://localhost:' + PORT + '/ws'));
