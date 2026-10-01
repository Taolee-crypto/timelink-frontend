/* TimeLink local TL3 service worker: serves files stored in IndexedDB on this browser. */
const DB='TimeLinkLocalTL3';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
function getTrack(id){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>{const db=r.result;let tx=db.transaction('tracks','readonly');let q=tx.objectStore('tracks').get(id);q.onsuccess=()=>{db.close();resolve(q.result||null)};q.onerror=()=>{db.close();reject(q.error)}};r.onerror=()=>reject(r.error)})}
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(!u.pathname.startsWith('/local-tl3/'))return;event.respondWith((async()=>{try{const id=decodeURIComponent(u.pathname.substring('/local-tl3/'.length));const t=await getTrack(id);if(!t)return new Response('Local TL3 not found',{status:404});return new Response(t.buffer,{status:200,headers:{'Content-Type':'application/octet-stream','Content-Length':String(t.buffer.byteLength),'Accept-Ranges':'bytes','X-TimeLink-Storage':'browser-local'}})}catch(e){return new Response('Local TL3 error',{status:500})}})())});
