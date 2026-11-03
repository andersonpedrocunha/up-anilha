const CACHE='up-anilha-v86';
const CORE=['./','index.html','guide.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','logo-mark.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||!r.url.startsWith(self.location.origin))return;
  const u=new URL(r.url);const fresh=r.mode==='navigate'||/\.(html|js|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/');
  if(fresh){e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r.mode==='navigate'?'index.html':r,c));return res}).catch(()=>caches.match(r.mode==='navigate'?'index.html':r)));return}
  e.respondWith(caches.open(CACHE).then(x=>x.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok)x.put(r,res.clone());return res}).catch(()=>hit);return hit||net})))});
