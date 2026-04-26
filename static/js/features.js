document.addEventListener('DOMContentLoaded', function() {
    const checkSection = setInterval(() => {
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length) {
            clearInterval(checkSection);
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            featureCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.5s ease';
                observer.observe(card);
            });
        }
    }, 100);
});