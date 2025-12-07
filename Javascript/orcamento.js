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
        this.setupDarkMode();
        
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

        // Formatação e validação de CPF/CNPJ
        const documentoInput = document.getElementById('documento');
        if (documentoInput) {
            documentoInput.addEventListener('input', (e) => {
                this.formatarDocumento(e.target);
            });
            documentoInput.addEventListener('blur', (e) => {
                this.validarCampoDocumento(e.target);
            });
        }

        // Validação de email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', (e) => {
                this.validarCampoEmail(e.target);
            });
        }

        // Formatação e busca de CEP
        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                this.formatarCEP(e.target);
            });
            cepInput.addEventListener('blur', (e) => {
                this.buscarCEP(e.target.value);
            });
        }

        // Reset do formulário
        this.form.addEventListener('reset', () => {
            this.resetButtonState();
        });
    }

    /**
     * Valida campo de email visualmente
     */
    validarCampoEmail(input) {
        const email = input.value.trim();
        const emailStatus = input.nextElementSibling;
        
        if (!email) return;
        
        if (!this.validarEmail(email)) {
            input.style.borderColor = '#dc3545';
            input.style.backgroundColor = '#fff5f5';
            if (emailStatus && emailStatus.classList.contains('email-status')) {
                emailStatus.textContent = 'E-mail inválido';
                emailStatus.style.color = '#dc3545';
            }
        } else {
            input.style.borderColor = '#38A169';
            input.style.backgroundColor = '#f0fff4';
            if (emailStatus && emailStatus.classList.contains('email-status')) {
                emailStatus.textContent = 'E-mail válido';
                emailStatus.style.color = '#38A169';
            }
        }
    }

    /**
     * Valida campo de documento visualmente
     */
    validarCampoDocumento(input) {
        const documento = input.value;
        const docLimpo = documento.replace(/\D/g, '');
        const docStatus = input.nextElementSibling;
        
        if (!documento) return;
        
        let mensagem = '';
        let valido = false;
        
        if (docLimpo.length === 11) {
            valido = this.validarCPF(docLimpo);
            mensagem = valido ? 'CPF válido' : 'CPF inválido';
        } else if (docLimpo.length === 14) {
            valido = this.validarCNPJ(docLimpo);
            mensagem = valido ? 'CNPJ válido' : 'CNPJ inválido';
        } else {
            mensagem = 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos';
        }
        
        if (valido) {
            input.style.borderColor = '#38A169';
            input.style.backgroundColor = '#f0fff4';
            if (docStatus && docStatus.classList.contains('doc-status')) {
                docStatus.textContent = mensagem;
                docStatus.style.color = '#38A169';
            }
        } else {
            input.style.borderColor = '#dc3545';
            input.style.backgroundColor = '#fff5f5';
            if (docStatus && docStatus.classList.contains('doc-status')) {
                docStatus.textContent = mensagem;
                docStatus.style.color = '#dc3545';
            }
        }
    }

    /**
     * Formata CEP (XXXXX-XXX)
     */
    formatarCEP(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        input.value = value.substring(0, 9);
    }

    /**
     * Busca endereço pela API ViaCEP
     */
    async buscarCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        const cepStatus = document.getElementById('cepStatus');
        
        if (cepLimpo.length !== 8) {
            return;
        }

        cepStatus.textContent = 'Buscando CEP...';
        cepStatus.style.color = '#2E8B57';

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const dados = await response.json();

            if (dados.erro) {
                cepStatus.textContent = 'CEP não encontrado';
                cepStatus.style.color = '#dc3545';
                return;
            }

            // Preenche os campos automaticamente
            document.getElementById('rua').value = dados.logradouro || '';
            document.getElementById('bairro').value = dados.bairro || '';
            document.getElementById('cidade').value = dados.localidade || '';
            document.getElementById('estado').value = dados.uf || '';

            cepStatus.textContent = 'CEP encontrado!';
            cepStatus.style.color = '#2E8B57';

            // Foca no campo número
            setTimeout(() => {
                document.getElementById('numero').focus();
            }, 100);

        } catch (error) {
            cepStatus.textContent = 'Erro ao buscar CEP';
            cepStatus.style.color = '#dc3545';
            console.error('Erro ao buscar CEP:', error);
        }
    }

    /**
     * Configura o menu mobile responsivo
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
     * Valida CPF (11 dígitos) ou CNPJ (14 dígitos) com dígitos verificadores
     */
    validarDocumento(documento) {
        const docLimpo = documento.replace(/\D/g, '');
        
        if (docLimpo.length === 11) {
            return this.validarCPF(docLimpo);
        } else if (docLimpo.length === 14) {
            return this.validarCNPJ(docLimpo);
        }
        return false;
    }

    /**
     * Valida CPF
     */
    validarCPF(cpf) {
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // Valida primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        // Valida segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    /**
     * Valida CNPJ
     */
    validarCNPJ(cnpj) {
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        // Valida primeiro dígito verificador
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;

        // Valida segundo dígito verificador
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1))) return false;

        return true;
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

    // Configuração do modo noturno
    setupDarkMode() {
        const toggleDarkMode = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        };

        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }

        ['dark-mode-toggle', 'dark-mode-toggle-mobile'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', toggleDarkMode);
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'darkMode') {
                document.body.classList.toggle('dark-mode', e.newValue === 'enabled');
            }
        });
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new OrcamentoForm();
});