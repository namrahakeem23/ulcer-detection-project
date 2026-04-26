// Load all HTML sections dynamically
document.addEventListener('DOMContentLoaded', function() {
    
    // Function to load HTML section
    function loadSection(containerId, filePath) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(containerId).innerHTML = data;
                console.log(`✅ Loaded: ${filePath}`);
            })
            .catch(error => console.error(`❌ Error loading ${filePath}:`, error));
    }

    // Load all sections - MAKE SURE THESE PATHS ARE CORRECT
    loadSection('header-container', 'sections/header.html');
    loadSection('home-container', 'sections/home.html');
    loadSection('how-it-works-container', 'sections/how-it-works.html');
    loadSection('features-container', 'sections/features.html');
    loadSection('diagnosis-container', 'sections/diagnosis.html');
    loadSection('about-container', 'sections/about.html');
    loadSection('contact-container', 'sections/contact.html');
    
    // Initialize after all sections load
    setTimeout(() => {
        initGlobalFunctions();
    }, 500);
});

// Global Functions
function initGlobalFunctions() {
    initMobileMenu();
    initHeaderScroll();
    initActiveLinks();
    initSmoothScroll();
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