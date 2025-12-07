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
        this.setupDarkMode();
    }

    /**
     * Menu mobile (mesmo das outras páginas)
     */
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

    // Configuração do modo noturno
    setupDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile');
        
        // Aplica tema salvo
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }

        const toggleDarkMode = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            
            // Atualiza ícones
            const icon = isDark ? 'fa-sun' : 'fa-moon';
            const oldIcon = isDark ? 'fa-moon' : 'fa-sun';
            
            document.querySelectorAll('#dark-mode-toggle i, #dark-mode-toggle-mobile i').forEach(i => {
                i.classList.remove(oldIcon);
                i.classList.add(icon);
            });
        };

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleDarkMode);
        }

        if (darkModeToggleMobile) {
            darkModeToggleMobile.addEventListener('click', toggleDarkMode);
        }

        // Sincroniza entre abas
        window.addEventListener('storage', (e) => {
            if (e.key === 'darkMode') {
                document.body.classList.toggle('dark-mode', e.newValue === 'enabled');
            }
        });
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