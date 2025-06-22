document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');

    const buscarMinhasReservas = async () => {
        contentContainer.innerHTML = '<div class="loading-spinner"></div>';
        try {
            const usuarioId = localStorage.getItem('userId');
            if (!usuarioId) {
                alert('Erro: Usuário não identificado. Faça login novamente.');
                window.location.href = '/login.html';
                return;
            }
            const response = await fetch(`https://salas-app-back-end.onrender.com/api/reservas/minhas/${usuarioId}`);
            const reservas = await response.json();

            renderReservas(reservas);

        } catch (error) {
            console.error('Erro ao buscar minhas reservas:', error);
            contentContainer.innerHTML = '<p class="empty-container">Não foi possível carregar suas reservas.</p>';
        }
    };

    const renderReservas = (reservas) => {
        if (reservas.length === 0) {
            contentContainer.innerHTML = '<p class="empty-container">Você ainda não fez nenhuma reserva.</p>';
            return;
        }

        const listHtml = `
            <ul id="reservas-list" class="list">
                ${reservas.map(item => `
                    <li class="card" id="reserva-${item._id}">
                        <div class="card-text-container">
                            <p class="card-title">Sala: ${item.sala}</p>
                            <p class="card-detail">Data: ${item.data} das ${item.horarioInicio} às ${item.horarioFim}</p>
                            ${item.descricao ? `<p class="card-detail">Descrição: ${item.descricao}</p>` : ''}
                        </div>
                        <button class="delete-button" data-id="${item._id}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </li>
                `).join('')}
            </ul>
        `;
        contentContainer.innerHTML = listHtml;
    };

    const handleDeletarReserva = async (reservaId) => {
        const confirmou = confirm('Tem certeza que deseja deletar esta reserva?');
        if (!confirmou) return;

        try {
            const usuarioId = localStorage.getItem('userId');
            const response = await fetch(`https://salas-app-back-end.onrender.com/api/reservas/deletar/${reservaId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: usuarioId })
            });
            if (!response.ok) throw new Error('Falha ao deletar');

            alert('Reserva deletada com sucesso!');
            const itemParaRemover = document.getElementById(`reserva-${reservaId}`);
            if (itemParaRemover) itemParaRemover.remove();

        } catch (error) {
            console.error('Erro ao deletar reserva:', error);
            alert('Não foi possível deletar a reserva.');
        }
    };

    contentContainer.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-button');
        if (deleteButton) {
            handleDeletarReserva(deleteButton.dataset.id);
        }
    });

    buscarMinhasReservas();
});