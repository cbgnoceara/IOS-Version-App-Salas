document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const nomeInput = document.getElementById('nome');
    const sobrenomeInput = document.getElementById('sobrenome');
    const senhaInput = document.getElementById('senha');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = nomeInput.value;
        const sobrenome = sobrenomeInput.value;
        const senha = senhaInput.value;

        if (!nome || !sobrenome || !senha) {
            // alert é o equivalente web do Alert.alert
            alert('Erro: Preencha todos os campos!');
            return;
        }

        try {
            const response = await fetch('https://salas-app-back-end.onrender.com/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, sobrenome, senha }),
            });

            const data = await response.json();

            if (response.status === 201) {
                alert('Sucesso: Cadastro realizado com sucesso!');
                // Redireciona para a página de login
                window.location.href = '/login.html'; 
            } else {
                alert(`Erro: ${data.message || 'Erro ao cadastrar'}`);
            }
        } catch (error) {
            alert('Erro: Não foi possível conectar ao servidor.');
            console.error('Erro de rede:', error);
        }
    });
});