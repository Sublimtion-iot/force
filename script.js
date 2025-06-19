// Variables globales
let currentSection = 'accueil';
let isAnimating = false;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    setupIntersectionObserver();
    animateOnScroll();
});

// Initialisation du site web
function initializeWebsite() {
    // Afficher la section d'accueil par défaut
    showSection('accueil');
    
    // Mettre à jour le lien actif
    updateActiveNavLink('accueil');
    
    // Animation d'entrée pour le hero
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }, 300);
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Navigation hamburger
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Liens de navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            showSection(target);
            updateActiveNavLink(target);
            
            // Fermer le menu mobile
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Boutons de téléchargement
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', handleDownload);
    });

    // Redimensionnement de la fenêtre
    window.addEventListener('resize', handleWindowResize);

    // Scroll pour les effets
    window.addEventListener('scroll', handleScroll);
}

// Affichage des sections
function showSection(sectionId) {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.section');
    const currentActiveSection = document.querySelector('.section.active');
    
    if (currentActiveSection) {
        currentActiveSection.style.opacity = '0';
        currentActiveSection.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            currentActiveSection.classList.remove('active');
            
            // Afficher la nouvelle section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.opacity = '0';
                targetSection.style.transform = 'translateX(30px)';
                
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateX(0)';
                    currentSection = sectionId;
                    isAnimating = false;
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Animation des éléments de la section
                    animateSectionElements(targetSection);
                }, 50);
                updateActiveNavLink(sectionId);
            } else {
                isAnimating = false;
            }
        }, 300);
    } else {
        // Première section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionId;
            isAnimating = false;

            window.scrollTo({ top: 0, behavior: 'smooth' });
            animateSectionElements(targetSection);
        }
    }
}

// Mise à jour du lien de navigation actif
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Animation des éléments d'une section
function animateSectionElements(section) {
    const animatableElements = section.querySelectorAll(
        '.benefit-card, .programme-force-content, .formation-card, .method-card, .team-member, .gallery-item, .download-item, .info-item'
    );
    
    animatableElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Gestion du formulaire de contact
function handleContactForm(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Animation de chargement
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Récupération des données
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Simulation d'envoi (remplacer par vraie API)
    setTimeout(() => {
        console.log('Données du formulaire:', data);
        
        // Réinitialisation du bouton
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Message de succès
        showNotification('Message envoyé avec succès !', 'success');
        
        // Réinitialisation du formulaire
        e.target.reset();
    }, 2000);
}

// Gestion des téléchargements
/*
function handleDownload(e) {
    const button = e.target;
    const originalText = button.textContent;
    
    button.textContent = 'Téléchargement...';
    button.disabled = true;
    
    // Simulation de téléchargement
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        showNotification('Téléchargement démarré !', 'info');
    }, 1500);
}*/
// Gestion des téléchargements
function handleDownload(e) {
    e.preventDefault(); // Empêche le comportement par défaut si le bouton est dans un un lien ou formulaire

    const button = e.target;
    const filePath = button.dataset.file; // Récupère le chemin du fichier depuis l'attribut data-file

    if (!filePath) {
        console.error('Chemin du fichier non spécifié pour le téléchargement.');
        showNotification('Erreur : fichier non trouvé.', 'error');
        return;
    }

    const originalText = button.textContent;

    button.textContent = 'Téléchargement...';
    button.disabled = true;

    // Créer un lien temporaire et cliquer dessus pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop(); // Définit le nom du fichier à télécharger
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        showNotification('Téléchargement démarré !', 'info');
    }, 1500); // Court délai pour simuler le début du téléchargement
}

// Affichage des notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles de base pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(400px)',
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Couleurs selon le type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #10b981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
            break;
        case 'info':
        default:
            notification.style.background = 'linear-gradient(45deg, #3b82f6, #2563eb)';
    }
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Gestion du redimensionnement de la fenêtre
function handleWindowResize() {
    // Fermer le menu mobile si la fenêtre devient plus large
    if (window.innerWidth > 768) {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}

// Gestion du scroll
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}

// Observer d'intersection pour les animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    const animatableElements = document.querySelectorAll(
        '.benefit-card, .programme-force, .formation-card, .method-card, .team-member, .gallery-item, .download-item'
    );
    
    animatableElements.forEach(element => {
        observer.observe(element);
    });
}

// Animations au scroll
function animateOnScroll() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .notification {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);
}

// Fonction utilitaire pour animer les compteurs (si nécessaire)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Fonction pour le smooth scroll (si nécessaire)
function smoothScrollTo(target, duration = 800) {
    const targetElement = document.getElementById(target);
    if (!targetElement) return;
    
    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.offsetTop - 70; // Hauteur de la navbar
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Fonction pour gérer les cookies (si nécessaire)
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Fonction pour valider les emails
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Fonction pour formater les numéros de téléphone
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
        return `+229 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
}

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
    // En production, vous pourriez envoyer cette erreur à un service de monitoring
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Temps de chargement:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
        }, 0);
    });
}

// Export des fonctions principales (pour les tests ou usage externe)
window.SublimtionIoT = {
    showSection,
    showNotification,
    animateCounter,
    validateEmail,
    formatPhoneNumber
};