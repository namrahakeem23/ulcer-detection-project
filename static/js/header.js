// Header specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if header is loaded
    const checkHeader = setInterval(() => {
        const header = document.querySelector('.header');
        if (header) {
            clearInterval(checkHeader);
            
            // Mobile menu toggle
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
            
            // Header scroll effect
            window.addEventListener("scroll", () => {
                if (window.scrollY > 50) {
                    header.classList.add("scrolled");
                } else {
                    header.classList.remove("scrolled");
                }
            });
        }
    }, 100);
});