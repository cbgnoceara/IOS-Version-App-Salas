document.addEventListener('DOMContentLoaded', () => {
    const detalhesContainer = document.getElementById('detalhes-container');
    const params = new URLSearchParams(window.location.search);
    const reservaJSON = params.get('reserva');

    if (!reservaJSON) {
        detalhesContainer.innerHTML = '<p>Erro: Dados da reserva não encontrados.</p>';
        return;
    }

    const reserva = JSON.parse(decodeURIComponent(reservaJSON));

    const detalhesHtml = `
        <div class="detail-row">
            <p class="detail-label">Sala:</p>
            <p class="detail-value">${reserva.sala}</p>
        </div>
        <div class="detail-row">
            <p class="detail-label">Reservado por:</p>
            <p class="detail-value">${reserva.usuarioNome}</p>
        </div>
        <div class="detail-row">
            <p class="detail-label">Data:</p>
            <p class="detail-value">${reserva.data}</p>
        </div>
        <div class="detail-row">
            <p class="detail-label">Início:</p>
            <p class="detail-value">${reserva.horarioInicio}</p>
        </div>
        <div class="detail-row">
            <p class="detail-label">Fim:</p>
            <p class="detail-value">${reserva.horarioFim}</p>
        </div>
        ${reserva.descricao ? `
            <div class="detail-row">
                <p class="detail-label">Descrição:</p>
                <p class="detail-value detail-description">${reserva.descricao}</p>
            </div>
        ` : ''}
    `;
    detalhesContainer.innerHTML = detalhesHtml;
});