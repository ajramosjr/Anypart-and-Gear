const CACHE="apg-shell-v1";
const OFFLINE="/offline.html";
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([OFFLINE,"/manifest.webmanifest","/icons/apg-192.png","/icons/apg-512.png"])));self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener("fetch",event=>{if(event.request.mode!=="navigate")return;event.respondWith(fetch(event.request).catch(()=>caches.match(OFFLINE)));});
