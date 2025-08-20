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

    const buscarUsuarios = async () => {
        try {
            const meuId = localStorage.getItem('userId');
            const response = await fetch('https://salas-app-back-end.onrender.com/api/users/listar-todos');
            if (!response.ok) throw new Error('Falha ao carregar usuários.');
            
            const usuarios = await response.json();
            renderUsuarios(usuarios, meuId);
        } catch (error) {
            console.error(error);
            if(loadingState) {
                loadingState.innerHTML = `<p class="text-red-600 font-semibold">${error.message}</p>`;
            }
        }
    };

    const renderUsuarios = (usuarios, meuId) => {
        if (loadingState) loadingState.remove();
        contentContainer.innerHTML = '';

        if (usuarios.length === 0) {
            contentContainer.innerHTML = `<p class="text-center text-gray-500 py-10">Nenhum usuário encontrado.</p>`;
            return;
        }

        usuarios.forEach((item, index) => {
            const card = document.createElement('div');
            // ATUALIZAÇÃO: Usando a nova classe .user-card
            card.className = 'user-card card-enter';
            card.style.animationDelay = `${index * 80}ms`;

            const isCurrentUser = item._id === meuId;
            
            const fotoHtml = (item.fotoPerfil && item.fotoPerfil !== 'undefined') 
                ? `<img src="${item.fotoPerfil}" alt="Foto de ${item.nome}" class="user-avatar">`
                : `<div class="user-avatar-placeholder"><i class="ri-user-line"></i></div>`;

            card.innerHTML = `
                ${fotoHtml}
                <div class="flex-grow">
                    <p class="font-bold text-gray-800">${item.nome} ${item.sobrenome || ''}</p>
                </div>
                ${isCurrentUser ? '<span class="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Você</span>' : ''}
            `;
            contentContainer.appendChild(card);
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
    buscarUsuarios();
});