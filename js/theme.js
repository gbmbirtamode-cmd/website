/**
 * GBM School Website - Theme Toggle
 * Dark/Light mode functionality
 */

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('gbm-theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.theme);
        this.createToggleButton();
    }
    
    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.theme = theme;
        localStorage.setItem('gbm-theme', theme);
    }
    
    toggle() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Animate transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    createToggleButton() {
        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.className = 'fixed bottom-8 left-8 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg z-50 flex items-center justify-center hover:scale-110 transition-transform';
        button.setAttribute('aria-label', 'Toggle theme');
        
        const icon = document.createElement('i');
        icon.className = this.theme === 'light' ? 'fas fa-moon text-gray-800' : 'fas fa-sun text-yellow-400';
        
        button.appendChild(icon);
        document.body.appendChild(button);
        
        button.addEventListener('click', () => {
            this.toggle();
            this.updateIcon(icon);
        });
    }
    
    updateIcon(icon) {
        if (this.theme === 'dark') {
            icon.className = 'fas fa-sun text-yellow-400';
        } else {
            icon.className = 'fas fa-moon text-gray-800';
        }
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
