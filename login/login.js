document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const nomeInput = document.getElementById('nome');
    const senhaInput = document.getElementById('senha');

    loginForm.addEventListener('submit', async (event) => {
        // Previne o recarregamento padrão da página
        event.preventDefault(); 

        const nome = nomeInput.value;
        const senha = senhaInput.value;

        if (!nome || !senha) {
            errorMessage.textContent = 'Preencha todos os campos!';
            return;
        }

        try {
            const response = await fetch('https://salas-app-back-end.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, senha }),
            });

            const data = await response.json();

            if (response.status === 200) {
                const { user } = data;

                if (user && user._id && user.nome) {
                    // localStorage é o equivalente web do AsyncStorage
                    localStorage.setItem('userId', user._id);
                    localStorage.setItem('nome', user.nome);
                    localStorage.setItem('fotoUrl', user.fotoPerfil || '');
                } else {
                    errorMessage.textContent = 'Resposta do servidor inválida.';
                    return;
                }

                errorMessage.textContent = ''; // Limpa a mensagem de erro
                
                // Redireciona para a página principal após o login
                window.location.href = '/home/home.html'; // Assumindo que a home seja 'home.html'

            } else {
                errorMessage.textContent = data.message || 'Login inválido';
            }
        } catch (error) {
            errorMessage.textContent = 'Não foi possível conectar ao servidor.';
            console.error('Erro de rede:', error);
        }
    });
});