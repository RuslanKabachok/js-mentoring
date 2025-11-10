const CACHE_NAME = 'dynamic-cache-v1';

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
            }
            return networkResponse;
        })
        .catch((error) => {
            console.log('⚠️ Мережа недоступна:', request.url);
            throw error;
        });

    if (cachedResponse) { console.log('✅ Відповідь з кешу:', request.url); }

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

