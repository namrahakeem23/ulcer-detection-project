// This file works alongside main.js for additional login functionality
document.addEventListener('DOMContentLoaded', function () {
    // Modal elements
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeBtn = document.querySelector('.modal-close');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Open modal with login form
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            if (loginTab && signupTab && loginForm && signupForm) {
                loginTab.classList.add('active');
                signupTab.classList.remove('active');
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            }
        });
    }

    // Open modal with signup form
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            if (loginTab && signupTab && loginForm && signupForm) {
                signupTab.classList.add('active');
                loginTab.classList.remove('active');
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Tab switching
    if (loginTab) {
        loginTab.addEventListener('click', () => {
            if (loginTab && signupTab && loginForm && signupForm) {
                loginTab.classList.add('active');
                signupTab.classList.remove('active');
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            }
        });
    }

    if (signupTab) {
        signupTab.addEventListener('click', () => {
            if (loginTab && signupTab && loginForm && signupForm) {
                signupTab.classList.add('active');
                loginTab.classList.remove('active');
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    }

    // Password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value || '';
            const password = document.getElementById('loginPassword')?.value || '';

            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Demo credentials
            if (email === 'demo@ulcerdetect.ai' && password === 'password123') {
                alert('Login successful! Redirecting...');
                setTimeout(() => {
                    if (modal) modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    updateNavbarForLoggedInUser('Demo User');
                }, 1000);
            } else {
                alert('Invalid email or password.\n\nDemo credentials:\nEmail: demo@ulcerdetect.ai\nPassword: password123');
            }
        });
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName')?.value || '';
            const email = document.getElementById('signupEmail')?.value || '';
            const password = document.getElementById('signupPassword')?.value || '';
            const confirmPassword = document.getElementById('confirmPassword')?.value || '';
            const terms = document.querySelector('#signupForm .checkbox-label input')?.checked || false;

            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            if (password.length < 8) {
                alert('Password must be at least 8 characters long');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (!terms) {
                alert('Please accept the Terms of Service');
                return;
            }

            alert('Account created successfully! Please login.');
            if (modal && loginTab && signupTab && loginForm && signupForm) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Social login buttons
    document.querySelectorAll('.btn-social').forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.classList.contains('google') ? 'Google' : 'Microsoft';
            alert(`${provider} login coming soon!`);
        });
    });

    // Forgot password
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password reset link sent to your email!');
        });
    }

    // Update navbar after login
    function updateNavbarForLoggedInUser(username) {
        const navButtons = document.querySelector('.nav-buttons');
        if (!navButtons) return;

        navButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-outline user-menu-btn">
                    <i class="fas fa-user-circle"></i>
                    <span>${username}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown">
                    <a href="#profile"><i class="fas fa-user"></i> Profile</a>
                    <a href="#dashboard"><i class="fas fa-chart-line"></i> Dashboard</a>
                    <a href="#settings"><i class="fas fa-cog"></i> Settings</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                location.reload();
            });
        }

        const userMenuBtn = document.querySelector('.user-menu-btn');
        const dropdown = document.querySelector('.user-dropdown');

        if (userMenuBtn && dropdown) {
            userMenuBtn.addEventListener('click', () => {
                dropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }
    }
});