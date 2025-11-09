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
