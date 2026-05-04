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

    // Check saved login
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser) updateNavbarForLoggedInUser(savedUser);
    }

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
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const username = email.split('@')[0];
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', username);
        
        showToast('Login successful!', 'success');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            updateNavbarForLoggedInUser(username);
            if (typeof checkLoginStatus === 'function') checkLoginStatus();
            if (typeof initDiagnosisFeatures === 'function') initDiagnosisFeatures();
        }, 1000);
    });

    // Signup
    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        showToast('Account created! Please login.', 'success');
        setTimeout(() => {
            document.getElementById('loginEmail').value = email;
            loginTab.click();
        }, 1500);
    });

    function showToast(message, type) {
        const toast = document.getElementById('toast');
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function updateNavbarForLoggedInUser(username) {
        const navButtons = document.querySelector('.nav-buttons');
        if (!navButtons) return;
        navButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-outline user-menu-btn">
                    <i class="fas fa-user-circle"></i> ${username} <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown">
                    <a href="#"><i class="fas fa-user"></i> Profile</a>
                    <a href="#"><i class="fas fa-chart-line"></i> Dashboard</a>
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
        document.querySelector('.user-menu-btn')?.addEventListener('click', () => {
            document.querySelector('.user-dropdown').classList.toggle('show');
        });
    }
}