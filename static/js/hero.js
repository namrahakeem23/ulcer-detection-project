// Hero section functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkHero = setInterval(() => {
        const heroImage = document.getElementById('interactiveImage');
        if (heroImage) {
            clearInterval(checkHero);
            initHeroFeatures();
        }
    }, 100);
});

function initHeroFeatures() {
    const heroImage = document.getElementById('interactiveImage');
    const imageContainer = document.querySelector('.hero-image-container');
    const navDots = document.querySelectorAll('.nav-dot');

    const images = [
        {
            url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            title: 'AI Analysis Interface'
        },
        {
            url: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            title: 'Medical Scanning'
        },
        {
            url: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            title: 'Ulcer Detection'
        }
    ];

    let currentImageIndex = 0;

    if (navDots.length) {
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentImageIndex = index;
                updateHeroImage(index);
                navDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
        });
    }

    function updateHeroImage(index) {
        if (heroImage) {
            heroImage.src = images[index].url;
            heroImage.alt = images[index].title;
            heroImage.style.opacity = '0';
            setTimeout(() => {
                heroImage.style.opacity = '1';
            }, 100);
        }
    }

    // Auto-rotate images
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateHeroImage(currentImageIndex);
        if (navDots.length) {
            navDots.forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === currentImageIndex) dot.classList.add('active');
            });
        }
    }, 5000);

    // Hover effect on image
    if (imageContainer) {
        imageContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = imageContainer.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            if (heroImage) {
                heroImage.style.transform = `scale(1.05) translate(${x * 20}px, ${y * 20}px)`;
            }
        });

        imageContainer.addEventListener('mouseleave', () => {
            if (heroImage) {
                heroImage.style.transform = 'scale(1) translate(0, 0)';
            }
        });
    }
}