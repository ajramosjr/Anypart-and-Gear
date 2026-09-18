const CACHE="apg-shell-v2";
const OFFLINE="/offline.html";
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([OFFLINE,"/manifest.webmanifest","/icons/apg-192.png","/icons/apg-512.png"])));self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener("fetch",event=>{if(event.request.mode!=="navigate")return;event.respondWith(fetch(event.request).catch(()=>caches.match(OFFLINE)));});
self.addEventListener("push",event=>{
  const data=event.data?event.data.json():{};
  event.waitUntil(self.registration.showNotification(data.title||"APG Message",{
    body:data.body||"You have a new private marketplace message.",
    icon:"/icons/apg-192.png",
    badge:"/icons/apg-192.png",
    tag:data.tag||"apg-message",
    renotify:true,
    data:{url:data.url||"/messages"}
  }));
});
self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const url=new URL(event.notification.data?.url||"/messages",self.location.origin).href;
  event.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(clients=>{
    const existing=clients.find(client=>client.url.startsWith(self.location.origin));
    if(existing){existing.navigate(url);return existing.focus();}
    return self.clients.openWindow(url);
  }));
});
