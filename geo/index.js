let map;
let watchId;
let userMarker;
const mapElement = document.getElementById('map');
const locations = [
    {
        id: 'location_1',
        name: 'Софійський собор',
        coordinates: { lat: 50.4527, lng: 30.5147 },
        radius: 100,
        audioUrl: '/audio/sophia.mp3',
        description: 'Софійський собор - пам\'ятка архітектури XI століття'
    },
    {
        id: 'location_2',
        name: 'Золоті ворота',
        coordinates: { lat: 50.4485, lng: 30.5134 },
        radius: 80,
        audioUrl: '/audio/golden_gate.mp3',
        description: 'Золоті ворота - пам\'ятка оборонної архітектури Київської Русі'
    },
    {
        id: 'location_3',
        name: 'Майдан Незалежності',
        coordinates: { lat: 50.4501, lng: 30.5234 },
        radius: 150,
        audioUrl: '/audio/maidan.mp3',
        description: 'Центральна площа Києва'
    },
    {
        id: 'location_4',
        name: 'Андріївський узвіз',
        coordinates: { lat: 50.4580, lng: 30.5169 },
        radius: 100,
        audioUrl: '/audio/andriyivsky.mp3',
        description: 'Історична вулиця Києва'
    }
];

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

                map.setCenter(userLocation);
            },
            (error) => {
                console.warn("Помилка геолокації:", error.message);

                const fallbackLocation = { lat: 50.4501, lng: 30.5234 };
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

const addLocationMarkers = () => {
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location.coordinates, title: location.name, map, icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        })
    })
}
