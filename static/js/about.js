// About section functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkSection = setInterval(() => {
        const teamMembers = document.querySelectorAll('.team-member');
        if (teamMembers.length) {
            clearInterval(checkSection);
            initAbout();
        }
    }, 100);
});

function initAbout() {
    const teamMembers = document.querySelectorAll('.team-member');
    
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
    
    teamMembers.forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(member);
    });
}