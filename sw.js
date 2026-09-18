const C='strength-guided-v9-9';
const A=[
  './','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './v9-preview/style.css?v=9.9','./v9-preview/camera.js?v=9.9','./v9-preview/app.js?v=9.9',
  './images/wall-pushup.webp','./images/pullover.webp','./images/lateral-raise.webp',
  './images/triceps-extension.webp','./images/floor-press.webp','./images/hammer-curl.webp',
  './images/one-arm-row.webp','./images/rear-delt-row.webp','./images/biceps-curl.webp',
  './images/shoulder-press.webp','./images/reverse-fly.webp','./images/chest-fly.webp'
];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(C).then(c=>c.put('./index.html',copy));return r}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));
});