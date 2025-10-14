const form = document.getElementById('imageForm');
const imgLink = document.getElementById('img-link');
const imgDescr = document.getElementById('img-description');
const btn = document.querySelector('button[type="submit"]')
const gallery = document.querySelector('.gallery');
const lightBox = document.querySelector('.lightbox');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let imgGallery = loadGallery();
let currentIndex = 0;

renderGallery();

function renderGallery() {
    gallery.innerHTML = '';

    imgGallery.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;

        item.innerHTML = `
            <img src="${img.url}" alt="${img.description}">
            <p>${img.description}</p>
            <button class="delete-btn">✕</button>
        `;

        gallery.appendChild(item);
    });
    saveGallery();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!imgLink.value || !imgDescr.value) {
        alert('Заповніть всі поля!');
        return;
    }

    const image = {
        id: Date.now(),
        url: imgLink.value,
        description: imgDescr.value
    }

    imgGallery.push(image);
    form.reset();
    renderGallery();
})

gallery.addEventListener('click', (e) => {

    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.closest('.gallery-item').dataset.index;

        imgGallery.splice(index, 1);
    }
    saveGallery();
    renderGallery();

    if (e.target.tagName === 'IMG') {
        const imgIndex = e.target.closest('.gallery-item').dataset.index;
        currentIndex = Number(imgIndex);
        lightBox.classList.remove('hide');

        document.getElementById('lightboxImg').src = imgGallery[imgIndex].url;
        document.getElementById('lightboxDesc').textContent = imgGallery[imgIndex].description;
    }
})

document.querySelector('#close').addEventListener('click', () => {
    lightBox.classList.add('hide');
})

nextBtn.addEventListener('click', (e) => {
    currentIndex = (currentIndex + 1) % imgGallery.length;

    document.getElementById('lightboxImg').src = imgGallery[currentIndex].url;
    document.getElementById('lightboxDesc').textContent = imgGallery[currentIndex].description;
})

prevBtn.addEventListener('click', (e) => {
    currentIndex = (currentIndex - 1 + imgGallery.length) % imgGallery.length;

    document.getElementById('lightboxImg').src = imgGallery[currentIndex].url;
    document.getElementById('lightboxDesc').textContent = imgGallery[currentIndex].description;
})

function saveGallery() {
    localStorage.setItem('gallery', JSON.stringify(imgGallery));
}

function loadGallery() {
    const saved = localStorage.getItem('gallery');
    return saved ? JSON.parse(saved) : [];
}