document.addEventListener('DOMContentLoaded', function() {
    const checkHeader = setInterval(() => {
        const header = document.querySelector('.header');
        if (header) {
            clearInterval(checkHeader);
            
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
    }, 100);
});