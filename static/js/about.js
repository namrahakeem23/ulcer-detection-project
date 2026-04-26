document.addEventListener('DOMContentLoaded', function() {
    const checkSection = setInterval(() => {
        const teamMembers = document.querySelectorAll('.team-member');
        if (teamMembers.length) {
            clearInterval(checkSection);
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.2 });
            
            teamMembers.forEach((member, index) => {
                member.style.opacity = '0';
                member.style.transform = 'translateY(30px)';
                member.style.transition = `all 0.5s ease ${index * 0.1}s`;
                observer.observe(member);
            });
        }
    }, 100);
});