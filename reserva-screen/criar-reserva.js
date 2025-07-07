document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const form = document.getElementById('reserva-form');
    const salaSelectorBtn = document.getElementById('sala-selector-btn');
    const salaSelectorText = document.getElementById('sala-selector-text');
    
    // Elementos de Data e Hora
    const dateSelectorText = document.getElementById('date-selector-text');
    const nativeDateInput = document.getElementById('native-date-input');
    const timeInicioText = document.getElementById('time-inicio-text');
    const nativeTimeInicioInput = document.getElementById('native-time-inicio-input');
    const timeFimText = document.getElementById('time-fim-text');
    const nativeTimeFimInput = document.getElementById('native-time-fim-input');
    
    const descricaoInput = document.getElementById('descricao');
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.getElementById('button-text');
    const buttonSpinner = document.getElementById('button-spinner');
    
    // Modal
    const salaModal = document.getElementById('sala-modal');
    const salaList = document.getElementById('sala-list');

    // --- Estado e Dados ---
    let selectedSala = '';
    let selectedDate = null;
    let selectedTimeInicio = null;
    let selectedTimeFim = null;

    const salasDisponiveis = [
        'Sala 1 anexo novo', 'Sala 2 anexo novo', 'Anexo 1 Terraço', 'Sala - 1 A, P. Antigo',
        'Sala -1 B, P. Antigo', 'Sala 4 anexo em cima', 'Sala 5 anexo 1 bazar',
        'Sala 6 anexo escritório', 'Nave 1 principal', 'Nave 2 lateral',
    ];

    // --- Funções ---
    const formatarData = (date) => new Intl.DateTimeFormat('pt-BR').format(date);
    const formatarHora = (date) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);

    const updateSubmitButtonState = () => {
        submitButton.disabled = !(selectedSala && selectedDate && selectedTimeInicio && selectedTimeFim);
    };

    // --- Lógica do Modal de Salas ---
    salaList.innerHTML = salasDisponiveis.map(sala => 
        `<li class="modal-item"><span class="modal-item-text">${sala}</span></li>`
    ).join('');
    
    salaSelectorBtn.addEventListener('click', () => salaModal.classList.add('visible'));
    salaModal.addEventListener('click', (e) => {
        if (e.target === salaModal) salaModal.classList.remove('visible');
    });
    salaList.addEventListener('click', (e) => {
        const item = e.target.closest('.modal-item');
        if (item) {
            selectedSala = item.textContent;
            salaSelectorText.textContent = selectedSala;
            salaSelectorText.classList.remove('placeholder-text');
            salaSelectorText.classList.add('input-text');
            salaModal.classList.remove('visible');
            updateSubmitButtonState();
        }
    });

    // --- Lógica dos Seletores de Data e Hora ---
    // A interação é feita pelo <label> no HTML. O JS apenas escuta as mudanças.
    nativeDateInput.addEventListener('change', (e) => {
        const dateValue = e.target.value;
        // Cria uma data temporária para verificação. Usar T12:00:00 evita problemas de fuso.
        const tempDate = new Date(dateValue + 'T12:00:00');

        // *** INÍCIO DA ALTERAÇÃO ***
        // getDay() retorna 0 para Domingo, 1 para Segunda, 2 para Terça, etc.
        if (tempDate.getDay() === 1) {
            // 1. Exibe a mensagem solicitada.
            alert('Por ordens do Pastor, não é possível reservar salas as segundas feiras.');

            // 2. Limpa a seleção de data para impedir o agendamento.
            e.target.value = ''; // Limpa o valor do input nativo.
            dateSelectorText.textContent = 'Clique para selecionar a data';
            dateSelectorText.classList.add('placeholder-text');
            dateSelectorText.classList.remove('input-text');
            selectedDate = null;
            updateSubmitButtonState(); // Atualiza o estado do botão
            return; // Interrompe a execução da função para não salvar a data inválida.
        }
        // *** FIM DA ALTERAÇÃO ***

        selectedDate = new Date(dateValue + 'T00:00:00'); // Lógica original para datas válidas.
        dateSelectorText.textContent = formatarData(selectedDate);
        dateSelectorText.classList.remove('placeholder-text');
        dateSelectorText.classList.add('input-text');
        updateSubmitButtonState();
    });


    nativeTimeInicioInput.addEventListener('change', (e) => {
        const [hour, minute] = e.target.value.split(':');
        selectedTimeInicio = new Date();
        selectedTimeInicio.setHours(hour, minute, 0, 0);
        timeInicioText.textContent = formatarHora(selectedTimeInicio);
        timeInicioText.classList.remove('placeholder-text');
        timeInicioText.classList.add('input-text');
        updateSubmitButtonState();
    });

    nativeTimeFimInput.addEventListener('change', (e) => {
        const [hour, minute] = e.target.value.split(':');
        selectedTimeFim = new Date();
        selectedTimeFim.setHours(hour, minute, 0, 0);
        timeFimText.textContent = formatarHora(selectedTimeFim);
        timeFimText.classList.remove('placeholder-text');
        timeFimText.classList.add('input-text');
        updateSubmitButtonState();
    });

    // --- Lógica de Submissão do Formulário ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validação
        if (!selectedSala || !selectedDate || !selectedTimeInicio || !selectedTimeFim) {
            alert('Erro: Por favor, preencha a sala, data e horários.');
            return;
        }
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); 
        if (selectedDate < hoje) {
            alert('Data Inválida: Você não pode criar uma reserva para uma data que já passou.');
            return;
        }

        // Estado de Loading
        buttonText.style.display = 'none';
        buttonSpinner.style.display = 'block';
        submitButton.disabled = true;

        try {
            const usuarioId = localStorage.getItem('userId');
            const usuarioNome = localStorage.getItem('nome');
            const novaReserva = {
                sala: selectedSala,
                data: formatarData(selectedDate),
                horarioInicio: formatarHora(selectedTimeInicio),
                horarioFim: formatarHora(selectedTimeFim),
                descricao: descricaoInput.value,
                usuarioId,
                usuarioNome,
            };

            const response = await fetch('https://salas-app-back-end.onrender.com/api/reservas/criar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaReserva),
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao criar reserva');

            alert('Sucesso! Sua reserva foi criada com sucesso.');
            history.back();
        } catch (error) {
            alert(`Erro: ${error.message}`);
        } finally {
            // Restaura o botão
            buttonText.style.display = 'inline';
            buttonSpinner.style.display = 'none';
            updateSubmitButtonState();
        }
    });

    // --- Inicialização ---
    updateSubmitButtonState();
});
