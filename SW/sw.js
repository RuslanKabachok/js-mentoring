self.addEventListener('install', (event) => {
    console.log('Service Worker: встановлено');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: активовано');
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    console.log('Перехоплено запит:', event.request.url);
});

self.addEventListener('fetch', async (event) => {
    event.respondWith(
        caches.open('api-cache').then(async (cache) => {
            const cachedResponse = await cache.match(event.request);

            if (cachedResponse) {
                console.log('✅ Відповідь із кешу:', event.request.url);
                return cachedResponse;
            }

            try {
                const networkResponse = await fetch(event.request);
                console.log('🌐 Отримано з мережі:', event.request.url);

                if (networkResponse && networkResponse.status === 200) {
                    cache.put(event.request, networkResponse.clone());
                }

                return networkResponse;
            } catch (error) {
                console.error('❌ Помилка запиту:', event.request.url);
                throw error;
            }
        })
    );
});
