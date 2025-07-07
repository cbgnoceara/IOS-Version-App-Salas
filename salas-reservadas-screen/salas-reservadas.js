document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');

    const buscarReservas = async () => {
        contentContainer.innerHTML = '<div class="loading-spinner"></div>';
        try {
            const response = await fetch('https://salas-app-back-end.onrender.com/api/reservas/listar');
            const reservas = await response.json(); //

            // --- INÍCIO DA MODIFICAÇÃO ---

            // Função para converter a data do formato DD/MM/YYYY para um objeto Date do JavaScript
            const parseDate = (dateString) => {
                const [day, month, year] = dateString.split('/');
                // O mês no construtor Date é baseado em zero (0-11), por isso subtraímos 1
                return new Date(year, month - 1, day);
            };

            // Ordena o array de reservas com base na data
            reservas.sort((a, b) => {
                const dateA = parseDate(a.data); // Pega a data da reserva "a"
                const dateB = parseDate(b.data); // Pega a data da reserva "b"
                
                // Subtrai as datas. Isso resulta em uma ordenação cronológica crescente (datas mais antigas/próximas primeiro).
                return dateA - dateB;
            });

            // --- FIM DA MODIFICAÇÃO ---

            renderReservas(reservas); //
        } catch (error) {
            contentContainer.innerHTML = '<p class="empty-container">Não foi possível carregar as reservas.</p>'; //
        }
    };

    const renderReservas = (reservas) => {
        if (reservas.length === 0) { //
            contentContainer.innerHTML = '<p class="empty-container">Nenhuma reserva encontrada no momento.</p>'; //
            return;
        }
        // Gera o HTML da lista de reservas para ser exibido na tela
        const listHtml = `
            <ul class="list">
                ${reservas.map(item => `
                    <a href="/reserva-detalhe-screen/reserva-detalhe.html?reserva=${encodeURIComponent(JSON.stringify(item))}" class="card-link">
                        <li class="card">
                            <div class="card-text-container">
                                <p class="card-title">Sala: ${item.sala}</p>
                                <p class="card-detail">Data: ${item.data} das ${item.horarioInicio} às ${item.horarioFim}</p>
                                <p class="card-user">Reservado por: ${item.usuarioNome}</p>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </li>
                    </a>
                `).join('')}
            </ul>
        `;
        contentContainer.innerHTML = listHtml; //
    };
    
    buscarReservas(); //
});
