document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores ---
    const form = document.getElementById('reserva-form');
    const salaSelectorBtn = document.getElementById('sala-selector-btn');
    const dateSelectorText = document.getElementById('date-selector-text');
    const nativeDateInput = document.getElementById('native-date-input');
    const timeInicioText = document.getElementById('time-inicio-text');
    const nativeTimeInicioInput = document.getElementById('native-time-inicio-input');
    const timeFimText = document.getElementById('time-fim-text');
    const nativeTimeFimInput = document.getElementById('native-time-fim-input');
    const descricaoInput = document.getElementById('descricao');
    const submitButton = document.getElementById('submit-button');
    const salaModal = document.getElementById('sala-modal');
    const salaList = document.getElementById('sala-list');
    const toast = document.getElementById('toast-notification');

    // --- Estado ---
    let selectedSala = '';
    let selectedDate = null;
    let selectedTimeInicio = null;
    let selectedTimeFim = null;
    const salasDisponiveis = [
        'Sala 1 anexo novo', 'Sala 2 anexo novo', 'Anexo 1 Terraço', 'Sala - 1 A, P. Antigo',
        'Sala -1 B, P. Antigo', 'Sala 4 anexo em cima', 'Sala 5 anexo 1 bazar',
        'Sala 6 anexo escritório', 'Nave 1 principal', 'Nave 2 lateral',
    ];

    // --- Funções Auxiliares ---
    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    const updateSubmitButtonState = () => {
        const isValid = selectedSala && selectedDate && selectedTimeInicio && selectedTimeFim;
        submitButton.disabled = !isValid;
    };

    // --- Lógica do Modal de Salas ---
    salaList.innerHTML = salasDisponiveis.map(sala => 
        `<li class="py-4 text-center text-lg text-gray-700 font-medium cursor-pointer hover:bg-gray-200">${sala}</li>`
    ).join('');
    
    salaSelectorBtn.addEventListener('click', () => salaModal.classList.add('visible'));
    salaModal.addEventListener('click', (e) => {
        if (e.target === salaModal) salaModal.classList.remove('visible');
    });
    salaList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            selectedSala = e.target.textContent;
            salaSelectorBtn.textContent = selectedSala;
            salaSelectorBtn.classList.remove('text-gray-500');
            salaSelectorBtn.classList.add('text-gray-900', 'font-semibold');
            salaModal.classList.remove('visible');
            updateSubmitButtonState();
        }
    });

    // --- Lógica dos Inputs ---
    nativeDateInput.addEventListener('change', (e) => {
        const dateValue = e.target.value;
        if (!dateValue) return;

        const tempDate = new Date(dateValue + 'T12:00:00');
        if (tempDate.getDay() === 1) { // Segunda-feira
            showToast('Não é possível reservar às segundas-feiras.');
            e.target.value = '';
            dateSelectorText.textContent = 'Selecione a data';
            dateSelectorText.parentElement.classList.add('text-gray-500');
            selectedDate = null;
        } else {
            selectedDate = new Date(dateValue + 'T00:00:00');
            dateSelectorText.textContent = new Intl.DateTimeFormat('pt-BR').format(selectedDate);
            dateSelectorText.parentElement.classList.remove('text-gray-500');
            dateSelectorText.parentElement.classList.add('text-gray-900', 'font-semibold');
        }
        updateSubmitButtonState();
    });

    const setupTimeInput = (textEl, nativeInput, stateVarSetter) => {
        nativeInput.addEventListener('change', (e) => {
            const [hour, minute] = e.target.value.split(':');
            const newTime = new Date();
            newTime.setHours(hour, minute, 0, 0);
            stateVarSetter(newTime);
            textEl.textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(newTime);
            textEl.parentElement.classList.remove('text-gray-500');
            textEl.parentElement.classList.add('text-gray-900', 'font-semibold');
            updateSubmitButtonState();
        });
    };
    setupTimeInput(timeInicioText, nativeTimeInicioInput, (val) => selectedTimeInicio = val);
    setupTimeInput(timeFimText, nativeTimeFimInput, (val) => selectedTimeFim = val);

    // --- Submissão do Formulário ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalButtonContent = submitButton.innerHTML;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); 
        if (selectedDate < hoje) {
            showToast('Não pode criar uma reserva para uma data passada.');
            return;
        }

        submitButton.innerHTML = '<div class="spinner"></div>';
        submitButton.disabled = true;

        try {
            const novaReserva = {
                sala: selectedSala,
                data: new Intl.DateTimeFormat('pt-BR').format(selectedDate),
                horarioInicio: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(selectedTimeInicio),
                horarioFim: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(selectedTimeFim),
                descricao: descricaoInput.value,
                usuarioId: localStorage.getItem('userId'),
                usuarioNome: localStorage.getItem('nome'),
            };

            // --- AQUI ESTÁ A CORREÇÃO ---
            const response = await fetch('https://salas-app-back-end.onrender.com/api/reservas/criar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaReserva),
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao criar reserva');

            alert('Sucesso! Sua reserva foi criada.');
            history.back();
        } catch (error) {
            showToast(`Erro: ${error.message}`);
        } finally {
            submitButton.innerHTML = originalButtonContent;
            updateSubmitButtonState();
        }
    });
});
