const CACHE_NAME = 'junhee-gift-v2';
const PRECACHE_URLS = ['./','./index.html','./manifest.json','./audio/bgm.mp3','./images/full/homeless-0812.jpg','./images/thumb/homeless-0812.jpg','./images/thumb/aegyo-0815.jpg','./images/video/aegyo-0815.mp4','./images/full/msg-0830.jpg','./images/full/bday-gift.jpg','./images/full/msg-0819.jpg','./images/full/deco-bear-oc.jpg','./images/full/msg-0822.jpg','./images/full/msg-0823.jpg','./images/full/msg-0820.jpg','./images/full/first-fox.jpg','./images/full/chibi-0817.jpg','./images/full/promise-0824.jpg','./images/full/msg-0907.jpg','./images/full/alba-0906.jpg','./images/full/miffy-0827.jpg','./images/full/deco-sd-sticker.jpg','./images/full/sketch-0904.jpg','./images/full/deco-junhee-oc.jpg','./images/full/video-0905.jpg','./images/full/deco-my-doodle.jpg','./images/video/fireworks-0905.mov','./images/thumb/msg-0830.jpg','./images/thumb/bday-gift.jpg','./images/thumb/msg-0819.jpg','./images/thumb/deco-bear-oc.jpg','./images/thumb/msg-0822.jpg','./images/thumb/msg-0823.jpg','./images/thumb/msg-0820.jpg','./images/thumb/first-fox.jpg','./images/thumb/chibi-0817.jpg','./images/thumb/promise-0824.jpg','./images/thumb/msg-0907.jpg','./images/thumb/alba-0906.jpg','./images/thumb/miffy-0827.jpg','./images/thumb/deco-sd-sticker.jpg','./images/thumb/sketch-0904.jpg','./images/thumb/deco-junhee-oc.jpg','./images/thumb/video-0905.jpg','./images/thumb/deco-my-doodle.jpg','./images/icons/apple-touch-icon.png','./images/icons/icon-192.png','./images/icons/icon-512.png'];

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(n){ return n !== CACHE_NAME; }).map(function(n){ return caches.delete(n); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event){
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function(cached){
      if (cached) return cached;
      return fetch(event.request).then(function(response){
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        return response;
      }).catch(function(){
        return cached;
      });
    })
  );
});
