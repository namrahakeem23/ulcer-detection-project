// How It Works section functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkSection = setInterval(() => {
        const stepCards = document.querySelectorAll('.step-card');
        if (stepCards.length) {
            clearInterval(checkSection);
            initHowItWorks();
        }
    }, 100);
});

function initHowItWorks() {
    const stepCards = document.querySelectorAll('.step-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stepCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}