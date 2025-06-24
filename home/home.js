document.addEventListener('DOMContentLoaded', () => {
    // --- ALTERAÇÃO AQUI ---
    // Este é o bloco de verificação de Login modificado.
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
        // Se não houver 'userId', redireciona para a nova tela de sessão expirada.
        // O alert foi removido.
        window.location.href = '/sessao_expirada/sessao-expirada.html';
        
        // Impede que o resto do script seja executado.
        return; 
    }
    
    // --- O restante do código só executa se o usuário estiver logado ---

    // --- Elementos do DOM ---
    const mainContent = document.getElementById('main-content');
    const welcomeTitle = document.getElementById('welcome-title');
    const profileButton = document.getElementById('profile-button');
    const profileModal = document.getElementById('profile-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const editPhotoButton = document.getElementById('edit-photo-button');
    const photoInput = document.getElementById('photo-input');
    const logoutButton = document.getElementById('logout-button');
    
    // Elementos de imagem e ícone
    const profileImageHeader = document.getElementById('profile-image-header');
    const profileIconDefault = document.getElementById('profile-icon-default');
    const profileImageModal = document.getElementById('profile-image-modal');
    const modalIconDefault = document.getElementById('modal-icon-default');
    const modalUsername = document.getElementById('modal-username');

    // --- Funções ---

    // Carrega dados do usuário do localStorage e atualiza a UI
    const carregarDadosUsuario = () => {
        const nome = localStorage.getItem('nome');
        const fotoUrl = localStorage.getItem('fotoUrl');

        if (nome) {
            const primeiroNome = nome.split(' ')[0];
            welcomeTitle.textContent = `Olá, bem-vindo, ${primeiroNome}!`;
            modalUsername.textContent = primeiroNome;
        }

        if (fotoUrl) {
            profileImageHeader.src = fotoUrl;
            profileImageHeader.style.display = 'block';
            profileIconDefault.style.display = 'none';
            profileImageModal.src = fotoUrl;
            profileImageModal.style.display = 'block';
            modalIconDefault.style.display = 'none';
        } else {
            profileImageHeader.style.display = 'none';
            profileIconDefault.style.display = 'block';
            profileImageModal.style.display = 'none';
            modalIconDefault.style.display = 'block';
        }
    };
    
    // Faz o upload da foto selecionada para o servidor
    const uploadFoto = async (file) => {
        // Não precisamos mais verificar o usuarioId aqui, pois já foi feito no início.
        const formData = new FormData();
        formData.append('foto', file);

        try {
            const response = await fetch(`https://salas-app-back-end.onrender.com/api/users/upload-foto/${usuarioId}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha no upload da foto.');
            }

            const data = await response.json();
            const { user } = data;

            localStorage.setItem('fotoUrl', user.fotoPerfil);
            carregarDadosUsuario(); 
            alert('Sucesso! Foto de perfil atualizada.');
            profileModal.classList.remove('visible');

        } catch (error) {
            console.error('Erro no upload:', error);
            alert(`Erro: ${error.message}`);
        }
    };

    // --- Event Listeners ---

    // Animação de entrada
    setTimeout(() => {
        mainContent.classList.add('loaded');
    }, 100);

    // Abrir modal
    profileButton.addEventListener('click', () => {
        profileModal.classList.add('visible');
    });

    // Fechar modal
    closeModalButton.addEventListener('click', () => {
        profileModal.classList.remove('visible');
    });
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove('visible');
        }
    });

    // Clicar em "Editar Foto" aciona o input de arquivo
    editPhotoButton.addEventListener('click', () => {
        photoInput.click();
    });

    // Quando um arquivo é selecionado, inicia o upload
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadFoto(file);
        }
    });

    // Botão de Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('nome');
        localStorage.removeItem('fotoUrl');
        // Redireciona para a tela de boas-vindas/login
        window.location.href = '/index.html'; // Ajuste o nome do arquivo se for diferente
    });

    // --- Inicialização ---
    // A função carregarDadosUsuario só será chamada se o usuário estiver logado.
    carregarDadosUsuario();
});
