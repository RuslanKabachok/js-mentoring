const CACHE_NAME = 'dynamic-cache-v1';

let cacheResponse = 0;
let fetchResponse = 0;
let totalResponse = 0;

self.addEventListener('install', (event) => {
    console.log('Service Worker: встановлено');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(names => {
            return Promise.all(
                names.map(name => {
                    if (!cacheWhitelist.includes(name)) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

async function handleStaleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await caches.match(request);
    console.log('🟢 Перехоплено запит:', request.url);

    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
                console.log('♻️ Кеш оновлено:', request.url);
                fetchResponse += 1;
            }
            return networkResponse;
        })
        .catch((error) => {
            console.log('⚠️ Мережа недоступна:', request.url);
            throw error;
        });

    if (cachedResponse) {
        console.log('✅ Відповідь з кешу:', request.url);
        cacheResponse += 1;
        totalResponse += 1;
    } else {
        totalResponse += 1;
    }

    return cachedResponse || fetchPromise;
}

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    const isOurOrigin = url.origin === location.origin;
    const isAllowedAPI = url.href.includes('jsonplaceholder.typicode.com');

    if (!isOurOrigin && !isAllowedAPI) {
        return;
    }

    event.respondWith(handleStaleWhileRevalidate(event.request));
});

self.addEventListener('message', async (event) => {
    if (event.data.action === 'showCache') {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        const urls = keys.map(req => req.url)
        event.source.postMessage({ type: 'cacheList', data: urls });
    }

    if (event.data.action === 'clearCache') {
        await caches.delete(CACHE_NAME);
        await caches.open(CACHE_NAME);
        event.source.postMessage({ type: 'cacheCleared' });
    }

    if (event.data.action === 'getStats') {
        const result = (cacheResponse / totalResponse) * 100;
        event.source.postMessage({ type: 'statsData', count: result });
    }
})