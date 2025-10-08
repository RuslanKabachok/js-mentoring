(function () {
    'use strict';

    const track = document.querySelector('.slider__track');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsContainer = document.getElementById('indicators');
    const slider = document.querySelector('.slider');

    if (!track || !prevBtn || !nextBtn || !dotsContainer || !slider) {
        console.error('❌ Не знайдено необхідні елементи слайдера!');
        return;
    }

    const CONFIG = {
        ACCESS_KEY: 'BTdgKuINE4_wn30LD7xu7aRcxi8LjWkjusOjRySkihY',
        SLIDES_COUNT: 5,
        AUTOPLAY_DELAY: 3000,
        ANIMATION_DURATION: 500
    };

    const state = {
        slides: [],
        currentIndex: 0,
        totalSlides: 0,
        autoplayInterval: null,
        isTransitioning: false
    };

    const API_URL = `https://api.unsplash.com/photos/random?count=${CONFIG.SLIDES_COUNT}&orientation=landscape&client_id=${CONFIG.ACCESS_KEY}`;

    function createDots() {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < state.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = i === 0 ? 'dot active' : 'dot';
            dot.dataset.index = i;
            fragment.appendChild(dot);
        }

        dotsContainer.innerHTML = '';
        dotsContainer.appendChild(fragment);
        dotsContainer.addEventListener('click', handleDotClick);
    }

    function handleDotClick(e) {
        const dot = e.target.closest('.dot');
        if (dot) {
            goToSlide(Number(dot.dataset.index));
        }
    }

    function goToSlide(index) {
        if (index < 0 || index >= state.totalSlides || index === state.currentIndex) return;
        if (state.isTransitioning) return;

        state.isTransitioning = true;
        track.style.transform = `translateX(-${index * 100}%)`;

        updateDots(state.currentIndex, index);
        state.currentIndex = index;
        lazyLoadImage(index);

        setTimeout(() => {
            state.isTransitioning = false;
        }, CONFIG.ANIMATION_DURATION);
    }

    function updateDots(oldIndex, newIndex) {
        const dots = dotsContainer.querySelectorAll('.dot');
        if (dots[oldIndex]) dots[oldIndex].classList.remove('active');
        if (dots[newIndex]) dots[newIndex].classList.add('active');
    }

    function nextSlide() {
        const nextIndex = state.currentIndex < state.totalSlides - 1 ? state.currentIndex + 1 : 0;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.totalSlides - 1;
        goToSlide(prevIndex);
    }

    function initTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        const SWIPE_THRESHOLD = 50;

        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }

        function handleTouchMove(e) {
            if (Math.abs(e.touches[0].clientX - touchStartX) > 10) {
                e.preventDefault();
            }
        }

        function handleTouchEnd(e) {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;

            const diffX = touchStartX - touchEndX;
            const diffY = Math.abs(touchStartY - touchEndY);

            if (Math.abs(diffX) > SWIPE_THRESHOLD && diffY < SWIPE_THRESHOLD) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchmove', handleTouchMove, { passive: false });
        slider.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    function startAutoplay() {
        stopAutoplay();
        state.autoplayInterval = setInterval(nextSlide, CONFIG.AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        if (state.autoplayInterval) {
            clearInterval(state.autoplayInterval);
            state.autoplayInterval = null;
        }
    }

    function lazyLoadImage(index) {
        const slide = state.slides[index];
        if (!slide) return;

        const img = slide.querySelector('.slide-img');
        if (!img || img.dataset.loaded) return;

        img.src = img.dataset.src;
        img.dataset.loaded = 'true';
    }

    async function fetchImages() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Помилка API');

            const data = await response.json();

            return data;
        } catch (error) {
            console.error('❌ Помилка завантаження:', error);
            return [];
        }
    }

    function createSlides(images) {
        const fragment = document.createDocumentFragment();

        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');

            const img = document.createElement('img');
            img.classList.add('slide-img');
            img.alt = image.alt_description || `Slide ${index + 1}`;
            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect fill='%23ddd' width='800' height='400'/%3E%3C/svg%3E";
            img.dataset.src = image.urls.regular;

            slide.appendChild(img);
            fragment.appendChild(slide);
        });

        track.innerHTML = '';
        track.appendChild(fragment);
    }

    async function initSlider() {

        const images = await fetchImages();

        if (images.length === 0) {
            console.error('❌ Не вдалося завантажити зображення');
            return;
        }

        createSlides(images);

        state.slides = document.querySelectorAll('.slide');
        state.totalSlides = state.slides.length;

        if (state.totalSlides === 0) {
            console.error('❌ Слайди не створені');
            return;
        }

        createDots();
        lazyLoadImage(0);

        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);

        initTouchEvents();
        startAutoplay();
    }

    initSlider();

})();