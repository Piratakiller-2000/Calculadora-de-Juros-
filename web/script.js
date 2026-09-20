let activeInput = document.getElementById('initial-amount');
let lastCalculationResult = null;

const currencyConfigs = {
    'BRL': { locale: 'pt-BR', symbol: 'R$', decimalSep: ',', thousandSep: '.' },
    'USD': { locale: 'en-US', symbol: '$', decimalSep: '.', thousandSep: ',' },
    'EUR': { locale: 'de-DE', symbol: '€', decimalSep: ',', thousandSep: '.' },
    'GBP': { locale: 'en-GB', symbol: '£', decimalSep: '.', thousandSep: ',' }
};

function getSelectedCurrencyConfig() {
    const currencySelect = document.getElementById('currency-select');
    const currencyCode = currencySelect ? currencySelect.value : 'BRL';
    return currencyConfigs[currencyCode] || currencyConfigs['BRL'];
}

function updateCurrencySymbol() {
    const config = getSelectedCurrencyConfig();
    
    // Atualiza os símbolos de moeda nas labels
    document.querySelectorAll('.currency-symbol').forEach(span => {
        span.textContent = config.symbol;
    });

    // --- NOVA LÓGICA DE LIMPEZA AO TROCAR MOEDA ---
    
    // 1. Zera a variável de resultados anteriores
    lastCalculationResult = null;

    // 2. Zera todos os campos de entrada, exceto o Período que volta para 1
    const inputs = document.querySelectorAll('.calc-input');
    inputs.forEach(input => {
        if (input.id === 'period') {
            input.value = '1';
        } else {
            input.value = '0';
        }
    });

    // 3. Zera os painéis de resultado usando o formato da nova moeda
    document.getElementById('res-invested').textContent = formatCurrency(0);
    document.getElementById('res-interest').textContent = formatCurrency(0);
    document.getElementById('res-total').textContent = formatCurrency(0);

    // 4. Limpa a Tabela Evolutiva, voltando para a mensagem padrão
    const tableBody = document.getElementById('table-body');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-msg">Realize o cálculo para visualizar a evolução.</td>
            </tr>
        `;
    }

    // 5. Esconde qualquer alerta de erro que estivesse na tela
    hideAlert();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

const inputs = document.querySelectorAll('.calc-input');
inputs.forEach(input => {
    input.addEventListener('click', (e) => {
        setActiveInput(e.target);
    });
});

function setActiveInput(targetInput) {
    inputs.forEach(i => i.classList.remove('active'));
    targetInput.classList.add('active');
    activeInput = targetInput;
}

/**
 * Alterna a visualização entre os campos de Taxa Fixa e CDI
 */
function toggleRateInputs() {
    const type = document.getElementById('rate-type').value;
    const fixedGroup = document.getElementById('fixed-rate-group');
    const cdiGroup = document.getElementById('cdi-rate-group');

    if (type === 'cdi') {
        fixedGroup.classList.add('hidden');
        cdiGroup.classList.remove('hidden');
        setActiveInput(document.getElementById('cdi-percentage'));
    } else {
        cdiGroup.classList.add('hidden');
        fixedGroup.classList.remove('hidden');
        setActiveInput(document.getElementById('interest-rate'));
    }
}

/**
 * Adiciona caractere aplicando o separador decimal correto da moeda escolhida.
 */
function appendChar(char) {
    hideAlert();
    const config = getSelectedCurrencyConfig();
    let val = activeInput.value;

    // Se pressionar ponto ou vírgula
    if (char === '.' || char === ',') {
        if (activeInput.id === 'period') return; // Campo de tempo só aceita inteiros
        
        // Se já tiver o separador decimal da moeda no campo, ignora
        if (val.includes(config.decimalSep)) return;

        activeInput.value += config.decimalSep;
        return;
    }

    // Se for número (0-9)
    if (/^[0-9]$/.test(char)) {
        if (val === '0') {
            activeInput.value = char;
        } else {
            activeInput.value += char;
        }
        formatInputField(activeInput);
    }
}

/**
 * Formata os milhares e decimais automaticamente em tempo real segundo a moeda ativa
 */
function formatInputField(input) {
    let val = input.value;
    if (!val || input.id === 'period') return;

    const config = getSelectedCurrencyConfig();

    // Se o utilizador estiver a digitar a parte decimal (centavos)
    if (val.includes(config.decimalSep)) {
        let parts = val.split(config.decimalSep);
        let rawInteger = parts[0].replace(/\D/g, '');
        let decimalPart = parts[1];

        if (!rawInteger) rawInteger = '0';

        let formattedInteger = parseInt(rawInteger, 10).toLocaleString(config.locale);
        
        if (decimalPart !== undefined) {
            decimalPart = decimalPart.slice(0, 2); // Limita a 2 casas decimais
        }

        input.value = `${formattedInteger}${config.decimalSep}${decimalPart}`;
        return;
    }

    // Formata a parte inteira (milhares)
    let rawInteger = val.replace(/\D/g, '');
    if (!rawInteger) rawInteger = '0';
    input.value = parseInt(rawInteger, 10).toLocaleString(config.locale);
}

function deleteChar() {
    hideAlert();
    let val = activeInput.value;
    if (val.length <= 1) {
        activeInput.value = '0';
    } else {
        activeInput.value = val.slice(0, -1);
        formatInputField(activeInput);
    }
}

function clearActiveField() {
    hideAlert();
    activeInput.value = '0';
}

function showAlert(message) {
    const alertBox = document.getElementById('alert-box');
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
}

function hideAlert() {
    document.getElementById('alert-box').classList.add('hidden');
}

/**
 * Converte a entrada formatada de qualquer moeda para Float numérico no Python
 */
function parseInputValue(valueStr) {
    if (!valueStr) return 0;

    const config = getSelectedCurrencyConfig();
    let clean = valueStr.toString().trim();

    // Remove os separadores de milhar de acordo com a moeda
    if (config.thousandSep === '.') {
        clean = clean.replace(/\./g, '');
    } else {
        clean = clean.replace(/,/g, '');
    }

    // Converte o separador decimal da moeda no ponto do Python
    clean = clean.replace(config.decimalSep, '.');

    return parseFloat(clean) || 0;
}

function formatCurrency(value) {
    const config = getSelectedCurrencyConfig();
    const currencySelect = document.getElementById('currency-select');
    const currencyCode = currencySelect ? currencySelect.value : 'BRL';
    return value.toLocaleString(config.locale, { style: 'currency', currency: currencyCode });
}

function changeTableMode() {
    if (!lastCalculationResult) return;

    const mode = document.getElementById('view-mode').value;
    const periodHeader = document.getElementById('period-header');

    if (mode === 'annual') {
        periodHeader.textContent = "Ano";
        renderTableData(lastCalculationResult.annual_schedule);
    } else {
        periodHeader.textContent = "Mês";
        renderTableData(lastCalculationResult.monthly_schedule);
    }
}

function renderTableData(schedule) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    schedule.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.period}</td>
            <td>${formatCurrency(item.interest)}</td>
            <td>${formatCurrency(item.total_invested)}</td>
            <td><strong>${formatCurrency(item.total_accumulated)}</strong></td>
        `;
        tableBody.appendChild(row);
    });
}

