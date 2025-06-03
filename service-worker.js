self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('word-shop-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/jshelpers/utils.js',
        '/jshelpers/gameLogic.js',
        '/jshelpers/words.txt',
        '/icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});