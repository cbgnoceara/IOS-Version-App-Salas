document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');

    const buscarUsuarios = async () => {
        contentContainer.innerHTML = '<div class="loading-spinner"></div>';
        try {
            const meuId = localStorage.getItem('userId');
            const response = await fetch('https://salas-app-back-end.onrender.com/api/users/listar-todos');
            const usuarios = await response.json();
            renderUsuarios(usuarios, meuId);
        } catch (error) {
            contentContainer.innerHTML = '<p class="empty-container">Não foi possível carregar a lista de usuários.</p>';
        }
    };

    const renderUsuarios = (usuarios, meuId) => {
        const listHtml = `
            <ul class="list">
                ${usuarios.map(item => `
                    <li class="card">
                        ${item.fotoPerfil 
                            ? `<img src="${item.fotoPerfil}" alt="Foto de ${item.nome}" class="profile-image">`
                            : `<i class="ri-account-circle-line default-user-icon"></i>`
                        }
                        <div class="card-text-container">
                            <p class="card-title">
                                ${item.nome} ${item.sobrenome}
                                ${item._id === meuId ? `<span class="you-tag">(você)</span>` : ''}
                            </p>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
        contentContainer.innerHTML = listHtml;
    };

    buscarUsuarios();
});