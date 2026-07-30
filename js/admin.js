/**
 * GBM School Website - Admin JavaScript
 * Authentication and admin panel functionality
 */

// Check authentication state on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.includes('login.html');
    const isAdminPage = currentPage.includes('admin/');
    
    // Initialize login form if on login page
    if (isLoginPage) {
        initLoginForm();
    }
    
    // Check auth for admin pages
    if (isAdminPage && !isLoginPage) {
        checkAuth();
    }
});

/**
 * Initialize Login Form
 */
function initLoginForm() {
    const form = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const forgotPassword = document.getElementById('forgot-password');
    
    if (!form) return;
    
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        const submitBtn = document.getElementById('submit-btn');
        const errorMessage = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        const loadingState = document.getElementById('loading-state');
        
        // Hide previous errors
        errorMessage.classList.add('hidden');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div> Signing In...';
        loadingState.classList.remove('hidden');
        
        // Sign in with Firebase
        const result = await FirebaseHelper.signIn(email, password);
        
        if (result.success) {
            // Set persistence based on remember me
            if (remember) {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            } else {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
            }
            
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Success! Redirecting...';
            submitBtn.classList.add('bg-green-500');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            // Show error message
            errorMessage.classList.remove('hidden');
            errorText.textContent = getAuthErrorMessage(result.error);
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right ml-2"></i>';
            submitBtn.classList.remove('bg-green-500');
            loadingState.classList.add('hidden');
        }
    });
    
    // Forgot password handler
    if (forgotPassword) {
        forgotPassword.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            if (!email) {
                alert('Please enter your email address first');
                document.getElementById('email').focus();
                return;
            }
            
            const result = await FirebaseHelper.resetPassword(email);
            
            if (result.success) {
                alert('Password reset email sent! Please check your inbox.');
            } else {
                alert(getAuthErrorMessage(result.error));
            }
        });
    }
}

/**
 * Get user-friendly auth error messages
 */
function getAuthErrorMessage(error) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Invalid email address format.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.'
    };
    
    return errorMessages[error] || 'Login failed. Please check your credentials.';
}

/**
 * Check authentication status
 */
function checkAuth() {
    const currentUser = firebase.auth().currentUser;
    const currentPage = window.location.pathname;
    
    if (!currentUser && !currentPage.includes('login.html')) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
}

/**
 * Sign out function
 */
async function signOut() {
    const result = await FirebaseHelper.signOut();
    
    if (result.success) {
        window.location.href = 'login.html';
    } else {
        alert('Sign out failed. Please try again.');
    }
}

/**
 * Get current admin info
 */
function getCurrentAdmin() {
    const user = firebase.auth().currentUser;
    
    if (user) {
        return {
            email: user.email,
            uid: user.uid,
            displayName: user.displayName || 'Admin',
            photoURL: user.photoURL || null
        };
    }
    
    return null;
}

/**
 * Render admin profile in dashboard
 */
function renderAdminProfile() {
    const admin = getCurrentAdmin();
    
    if (admin) {
        const nameElement = document.getElementById('admin-name');
        const emailElement = document.getElementById('admin-email');
        const photoElement = document.getElementById('admin-photo');
        
        if (nameElement) nameElement.textContent = admin.displayName;
        if (emailElement) emailElement.textContent = admin.email;
        if (photoElement) {
            photoElement.src = admin.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.displayName)}&background=1e40af&color=fff`;
        }
    }
}

/**
 * Dashboard Statistics Loader
 */
async function loadDashboardStats() {
    const stats = {
        news: 0,
        events: 0,
        gallery: 0,
        teachers: 0,
        students: 0,
        notices: 0
    };
    
    try {
        const collections = ['news', 'events', 'gallery', 'teachers', 'students', 'notices'];
        
        for (const collection of collections) {
            const result = await FirebaseHelper.getCollection(collection, 'createdAt', 'desc', 1);
            if (result.success) {
                stats[collection] = result.data.length;
            }
        }
        
        // Update UI
        updateStatElement('stat-news', stats.news);
        updateStatElement('stat-events', stats.events);
        updateStatElement('stat-gallery', stats.gallery);
        updateStatElement('stat-teachers', stats.teachers);
        updateStatElement('stat-students', stats.students);
        updateStatElement('stat-notices', stats.notices);
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

/**
 * Update stat element with animation
 */
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Load data into table
 */
async function loadTableData(collection, tableId, columns, renderRow) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    
    if (!tableBody) return;
    
    try {
        const result = await FirebaseHelper.getCollection(collection);
        
        if (result.success) {
            tableBody.innerHTML = '';
            
            result.data.forEach(item => {
                const row = renderRow(item);
                tableBody.innerHTML += row;
            });
            
            if (result.data.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="${columns.length}" class="px-6 py-8 text-center text-gray-500">
                            <i class="fas fa-inbox text-4xl mb-2"></i>
                            <p>No data available</p>
                        </td>
                    </tr>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading table data:', error);
    }
}

/**
 * Delete confirmation dialog
 */
function confirmDelete(action, callback) {
    if (confirm(`Are you sure you want to delete this ${action}? This action cannot be undone.`)) {
        callback();
    }
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Export functions
 */
window.AdminHelper = {
    signOut,
    getCurrentAdmin,
    renderAdminProfile,
    loadDashboardStats,
    loadTableData,
    confirmDelete,
    formatFileSize,
    generateId
};

console.log('Admin module loaded');
