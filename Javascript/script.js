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
        this.setupDarkMode(); // Modo noturno
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
        
        if (!menuToggle || !navMenu) return;
        
        const body = document.body;
        let overlay = document.querySelector('.nav-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            body.appendChild(overlay);
        }
        
        const closeMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        };
        
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = isExpanded ? '' : 'hidden';
        });
        
        overlay.addEventListener('click', closeMenu);
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) closeMenu();
        });
        
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) closeMenu();
            }, 150);
        });
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
        card.classList.toggle('hover-active', isHovering);
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
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    window.scrollTo({
                        top: target.offsetTop - headerHeight - 20,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupIntersectionObserver() {
        // Animação de aparição desabilitada
    }

    // Configuração do modo noturno
    setupDarkMode() {
        const toggleDarkMode = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        };

        // Aplica preferência salva
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }

        // Event listeners para ambos os botões
        ['dark-mode-toggle', 'dark-mode-toggle-mobile'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', toggleDarkMode);
        });

        // Sincroniza entre abas
        window.addEventListener('storage', (e) => {
            if (e.key === 'darkMode') {
                document.body.classList.toggle('dark-mode', e.newValue === 'enabled');
            }
        });
    }
}



// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new EcoBytesApp();
});