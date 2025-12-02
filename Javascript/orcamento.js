/**
 * Classe para gerenciar o formulário de orçamento
 * Inclui validação, máscaras e menu responsivo
 */
class OrcamentoForm {
    constructor() {
        this.form = document.getElementById('formOrcamento');
        this.produtoSelect = document.getElementById('produto');
        this.quantidadeInput = document.getElementById('quantidade');
        this.unidadeSelect = document.getElementById('unidade');
        this.unidadeInfo = document.getElementById('unidadeInfo');
        this.submitButton = document.getElementById('submitBtn');
        this.originalButtonHTML = null;
        
        this.init();
    }

    /**
     * Inicializa o formulário
     */
    init() {
        this.setupEventListeners();
        this.updateUnidadeInfo();
        this.setupMobileMenu();
        
        // Salva o HTML original do botão
        this.originalButtonHTML = this.submitButton.innerHTML;
    }

    /**
     * Configura os event listeners do formulário
     */
    setupEventListeners() {
        // Atualiza unidade quando produto muda
        this.produtoSelect.addEventListener('change', () => {
            this.updateUnidadeInfo();
        });

        // Atualiza unidade quando unidade muda
        this.unidadeSelect.addEventListener('change', () => {
            this.updateUnidadeInfo();
        });

        // Submissão do formulário
        this.form.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Formatação de telefone
        document.getElementById('telefone').addEventListener('input', (e) => {
            this.formatarTelefone(e.target);
        });

        // Formatação de CPF/CNPJ
        document.getElementById('documento').addEventListener('input', (e) => {
            this.formatarDocumento(e.target);
        });

        // Reset do formulário
        this.form.addEventListener('reset', () => {
            this.resetButtonState();
        });
    }

    /**
     * Configura o menu mobile responsivo
     */
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;
        
