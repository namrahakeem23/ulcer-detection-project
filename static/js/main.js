// Load all HTML sections dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Load header FIRST
    loadHeaderFirst();
    
    function loadHeaderFirst() {
        fetch('sections/header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-container').innerHTML = data;
                loadRemainingSections();
            })
            .catch(error => console.error('Error loading header:', error));
    }
    
    function loadRemainingSections() {
        const sections = [
            'hero', 'how-it-works', 'features', 'diagnosis', 'about', 'footer'
        ];
        
        sections.forEach(section => {
            fetch(`sections/${section}.html`)
                .then(response => response.text())
                .then(data => {
                    document.getElementById(`${section}-container`).innerHTML = data;
                })
                .catch(error => console.error(`Error loading ${section}:`, error));
        });
        
        // Initialize after all sections load
        setTimeout(initAll, 500);
    }
});

function initAll() {
    initMobileMenu();
    initHeaderScroll();
    initActiveLinks();
    initSmoothScroll();
    initLoginSignupButtons();
}

function initMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }
}

function initHeaderScroll() {
    const header = document.querySelector(".header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }
}

function initActiveLinks() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute("id");
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#${current}`) {
                link.classList.add("active");
            }
        });
        
        if (current === "" && window.scrollY < 100) {
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add("active");
        }
    });
    
    window.dispatchEvent(new Event('scroll'));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initLoginSignupButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.modal-close');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}