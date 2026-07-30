/**
 * GBM School Website - Counter Animation
 * Animated number counters for statistics
 */

// Counter Animation Class
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-target]');
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        // Use Intersection Observer to trigger animation when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });
        
        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                
                // Add suffix if exists
                const suffix = element.getAttribute('data-suffix');
                if (suffix) {
                    element.textContent += suffix;
                }
            }
        };
        
        updateCounter();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new CounterAnimation();
});

// Export for use in other files
window.CounterAnimation = CounterAnimation;
