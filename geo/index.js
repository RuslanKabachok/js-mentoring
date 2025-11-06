const config = {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
};

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&callback=initMap`;
script.async = true;
script.defer = true;
document.head.appendChild(script);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('✅ Service Worker зареєстровано'))
        .catch(err => console.warn('SW помилка:', err));
}

let map;
let watchId;
let userMarker;
let currentAudioId = null;
let currentAudio = null;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
const mapElement = document.getElementById('map');
const networkStatus = document.getElementById('network-status');
const locations = [
    {
        id: 'location_1',
        name: 'Софійський собор',
        coordinates: { lat: 50.4527, lng: 30.5147 },
        radius: 100,
        audioUrl: './audio/sophia.mp3',
        description: 'Софійський собор - пам\'ятка архітектури XI століття',
        audioText: 'Ви підійшли до Софійського собору. Це пам\'ятка архітектури одинадцятого століття.'
    },
    {
        id: 'location_2',
        name: 'Золоті ворота',
        coordinates: { lat: 50.4485, lng: 30.5134 },
        radius: 80,
        audioUrl: './audio/golden_gate.mp3',
        description: 'Золоті ворота - пам\'ятка оборонної архітектури Київської Русі',
        audioText: 'Ви підійшли до Золотих воріт. Це пам\'ятка оборонної архітектури Київської Русі.'
    },
    {
        id: 'location_3',
        name: 'Майдан Незалежності',
        coordinates: { lat: 50.4501, lng: 30.5234 },
        radius: 150,
        audioUrl: './audio/maidan.mp3',
        description: 'Центральна площа Києва',
        audioText: 'Ви підійшли до Майдану Незалежності. Це центральна площа Києва.'
    },
    {
        id: 'location_4',
        name: 'Андріївський узвіз',
        coordinates: { lat: 50.4580, lng: 30.5169 },
        radius: 100,
        audioUrl: './audio/andriyivsky.mp3',
        description: 'Історична вулиця Києва',
        audioText: 'Ви підійшли до Андріївського узвозу. Це історична вулиця Києва.',
    }
];

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

async function playAudio(location) {
    if (currentAudio) {
        currentAudio.stop();
        currentAudio = null;
    }

    const buffer = await loadAudioBuffer(location.audioUrl);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start(0);

    currentAudio = source;
    currentAudioId = location.id;

    console.log(`🎧 Грає аудіо: ${location.name}`);

    const PLAY_DURATION = 5;
    const FADE_DURATION = 2;

    const fadeStartTime = audioContext.currentTime + PLAY_DURATION - FADE_DURATION;
    gainNode.gain.linearRampToValueAtTime(0, fadeStartTime + FADE_DURATION);

    source.stop(audioContext.currentTime + PLAY_DURATION);

    source.onended = () => {
        console.log(`⏹️ Аудіо ${location.name} завершено`);
        currentAudio = null;
        currentAudioId = null;
    };

    const infoText = document.getElementById('info-text');
    const infoPanel = document.getElementById('info-panel');
    infoPanel.classList.remove('inactive');
    infoText.textContent = `🔊 ${location.name}: ${location.description}`;
}

async function loadAudioBuffer(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP помилка! статус: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        if (arrayBuffer.byteLength === 0) {
            throw new Error('Отримано пустий arrayBuffer');
        }

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        if (!audioBuffer) {
            throw new Error('Не вдалося декодувати аудіо дані');
        }

        return audioBuffer;

    } catch (error) {
        console.error('Помилка завантаження аудіо буфера:', error);

        if (error.name === 'TypeError') {
            console.error('Мережева помилка або неправильний URL');
        } else if (error.name === 'NotSupportedError') {
            console.error('Браузер не підтримує цей аудіо формат');
        }
        return null;
    }
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.stop();
        currentAudio = null;
    }

    console.log('⏹️ Аудіо зупинено');
    currentAudioId = null;

    const infoText = document.getElementById('info-text');
    const infoPanel = document.getElementById('info-panel');
    console.log('До:', infoPanel.classList);
    infoPanel.classList.add('inactive');
    console.log('Після:', infoPanel.classList);
    infoText.textContent = 'Наближайтесь до локацій щоб почути аудіогід';
}

function checkLocationProximity(userLocation) {
    let inAnyZone = false;

    locations.forEach(location => {
        const distance = getDistance(
            userLocation.lat,
            userLocation.lng,
            location.coordinates.lat,
            location.coordinates.lng
        );

        console.log(`${location.name}: ${distance.toFixed(0)}м (радіус: ${location.radius}м)`);

        if (distance < location.radius) {
            inAnyZone = true;

            if (currentAudioId !== location.id) {
                playAudio(location);
            }
        }
    });

    if (!inAnyZone && currentAudioId) {
        stopAudio();
    }
}

function initMap() {
    const kyiv = { lat: 50.4501, lng: 30.5234 };
    map = new google.maps.Map(mapElement, {
        zoom: 12,
        center: kyiv,
    });

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {

                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                if (userMarker) {
                    userMarker.setPosition(userLocation);
                } else {
                    userMarker = new google.maps.Marker({
                        position: userLocation,
                        map,
                        title: "Ви тут",
                    });
                }

                checkLocationProximity(userLocation);
                map.setCenter(userLocation);
            },
            (error) => {
                console.warn("Помилка геолокації:", error.message);

                const fallbackLocation = { lat: 59.4499, lng: 39.5166 };
                checkLocationProximity(fallbackLocation);
                map.setCenter(fallbackLocation);

                if (userMarker) {
                    userMarker.setPosition(fallbackLocation);
                } else {
                    userMarker = new google.maps.Marker({
                        position: fallbackLocation,
                        map,
                        title: "Ви тут",
                    });
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 10000
            }
        );
    } else {
        console.log("Геолокація не підтримується вашим браузером");
    }

    addLocationMarkers();
}

function addLocationMarkers() {
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location.coordinates, title: location.name, map, icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        })
    })
}

function updateNetworkStatus() {
    if (navigator.onLine) {
        networkStatus.textContent = '🟢 Онлайн';
        networkStatus.classList.remove('offline');
    } else {
        networkStatus.textContent = '🔴 Офлайн';
        networkStatus.classList.add('offline');
    }
}

updateNetworkStatus();

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

export { initMap };