
const CACHE = 'antenatal-v-5.1';

const URLS = [
  './',
  './index.html',
  './manifest.json',

  // Shared back button
  './APP/back.js',
  './APP/back.css',

  // Medical tools
  './APP/anc.html',
  './APP/bmi.html',
  './APP/morse.html'
];

self.addEventListener('install', function (e) {
  e.waitUntil((async function () {
    const cache = await caches.open(CACHE);

    for (const url of URLS) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }

        await cache.put(url, response);
        console.log('[PWA] Cached:', url);
      } catch (error) {
        console.error('[PWA] Failed to cache:', url, error);
        throw error;
      }
    }

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key.startsWith('antenatal-v-') &&
                   key !== CACHE;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;

      return fetch(e.request).then(function (response) {
        if (!response || !response.ok ||
            response.type !== 'basic') {
          return response;
        }

        const copy = response.clone();

        caches.open(CACHE).then(function (cache) {
          cache.put(e.request, copy);
        });

        return response;
      }).catch(function () {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html')
            .then(function (home) {
              return home || Response.error();
            });
        }

        return Response.error();
      });
    })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
