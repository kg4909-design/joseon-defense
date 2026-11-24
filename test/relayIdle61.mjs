// worker.js의 Room을 가짜 WebSocket으로 돌려 보는 단위 시험 (방치 정리·최대 수명·정상 사용 유지)
import fs from 'fs';
const src = fs.readFileSync(new URL('../worker.js', import.meta.url), 'utf8').replace('export default', 'const _d =').replace('export class Room', 'class Room') + '\nglobalThis.Room = Room;';
let now = 1e6; const realNow = Date.now; Date.now = () => now;
const timers = new Set(); globalThis.setInterval = (f, ms) => { const t = { f, ms }; timers.add(t); return t; }; globalThis.clearInterval = (t) => timers.delete(t);
const tick = (ms) => { for (let i = 0; i < ms / 30000; i++) { now += 30000; for (const t of [...timers]) t.f(); } };
class Sock { constructor() { this.l = {}; this.out = []; this.closed = false; } accept() {} send(x) { this.out.push(JSON.parse(x)); } close() { this.closed = true; } addEventListener(e, f) { this.l[e] = f; } }
globalThis.WebSocketPair = function () { const a = {}, b = new Sock(); a.s = b; return { 0: a, 1: b }; };
globalThis.Response = class { constructor(b, o) { Object.assign(this, o); } };
(0, eval)(src);
const room = new Room(); const conn = (create) => room.fetch({ url: 'http://x/ws?room=AB' + (create ? '&create=1' : '') }).then((r) => r.webSocket);
let ok = true; const chk = (n, c) => { console.log(c ? 'OK  ' : 'FAIL', n); if (!c) ok = false; };
const host = await conn(true), c1 = await conn(false); // client 쪽 소켓은 {s:서버소켓}; 서버 소켓에서 메시지 흉내
const hs = host; // Response.webSocket = client(=a). 서버 소켓은 room.socks에 있음
const [hSock, cSock] = [...room.socks.values()];
// 1) 전투처럼 메시지가 계속 오가면 10분이 지나도 유지
for (let i = 0; i < 30; i++) { hSock.l.message({ data: JSON.stringify({ to: 'all', d: { s: 1 } }) }); tick(60000); }
chk('30분 동안 메시지가 오가면 방 유지', room.socks.size === 2 && !hSock.closed);
chk('친구에게 메시지 전달', cSock.out.some((m) => m.d && m.d.s === 1));
// 2) 10분 넘게 조용하면 닫힘
tick(11 * 60000);
chk('10분 넘게 조용하면 방 닫힘', room.socks.size === 0 && hSock.closed && cSock.closed);
chk('닫힘 알림(sys:closed, why:idle) 전달', cSock.out.some((m) => m.sys === 'closed' && m.why === 'idle'));
chk('닫힌 뒤 타이머 정리', timers.size === 0);
// 3) 같은 코드로 새 방 만들기 가능
const h2 = await conn(true); chk('닫힌 뒤 같은 코드로 새로 만들기', room.hostId === 'p3');
// 4) 최대 3시간
const [s2] = [...room.socks.values()];
for (let i = 0; i < 200; i++) { s2.l.message({ data: JSON.stringify({ to: 'all', d: { s: 1 } }) }); tick(60000); }
chk('3시간 넘으면 계속 활발해도 닫힘', room.socks.size === 0 && s2.closed);
// 5) 방장이 나가면 타이머도 정리
const h3 = await conn(true); const [s3] = [...room.socks.values()]; s3.l.close(); chk('방장 퇴장 시 타이머 정리', timers.size === 0 && !room.hostId);
Date.now = realNow; console.log(ok ? 'ALL OK' : 'SOME FAIL'); process.exit(ok ? 0 : 1);
