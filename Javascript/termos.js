/**
 * Gerenciamento simples da página de Termos
 */
class TermosPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.updateDataAtualizacao();
    }

    /**
     * Menu mobile (mesmo das outras páginas)
     */
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
            
            const menuLinks = navMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.closeMobileMenu(menuToggle, navMenu, overlay, body);
                    }
                });
            });
            
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
}

// Politica de privacidade

function setPolitica(aceita) {
    const campo = document.getElementById('politicaMini');
    const btnEnviar = document.querySelector('button[type="submit"]');
    
    campo.value = aceita ? 'sim' : 'nao';
    
    if (!aceita) {
        btnEnviar.disabled = true;
        btnEnviar.style.opacity = '0.6';
        
        // Aviso temporário
        const aviso = document.createElement('span');
        aviso.textContent = ' (selecione "Aceito" para enviar)';
        aviso.style.color = '#E53E3E';
        aviso.style.fontSize = '0.75rem';
        aviso.style.marginLeft = '0.5rem';
        
        // Remove aviso anterior
        const avisoAntigo = document.querySelector('.aviso-mini');
        if (avisoAntigo) avisoAntigo.remove();
        
        aviso.className = 'aviso-mini';
        document.querySelector('.politica-discreta').appendChild(aviso);
        
        setTimeout(() => aviso.remove(), 2000);
    } else {
        btnEnviar.disabled = false;
        btnEnviar.style.opacity = '1';
    }
}

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new TermosPage();
});