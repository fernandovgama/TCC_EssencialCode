class EcoBytesApp {
    constructor() {
        this.newsletterSubscribers = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        this.setupMobileMenu(); // Menu responsivo adicionado
    }

    setupEventListeners() {
        // Formulário de newsletter
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        // Efeitos hover nos cards de produtos
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleProductHover(card, true));
            card.addEventListener('mouseleave', () => this.handleProductHover(card, false));
        });

        // Tracking de botões de orçamento
        const budgetButtons = document.querySelectorAll('.btn-primary[href*="orcamento"]');
        budgetButtons.forEach(button => {
            button.addEventListener('click', (e) => this.trackBudgetButtonClick(e));
        });
    }

    // Menu responsivo
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;
        
        if (menuToggle) {
            const overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
            
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
                overlay.classList.toggle('active');
                body.style.overflow = isExpanded ? '' : 'hidden';
            });
            
            overlay.addEventListener('click', () => {
                this.closeMobileMenu(menuToggle, navMenu, overlay, body);
            });
            
            // Fecha menu ao clicar em links
            const menuLinks = navMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.closeMobileMenu(menuToggle, navMenu, overlay, body);
                    }
                });
            });
            
            // Fecha menu ao redimensionar para desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMobileMenu(menuToggle, navMenu, overlay, body);
                }
            });
        }
    }

    closeMobileMenu(menuToggle, navMenu, overlay, body) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    handleNewsletterSubmit(event) {
        event.preventDefault();
        
        const emailInput = event.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (!this.isValidEmail(email)) {
            this.showNotification('Por favor, insira um email válido.', 'error');
            return;
        }

        const existingSubscriber = this.newsletterSubscribers.find(sub => 
            sub.email.toLowerCase() === email.toLowerCase()
        );

        if (existingSubscriber) {
            this.showNotification('Este email já está inscrito na nossa newsletter!', 'warning');
        } else {
            const newSubscriber = {
                email: email,
                subscribedAt: new Date().toLocaleDateString('pt-BR'),
                id: this.generateUniqueId()
            };
            
            this.newsletterSubscribers.push(newSubscriber);
            this.showNotification('Cadastro realizado, receba novidades em breve!', 'success');
            emailInput.value = '';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    generateUniqueId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#2E8B57' : type === 'error' ? '#E53E3E' : type === 'warning' ? '#D69E2E' : '#3182CE'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    handleProductHover(card, isHovering) {
        const productImage = card.querySelector('.product-image img');
        
        if (isHovering) {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
            if (productImage) {
                productImage.style.transform = 'scale(1.1)';
            }
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            if (productImage) {
                productImage.style.transform = 'scale(1)';
            }
        }
    }

    trackBudgetButtonClick(event) {
        const productCard = event.target.closest('.product-card');
        let productName = 'Produto Ecobytes';

        if (productCard) {
            const titleElement = productCard.querySelector('h3');
            if (titleElement) {
                productName = titleElement.textContent;
            }
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupIntersectionObserver() {
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

        const elementsToAnimate = document.querySelectorAll('.benefit-card, .product-card, .about-feature');
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
}



// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new EcoBytesApp();
});