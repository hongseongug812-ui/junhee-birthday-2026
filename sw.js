const CACHE_NAME = 'junhee-gift-v3';
const PRECACHE_URLS = ['./','./index.html','./manifest.json','./audio/bgm.mp3','./images/full/homeless-0812.jpg','./images/thumb/homeless-0812.jpg','./images/thumb/aegyo-0815.jpg','./images/video/aegyo-0815.mp4','./images/full/youtube-0828.jpg','./images/thumb/youtube-0828.jpg','./images/full/sick-0829.jpg','./images/thumb/sick-0829.jpg','./images/full/mom-0825.jpg','./images/thumb/mom-0825.jpg','./images/full/semester-0901.jpg','./images/thumb/semester-0901.jpg','./images/full/gymclothes-0826.jpg','./images/thumb/gymclothes-0826.jpg','./images/full/ittakestwo-0821.jpg','./images/thumb/ittakestwo-0821.jpg','./images/full/why-care-0818.jpg','./images/thumb/why-care-0818.jpg','./images/full/crying-0903.jpg','./images/thumb/crying-0903.jpg','./images/full/money-0816.jpg','./images/thumb/money-0816.jpg','./images/full/tough-0904.jpg','./images/thumb/tough-0904.jpg','./images/full/pizza-0908.jpg','./images/thumb/pizza-0908.jpg','./images/full/tired-0909.jpg','./images/thumb/tired-0909.jpg','./images/full/msg-0830.jpg','./images/full/bday-gift.jpg','./images/full/msg-0819.jpg','./images/full/deco-bear-oc.jpg','./images/full/msg-0822.jpg','./images/full/msg-0823.jpg','./images/full/msg-0820.jpg','./images/full/first-fox.jpg','./images/full/chibi-0817.jpg','./images/full/promise-0824.jpg','./images/full/msg-0907.jpg','./images/full/alba-0906.jpg','./images/full/miffy-0827.jpg','./images/full/deco-sd-sticker.jpg','./images/full/sketch-0904.jpg','./images/full/deco-junhee-oc.jpg','./images/full/video-0905.jpg','./images/full/deco-my-doodle.jpg','./images/video/fireworks-0905.mov','./images/thumb/msg-0830.jpg','./images/thumb/bday-gift.jpg','./images/thumb/msg-0819.jpg','./images/thumb/deco-bear-oc.jpg','./images/thumb/msg-0822.jpg','./images/thumb/msg-0823.jpg','./images/thumb/msg-0820.jpg','./images/thumb/first-fox.jpg','./images/thumb/chibi-0817.jpg','./images/thumb/promise-0824.jpg','./images/thumb/msg-0907.jpg','./images/thumb/alba-0906.jpg','./images/thumb/miffy-0827.jpg','./images/thumb/deco-sd-sticker.jpg','./images/thumb/sketch-0904.jpg','./images/thumb/deco-junhee-oc.jpg','./images/thumb/video-0905.jpg','./images/thumb/deco-my-doodle.jpg','./images/icons/apple-touch-icon.png','./images/icons/icon-192.png','./images/icons/icon-512.png'];

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

  var url = new URL(event.request.url);
  var isPage = event.request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('/sw.js') ||
    url.pathname.endsWith('/manifest.json');

  if (isPage) {
    // network-first: always try to get the latest page, fall back to cache when offline
    event.respondWith(
      fetch(event.request).then(function(response){
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        return response;
      }).catch(function(){
        return caches.match(event.request);
      })
    );
    return;
  }

  // cache-first for media assets: fast + works offline, and they never change once created
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
