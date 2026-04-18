// Footer section functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkFooter = setInterval(() => {
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            clearInterval(checkFooter);
            initFooter();
        }
    }, 100);
});

function initFooter() {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail ? newsletterEmail.value.trim() : '';
            
            if (!email || !isValidEmail(email)) {
                showNewsletterMessage('Please enter a valid email address', 'error');
                if (newsletterEmail) shakeElement(newsletterEmail);
                return;
            }
            
            const submitBtn = newsletterForm.querySelector('.subscribe-btn');
            const originalText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                submitBtn.disabled = true;
            }
            
            setTimeout(() => {
                showNewsletterMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
                if (newsletterEmail) newsletterEmail.value = '';
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
                animateSuccess();
            }, 1500);
        });
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showNewsletterMessage(message, type) {
        if (newsletterMessage) {
            newsletterMessage.textContent = message;
            newsletterMessage.className = `newsletter-message ${type}`;
            setTimeout(() => {
                newsletterMessage.style.opacity = '0';
                setTimeout(() => {
                    if (newsletterMessage) {
                        newsletterMessage.textContent = '';
                        newsletterMessage.className = 'newsletter-message';
                        newsletterMessage.style.opacity = '1';
                    }
                }, 300);
            }, 5000);
        }
    }

    function shakeElement(element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => element.style.animation = '', 500);
    }

    function animateSuccess() {
        const newsletter = document.querySelector('.footer-newsletter');
        if (newsletter) {
            newsletter.style.animation = 'pulseSuccess 0.5s ease';
            setTimeout(() => newsletter.style.animation = '', 500);
        }
    }

    // Tooltips for cert badges
    document.querySelectorAll('.cert-badge').forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-3px) scale(1.05)';
        });
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = '';
        });
    });

    // Social icons click handler
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            icon.style.transform = 'scale(0.9)';
            setTimeout(() => icon.style.transform = '', 200);
            const socialName = icon.getAttribute('data-tooltip') || 'social media';
            showNotification(`Opening ${socialName}`, 'info');
        });
    });

    // Copy to clipboard for contact info
    document.querySelectorAll('.contact-link, .contact-address').forEach(element => {
        element.addEventListener('click', (e) => {
            if (element.tagName === 'A' && element.href) return;
            const text = element.textContent;
            navigator.clipboard.writeText(text).then(() => {
                showCopyTooltip(element, 'Copied!');
            }).catch(err => console.error('Failed to copy: ', err));
        });
    });

    function showCopyTooltip(element, message) {
        const tooltip = document.createElement('span');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `position:absolute; background:#0fb8b0; color:#0f2b4f; padding:4px 8px; border-radius:4px; font-size:0.8rem; top:-30px; left:50%; transform:translateX(-50%); white-space:nowrap; animation:fadeInOut 1s ease; z-index:1000;`;
        if (window.getComputedStyle(element).position === 'static') element.style.position = 'relative';
        element.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 1000);
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i><span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}