        if (menuToggle) {
            // Cria overlay para menu mobile
            const overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
            
            // Toggle menu ao clicar
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
                overlay.classList.toggle('active');
                body.style.overflow = isExpanded ? '' : 'hidden';
            });
            
            // Fecha menu ao clicar no overlay
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

    /**
     * Fecha o menu mobile
     */
    closeMobileMenu(menuToggle, navMenu, overlay, body) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    /**
     * Formata número de telefone (XX) XXXXX-XXXX
     */
    formatarTelefone(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        
        input.value = value.substring(0, 15);
    }

    /**
     * Formata CPF (XXX.XXX.XXX-XX) ou CNPJ (XX.XXX.XXX/XXXX-XX)
     */
    formatarDocumento(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            value = value.replace(/(\d{2})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1/$2');
            value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }
        
        input.value = value.substring(0, 18);
    }

    /**
     * Atualiza informação da unidade baseada no produto selecionado
     */
    updateUnidadeInfo() {
        const produtoSelecionado = this.produtoSelect.value;
        
        let mensagem = 'Informe a quantidade';

        // Produtos por kg
        if (['sacolas', 'embalagens', 'caixas-empacotamento', 'embalagens-secundarias', 'embalagens-plasticas']
            .includes(produtoSelecionado)) {
            this.unidadeSelect.value = 'kg';
            mensagem = 'Quantidade em quilogramas (kg)';
        } 
        // Produtos por pacote
        else if (['copos', 'canudos', 'pratos', 'talheres', 'potes']
            .includes(produtoSelecionado)) {
            this.unidadeSelect.value = 'pacotes';
            mensagem = 'Quantidade em pacotes (100 unidades cada)';
        } 
        // Produtos variados
        else if (produtoSelecionado === 'variados' || produtoSelecionado === 'personalizado') {
            const unidadeSelecionada = this.unidadeSelect.value;
            switch(unidadeSelecionada) {
                case 'kg':
                    mensagem = 'Quantidade em quilogramas (kg)';
                    break;
                case 'pacotes':
                    mensagem = 'Quantidade em pacotes (100 unidades cada)';
                    break;
                case 'unidades':
                    mensagem = 'Quantidade em unidades individuais';
                    break;
                case 'caixas':
                    mensagem = 'Quantidade em caixas';
                    break;
                default:
                    mensagem = 'Informe a quantidade';
            }
        }

        this.unidadeInfo.textContent = mensagem;
    }

    /**
     * Valida todos os campos do formulário
     * @param {Object} dados - Dados do formulário
     * @returns {Array} Lista de erros encontrados
     */
    validarFormulario(dados) {
        const erros = [];

        // Valida email
        if (!this.validarEmail(dados.email)) {
            erros.push('E-mail inválido');
        }

        // Valida telefone
        if (!this.validarTelefone(dados.telefone)) {
            erros.push('Telefone inválido');
        }

        // Valida CPF/CNPJ
        if (!this.validarDocumento(dados.documento)) {
            erros.push('CPF ou CNPJ inválido');
        }

        // Valida quantidade
        if (dados.quantidade < 1) {
            erros.push('Quantidade deve ser maior que zero');
        }

        return erros;
    }

    /**
     * Valida formato de email
     */
    validarEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    /**
     * Valida número de telefone
     */
    validarTelefone(telefone) {
        const telefoneLimpo = telefone.replace(/\D/g, '');
        return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
    }

    /**
     * Valida CPF (11 dígitos) ou CNPJ (14 dígitos)
     */
    validarDocumento(documento) {
        const docLimpo = documento.replace(/\D/g, '');
        return docLimpo.length === 11 || docLimpo.length === 14;
    }

    /**
     * Exibe mensagens de erro
     */
    mostrarErros(erros) {
        this.removerMensagensErro();
        erros.forEach(erro => {
            this.mostrarNotificacao(erro, 'error');
        });
    }

    /**
     * Remove mensagens de erro existentes
     */
    removerMensagensErro() {
        const mensagensExistentes = document.querySelectorAll('.mensagem-erro');
        mensagensExistentes.forEach(mensagem => {
            mensagem.remove();
        });
    }

    /**
     * Exibe notificação na tela
     */
    mostrarNotificacao(mensagem, tipo = 'info') {
        // Remove notificações existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${tipo}`;
        notification.textContent = mensagem;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            background: ${tipo === 'success' ? '#2E8B57' : 
                        tipo === 'error' ? '#E53E3E' : 
                        tipo === 'warning' ? '#D69E2E' : '#3182CE'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Animação de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    /**
     * Alterna estado de carregamento do botão
     */
    toggleLoading(mostrar) {
        if (mostrar) {
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            this.submitButton.disabled = true;
        } else {
            this.resetButtonState();
        }
    }

    /**
     * Reseta o botão para o estado original
     */
    resetButtonState() {
        if (this.originalButtonHTML) {
            this.submitButton.innerHTML = this.originalButtonHTML;
        } else {
            this.submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Solicitar Orçamento';
        }
        this.submitButton.disabled = false;
    }

    /**
     * Processa a submissão do formulário
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        // Coleta dados do formulário
        const formData = new FormData(this.form);
        const dados = Object.fromEntries(formData.entries());
        
        // Valida dados
        const erros = this.validarFormulario(dados);
        
        if (erros.length > 0) {
            this.mostrarErros(erros);
            return;
        }

        // Simula envio
        this.toggleLoading(true);

        try {
            // Simula delay de rede
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Sucesso
            this.mostrarNotificacao(
                'Orçamento solicitado com sucesso! Entraremos em contato em breve.', 
                'success'
            );
            
            // Reseta formulário
            this.form.reset();
            this.updateUnidadeInfo();
            
        } catch (error) {
            // Erro
            this.mostrarNotificacao(
                'Erro ao enviar orçamento. Tente novamente.', 
                'error'
            );
            
        } finally {
            // IMPORTANTE: Sempre reseta o botão, mesmo em caso de erro
            this.resetButtonState();
        }
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new OrcamentoForm();
});