if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker зареєстровано'))
        .catch(err => console.error('SW помилка:', err));
}

document.getElementById('fetchBtn').addEventListener('click', async () => {
    const output = document.getElementById('output');
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await res.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        output.textContent = 'Помилка запиту: ' + err.message;
    }
});

document.getElementById('showCache').addEventListener('click', () => {
    if (!navigator.serviceWorker.controller) {
        alert('Service Worker ще не активний. Перезавантажте сторінку.');
        return;
    }
    navigator.serviceWorker.controller.postMessage({ action: 'showCache' });
});

document.getElementById('clearCache').addEventListener('click', () => {
    if (!navigator.serviceWorker.controller) {
        alert('Service Worker ще не активний. Перезавантажте сторінку.');
        return;
    }
    navigator.serviceWorker.controller.postMessage({ action: 'clearCache' });
});

navigator.serviceWorker.addEventListener('message', (event) => {
    const output = document.getElementById('cacheOutput');
    const cacheCountOutput = document.getElementById('cacheCountOutput');
    const fetchOutput = document.getElementById('fetchOutput');
    const totalOutput = document.getElementById('totalOutput');
    const hitRateOutput = document.getElementById('hitRateOutput');


    if (event.data.type === 'cacheList') {
        output.textContent = event.data.data.join('\n');
    }

    if (event.data.type === 'cacheCleared') {
        output.textContent = 'Кеш очищено';
    }

    if (event.data.type === 'statsData') {
        cacheCountOutput.textContent = `✅ Запитів з кешу: ${event.data.cacheResponse}`;
        fetchOutput.textContent = `🌐 Запитів з мережі: ${event.data.cacheMisses}`;
        totalOutput.textContent = `📊 Загалом оброблено: ${event.data.totalResponse}`;
        hitRateOutput.textContent = `📈 Частка кешованих запитів: ${event.data.cacheStats.toFixed(2)} %`;
    }

    if (event.data.type === 'statsReset') {
        cacheCountOutput.textContent = 'Статистика скинута';
        fetchOutput.textContent = '';
        totalOutput.textContent = '';
        hitRateOutput.textContent = '';
    }
})

document.getElementById('showStats').addEventListener('click', () => {
    if (!navigator.serviceWorker.controller) {
        alert('Service Worker ще не активний. Перезавантажте сторінку.');
        return;
    }
    navigator.serviceWorker.controller.postMessage({ action: 'getStats' });
});

document.getElementById('clearStats').addEventListener('click', () => {
    if (!navigator.serviceWorker.controller) {
        alert('Service Worker ще не активний. Перезавантажте сторінку.');
        return;
    }
    navigator.serviceWorker.controller.postMessage({ action: 'resetStats' });
});