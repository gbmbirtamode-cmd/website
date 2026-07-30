/**
 * GBM School Website - Slider/Carousel
 * Image and content slider functionality
 */

class Slider {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.options = {
            autoplay: true,
            autoplayInterval: 5000,
            showDots: true,
            showArrows: true,
            transitionSpeed: 500,
            ...options
        };
        
        this.slides = this.container.querySelectorAll('.slide');
        this.currentIndex = 0;
        this.autoplayTimer = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Create wrapper
        this.wrapper = this.container.querySelector('.slider-wrapper') || this.container;
        
        // Create controls
        if (this.options.showArrows) {
            this.createArrows();
        }
        
        if (this.options.showDots) {
            this.createDots();
        }
        
        // Initialize first slide
        this.goToSlide(0);
        
        // Start autoplay
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Touch support
        this.initTouch();
    }
    
    createArrows() {
        this.prevArrow = document.createElement('button');
        this.prevArrow.className = 'slider-arrow prev absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10';
        this.prevArrow.innerHTML = '<i class="fas fa-chevron-left text-gray-800"></i>';
        this.prevArrow.setAttribute('aria-label', 'Previous slide');
        
        this.nextArrow = document.createElement('button');
        this.nextArrow.className = 'slider-arrow next absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10';
        this.nextArrow.innerHTML = '<i class="fas fa-chevron-right text-gray-800"></i>';
        this.nextArrow.setAttribute('aria-label', 'Next slide');
        
        this.container.appendChild(this.prevArrow);
        this.container.appendChild(this.nextArrow);
        
        this.prevArrow.addEventListener('click', () => this.prev());
        this.nextArrow.addEventListener('click', () => this.next());
    }
    
    createDots() {
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'slider-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10';
        
        for (let i = 0; i < this.slides.length; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot w-3 h-3 rounded-full transition-all ${i === 0 ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
        
        this.container.appendChild(this.dotsContainer);
        this.dots = this.dotsContainer.querySelectorAll('.slider-dot');
    }
    
    goToSlide(index) {
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;
        
        // Remove active class from current slide
        this.slides[this.currentIndex].classList.remove('active');
        this.slides[this.currentIndex].style.opacity = '0';
        
        // Update index
        this.currentIndex = index;
        
        // Add active class to new slide
        this.slides[this.currentIndex].classList.add('active');
        this.slides[this.currentIndex].style.opacity = '1';
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('bg-white', i === this.currentIndex);
                dot.classList.toggle('bg-white/50', i !== this.currentIndex);
                dot.classList.toggle('scale-125', i === this.currentIndex);
                dot.classList.toggle('scale-100', i !== this.currentIndex);
            });
        }
    }
    
    next() {
        this.goToSlide(this.currentIndex + 1);
    }
    
    prev() {
        this.goToSlide(this.currentIndex - 1);
    }
    
    startAutoplay() {
        if (this.autoplayTimer) return;
        
        this.autoplayTimer = setInterval(() => {
            this.next();
        }, this.options.autoplayInterval);
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    initTouch() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
    }
    
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    destroy() {
        this.stopAutoplay();
        
        if (this.prevArrow) this.prevArrow.remove();
        if (this.nextArrow) this.nextArrow.remove();
        if (this.dotsContainer) this.dotsContainer.remove();
        
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
    }
}

// Auto-initialize sliders with .slider class
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        new Slider(`.${slider.className.split(' ')[0]}`);
    });
});

// Export for use in other files
window.Slider = Slider;
