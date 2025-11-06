const CACHE_NAME = 'audio-guide-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './index.js',
    './index.css',
    './audio/sophia.mp3',
    './audio/golden_gate.mp3',
    './audio/maidan.mp3',
    './audio/andriyivsky.mp3'
];

self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            for (const url of urlsToCache) {
                try {
                    await cache.add(url);
                    console.log('✅ Cached:', url);
                } catch (err) {
                    console.warn('❌ Failed:', url, err);
                }
            }
        })()
    );
});


self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;

            return fetch(event.request)
                .then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200) return networkResponse;
                    const cloned = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
                    return networkResponse;
                })
                .catch(() => caches.match('./index.html'));
        })
    );
});

