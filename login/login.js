document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const nomeInput = document.getElementById('nome');
    const senhaInput = document.getElementById('senha');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        // --- ALTERAÇÃO AQUI ---
        // Usamos .trim() para garantir que o nome de login também seja limpo
        const nome = nomeInput.value.trim();
        const senha = senhaInput.value;

        if (!nome || !senha) {
            errorMessage.textContent = 'Preencha todos os campos!';
            return;
        }

        try {
            const response = await fetch('https://salas-app-backend-service-909187510548.southamerica-east1.run.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Enviamos o nome já limpo
                body: JSON.stringify({ nome, senha }),
            });

            const data = await response.json();

            if (response.status === 200) {
                const { user } = data;

                if (user && user._id && user.nome) {
                    localStorage.setItem('userId', user._id);
                    localStorage.setItem('nome', user.nome);
                    localStorage.setItem('fotoUrl', user.fotoPerfil || '');
                } else {
                    errorMessage.textContent = 'Resposta do servidor inválida.';
                    return;
                }

                errorMessage.textContent = '';
                
                window.location.href = '/home/home.html';

            } else {
                errorMessage.textContent = data.message || 'Login inválido';
            }
        } catch (error) {
            errorMessage.textContent = 'Não foi possível conectar ao servidor.';
            console.error('Erro de rede:', error);
        }
    });

});
