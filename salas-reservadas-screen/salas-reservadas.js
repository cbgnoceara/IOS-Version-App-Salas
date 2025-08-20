document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');
    const loadingState = document.getElementById('loading-state');
    const logoutButton = document.getElementById('logout-button');
    
    // --- Elementos do Modal de Confirmação ---
    const confirmModal = document.getElementById('confirm-modal');
    const confirmModalTitle = document.getElementById('confirm-modal-title');
    const confirmModalText = document.getElementById('confirm-modal-text');
    const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    let acaoConfirmadaCallback = null;


    const buscarReservas = async () => {
        try {
            const response = await fetch('https://salas-app-back-end.onrender.com/api/reservas/listar');
            if (!response.ok) throw new Error('Falha ao carregar dados.');
            
            const reservas = await response.json();

            const parseDate = (dateString) => {
                const [day, month, year] = dateString.split('/');
                return new Date(year, month - 1, day);
            };

            reservas.sort((a, b) => parseDate(a.data) - parseDate(b.data));

            renderReservas(reservas);
        } catch (error) {
            console.error(error);
            if(loadingState) loadingState.innerHTML = `<p class="text-red-600">${error.message}</p>`;
        }
    };

    const renderReservas = (reservas) => {
        if (loadingState) loadingState.remove();
        contentContainer.innerHTML = '';

        if (reservas.length === 0) {
            contentContainer.innerHTML = `
                <div class="text-center py-16 px-4 bg-white rounded-2xl shadow-sm">
                    <i class="ri-calendar-off-line text-6xl text-gray-400 mb-4"></i>
                    <h3 class="font-bold text-gray-800 text-lg">Nenhuma sala reservada</h3>
                    <p class="text-gray-500 mt-1">O espaço está todo livre no momento.</p>
                </div>
            `;
            return;
        }

        reservas.forEach((item, index) => {
            const cardLink = document.createElement('a');
            cardLink.href = `../reserva-detalhe-screen/reserva-detalhe.html?reserva=${encodeURIComponent(JSON.stringify(item))}`;
            cardLink.className = 'list-card card-enter';
            cardLink.style.animationDelay = `${index * 80}ms`;

            cardLink.innerHTML = `
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <i class="ri-building-line text-2xl"></i>
                </div>
                <div class="flex-grow">
                    <p class="font-bold text-gray-800">${item.sala}</p>
                    <p class="text-sm text-gray-500">${item.data} - ${item.horarioInicio}</p>
                    <p class="text-sm text-gray-500 mt-1">Por: <span class="font-semibold">${item.usuarioNome}</span></p>
                </div>
                <i class="ri-arrow-right-s-line text-2xl text-gray-400"></i>
            `;
            contentContainer.appendChild(cardLink);
        });
    };

    // --- LÓGICA DE LOGOUT ---
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/index.html';
    };

    const openConfirmModal = ({ title, text, confirmText, onConfirm }) => {
        confirmModalTitle.textContent = title;
        confirmModalText.textContent = text;
        confirmActionBtn.textContent = confirmText;
        acaoConfirmadaCallback = onConfirm;
        confirmModal.classList.add('visible');
    };
    const closeConfirmModal = () => {
        confirmModal.classList.remove('visible');
        acaoConfirmadaCallback = null;
    };

    logoutButton.addEventListener('click', () => {
        openConfirmModal({
            title: 'Confirmar Saída',
            text: 'Tem certeza que deseja sair da sua conta?',
            confirmText: 'Sair',
            onConfirm: handleLogout
        });
    });
    
    confirmActionBtn.addEventListener('click', () => {
        if (acaoConfirmadaCallback) acaoConfirmadaCallback();
    });
    cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    
    // --- INICIALIZAÇÃO ---
    buscarReservas();
});