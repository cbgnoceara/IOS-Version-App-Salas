// home.js

document.addEventListener('DOMContentLoaded', () => {
    // --- VERIFICAÇÃO DE LOGIN ---
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
        window.location.href = '/sessao_expirada/sessao-expirada.html';
        return;
    }

    // --- SELETORES DE ELEMENTOS ---
    const welcomeTitle = document.getElementById('welcome-title');
    const profileImageHeader = document.getElementById('profile-image-header');
    const reservasContainer = document.getElementById('reservas-container');
    const loadingState = document.getElementById('loading-state');
    
    // Perfil
    const profileButton = document.getElementById('profile-button');
    const profileModal = document.getElementById('profile-modal');
    const profileImageModal = document.getElementById('profile-image-modal');
    const modalUsername = document.getElementById('modal-username');
    const editPhotoButton = document.getElementById('edit-photo-button');
    const closeProfileModalBtn = document.getElementById('close-profile-modal-btn');
    const photoInput = document.getElementById('photo-input');

    // Modal de Confirmação
    const confirmModal = document.getElementById('confirm-modal');
    const confirmModalTitle = document.getElementById('confirm-modal-title');
    const confirmModalText = document.getElementById('confirm-modal-text');
    const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    
    // Ações
    const logoutButton = document.getElementById('logout-button');

    // --- ESTADO DA APLICAÇÃO ---
    let reservaIdParaDeletar = null;
    let acaoConfirmadaCallback = null;
    const cardColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];

    // --- FUNÇÕES PRINCIPAIS ---

    /**
     * Carrega dados do usuário do localStorage e atualiza a UI.
     */
    const carregarDadosUsuario = () => {
        const nome = localStorage.getItem('nome');
        const fotoUrl = localStorage.getItem('fotoUrl');

        if (nome) {
            const primeiroNome = nome.split(' ')[0];
            welcomeTitle.textContent = `Olá, ${primeiroNome}!`;
            modalUsername.textContent = primeiroNome;
        }

        const placeholderImg = 'https://placehold.co/96x96/E2E8F0/4A5568?text=P';
        const fotoFinal = (fotoUrl && fotoUrl !== 'undefined') ? fotoUrl : placeholderImg;
        
        profileImageHeader.src = fotoFinal.replace('96x96', '48x48');
        profileImageModal.src = fotoFinal;
    };

    /**
     * Faz o upload da foto selecionada para o servidor.
     */
    const uploadFoto = async (file) => {
        const formData = new FormData();
        formData.append('foto', file);
        const originalButtonText = editPhotoButton.innerHTML;
        
        try {
            editPhotoButton.innerHTML = '<div class="spinner !w-6 !h-6 !border-2 !border-b-white"></div>';
            editPhotoButton.disabled = true;

            const response = await fetch(`https://salas-app-back-end.onrender.com/api/users/upload-foto/${usuarioId}`, {
                method: 'POST', body: formData,
            });

            if (!response.ok) throw new Error((await response.json()).message || 'Falha no upload.');

            const data = await response.json();
            localStorage.setItem('fotoUrl', data.user.fotoPerfil);
            carregarDadosUsuario();
            closeProfileModal();

        } catch (error) {
            console.error('Erro no upload:', error);
            alert(`Erro: ${error.message}`);
        } finally {
            editPhotoButton.innerHTML = originalButtonText;
            editPhotoButton.disabled = false;
        }
    };

    /**
     * Busca as reservas do usuário na API.
     */
    const buscarMinhasReservas = async () => {
        try {
            const response = await fetch(`https://salas-app-back-end.onrender.com/api/reservas/minhas/${usuarioId}`);
            if (!response.ok) throw new Error('Não foi possível carregar suas reservas.');
            const reservas = await response.json();
            renderReservas(reservas);
        } catch (error) {
            console.error('Erro ao buscar reservas:', error);
            renderError(error.message);
        }
    };
    
    /**
     * Renderiza os cards de reserva na tela.
     */
    const renderReservas = (reservas) => {
        // Se o loading ainda existir, remove
        const currentLoading = document.getElementById('loading-state');
        if(currentLoading) currentLoading.remove(); 
        
        reservasContainer.innerHTML = ''; 

        if (reservas.length === 0) {
            reservasContainer.innerHTML = `
                <div class="text-center py-16 px-4 bg-white rounded-2xl shadow-sm">
                    <i class="ri-calendar-check-line text-6xl text-blue-400 mb-4"></i>
                    <h3 class="font-bold text-gray-800 text-lg">Nenhum evento agendado</h3>
                    <p class="text-gray-500 mt-1">Você está livre! Que tal criar uma nova reserva?</p>
                </div>
            `;
            return;
        }

        reservas.sort((a, b) => new Date(a.data.split('/').reverse().join('-')) - new Date(b.data.split('/').reverse().join('-')));

        reservas.forEach((reserva, index) => {
            const card = document.createElement('div');
            card.className = 'reserva-card card-enter';
            card.id = `reserva-${reserva._id}`;
            card.style.animationDelay = `${index * 100}ms`;

            const randomColor = cardColors[index % cardColors.length];

            card.innerHTML = `
                <div class="card-color-bar ${randomColor}"></div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-lg text-gray-800">${reserva.sala}</h3>
                        <button data-id="${reserva._id}" class="delete-button text-gray-400 hover:text-red-500 transition-colors p-1 -mt-2 -mr-2 flex-shrink-0">
                            <i class="ri-close-circle-line text-2xl"></i>
                        </button>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 mt-2 text-sm">
                        <span class="flex items-center gap-1.5"><i class="ri-calendar-2-line"></i> ${reserva.data}</span>
                        <span class="flex items-center gap-1.5"><i class="ri-time-line"></i> ${reserva.horarioInicio} - ${reserva.horarioFim}</span>
                    </div>
                    ${reserva.descricao ? `<p class="text-gray-500 mt-3 text-sm bg-gray-100 p-3 rounded-lg">${reserva.descricao}</p>` : ''}
                </div>
            `;
            reservasContainer.appendChild(card);
        });
    };

    /**
     * Renderiza uma mensagem de erro.
     */
    const renderError = (message) => {
         const currentLoading = document.getElementById('loading-state');
         if(currentLoading) currentLoading.remove();
         reservasContainer.innerHTML = `
            <div class="text-center py-10 px-4 bg-red-50 rounded-2xl border border-red-200">
                <i class="ri-error-warning-line text-5xl text-red-400 mb-3"></i>
                <p class="font-semibold text-red-700">Ocorreu um erro</p>
                <p class="text-sm text-red-600 mt-1">${message}</p>
            </div>
        `;
    }

    /**
     * Lida com a exclusão de uma reserva.
     */
    const handleDeletarReserva = async (reservaId) => {
        const originalButtonText = confirmActionBtn.textContent;
        try {
            confirmActionBtn.disabled = true;
            confirmActionBtn.textContent = 'Cancelando...';

            const response = await fetch(`https://salas-app-back-end.onrender.com/api/reservas/deletar/${reservaId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: usuarioId })
            });
            if (!response.ok) throw new Error('Falha ao cancelar a reserva.');

            const itemParaRemover = document.getElementById(`reserva-${reservaId}`);
            if (itemParaRemover) {
                itemParaRemover.style.transition = 'all 0.3s ease';
                itemParaRemover.style.opacity = '0';
                itemParaRemover.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    itemParaRemover.remove();
                    if (reservasContainer.children.length === 0) renderReservas([]);
                }, 300);
            }
        } catch (error) {
            console.error('Erro ao deletar reserva:', error);
            alert('Não foi possível cancelar a reserva.');
        } finally {
            closeConfirmModal();
            confirmActionBtn.disabled = false;
            confirmActionBtn.textContent = originalButtonText;
        }
    };

    /**
     * Lida com o logout do usuário.
     */
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/index.html';
    };
    
    // --- FUNÇÕES DOS MODAIS ---
    const openProfileModal = () => profileModal.classList.add('visible');
    const closeProfileModal = () => profileModal.classList.remove('visible');

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
    
    // --- EVENT LISTENERS ---
    
    // Perfil
    profileButton.addEventListener('click', openProfileModal);
    closeProfileModalBtn.addEventListener('click', closeProfileModal);
    editPhotoButton.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', (e) => e.target.files[0] && uploadFoto(e.target.files[0]));

    // Delegação de eventos para botões de deletar
    reservasContainer.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-button');
        if (deleteButton) {
            reservaIdParaDeletar = deleteButton.dataset.id;
            openConfirmModal({
                title: 'Cancelar Reserva',
                text: 'Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.',
                confirmText: 'Sim, cancelar',
                onConfirm: () => handleDeletarReserva(reservaIdParaDeletar)
            });
        }
    });

    // Modal de Confirmação
    confirmActionBtn.addEventListener('click', () => {
        if (acaoConfirmadaCallback) acaoConfirmadaCallback();
    });
    cancelConfirmBtn.addEventListener('click', closeConfirmModal);

    // Logout
    logoutButton.addEventListener('click', () => {
        openConfirmModal({
            title: 'Confirmar Saída',
            text: 'Tem certeza que deseja sair da sua conta?',
            confirmText: 'Sair',
            onConfirm: handleLogout
        });
    });

    // --- NOVA LÓGICA DE ATUALIZAÇÃO AUTOMÁTICA ---
    document.addEventListener('visibilitychange', () => {
        // Se a página se tornar visível novamente, busca as reservas.
        if (document.visibilityState === 'visible') {
            buscarMinhasReservas();
        }
    });

    // --- INICIALIZAÇÃO ---
    carregarDadosUsuario();
    buscarMinhasReservas();
});
