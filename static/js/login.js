document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAuth, 500);
});

function initAuth() {
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeBtn = document.querySelector('.modal-close');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Real session managed by Flask-Login via server-rendered header

    loginBtn?.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    });

    signupBtn?.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    closeBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Password toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });

    // Login
    loginForm?.addEventListener('submit', (e) => {
        // Form will submit to /login naturally
        showToast('Processing login...', 'info');
    });

    // Signup
    signupForm?.addEventListener('submit', (e) => {
        // Form will submit to /register naturally
        showToast('Creating account...', 'info');
    });

    // Dropdown toggle for server-rendered header
    document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.user-menu-btn');
        const dropdown = document.querySelector('.user-dropdown');
        
        if (menuBtn) {
            dropdown.classList.toggle('show');
            e.stopPropagation();
        } else if (dropdown && dropdown.classList.contains('show')) {
            if (!e.target.closest('.user-dropdown')) {
                dropdown.classList.remove('show');
            }
        }
    });

    function showToast(message, type) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}