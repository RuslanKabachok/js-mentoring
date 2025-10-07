const track = document.querySelector('.slider__track');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dotsContainer = document.getElementById('indicators');
const slider = document.querySelector('.slider');

let currentIndex = 0;
const totalSlides = slides.length;

let autoplayInterval;
const autoplayDelay = 3000;

function createDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');

        if (i === 0) {
            dot.classList.add('active');
        }

        dot.addEventListener('click', () => {
            goToSlide(i);
        });

        dotsContainer.appendChild(dot);
    }
}

function goToSlide(index) {
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;

    currentIndex = index;

    updateDots();
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if (i === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextSlide() {
    if (currentIndex < totalSlides - 1) {
        goToSlide(currentIndex + 1);
    } else {
        goToSlide(0);
    }
}

function prevSlide() {
    if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
    } else {
        goToSlide(totalSlides - 1);
    }
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        nextSlide();
    }, autoplayDelay);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

startAutoplay();

slider.addEventListener('mouseenter', stopAutoplay);
slider.addEventListener('mouseleave', startAutoplay);

createDots();