async function calculate() {
    hideAlert();

    const initialAmount = parseInputValue(document.getElementById('initial-amount').value);
    const monthlyDeposit = parseInputValue(document.getElementById('monthly-deposit').value);
    const period = parseInputValue(document.getElementById('period').value);
    const isAnnualPeriod = document.getElementById('period-unit').value === 'year';
    
    // Captura os novos campos de rentabilidade
    const rateType = document.getElementById('rate-type').value;
    const interestRate = parseInputValue(document.getElementById('interest-rate').value);
    const cdiAnnual = parseInputValue(document.getElementById('cdi-annual').value);
    const cdiPercentage = parseInputValue(document.getElementById('cdi-percentage').value);

    if (isNaN(initialAmount) || isNaN(monthlyDeposit) || isNaN(period)) {
        showAlert("Preencha todos os campos com números válidos.");
        return;
    }

    try {
        // Envia os parâmetros na ordem correta exigida pelo novo main.py
        const result = await pywebview.api.calculate_compound_interest(
            initialAmount,
            monthlyDeposit,
            period,
            isAnnualPeriod,
            rateType,
            interestRate,
            cdiAnnual,
            cdiPercentage
        );

        if (!result.success) {
            showAlert(result.error);
            return;
        }

        lastCalculationResult = result;

        document.getElementById('res-invested').textContent = formatCurrency(result.total_invested);
        document.getElementById('res-interest').textContent = formatCurrency(result.total_interest);
        document.getElementById('res-total').textContent = formatCurrency(result.final_amount);

        const viewModeSelect = document.getElementById('view-mode');
        if (isAnnualPeriod) {
            viewModeSelect.value = 'annual';
        } else {
            viewModeSelect.value = 'monthly';
        }

        changeTableMode();

    } catch (error) {
        showAlert("Erro de comunicação com o Python.");
    }
}

// Inicializa as configurações ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateCurrencySymbol();
    toggleRateInputs(); // Garante que apenas os campos corretos apareçam no arranque
});

// Suporte ao teclado físico com formatação automática
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (/^[0-9]$/.test(key)) {
        appendChar(key);
    } else if (key === '.' || key === ',' || key === 'Decimal') {
        event.preventDefault();
        const config = getSelectedCurrencyConfig();
        appendChar(config.decimalSep);
    } else if (key === 'Backspace') {
        deleteChar();
    } else if (key === 'Delete' || key === 'Escape') {
        clearActiveField();
    } else if (key === 'Enter') {
        event.preventDefault();
        calculate();
    }
});