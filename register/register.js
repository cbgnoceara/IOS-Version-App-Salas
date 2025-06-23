document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const nomeInput = document.getElementById('nome');
    const sobrenomeInput = document.getElementById('sobrenome');
    const senhaInput = document.getElementById('senha');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // --- ALTERAÇÃO AQUI ---
        // Usamos .trim() para remover espaços do início e do fim
        const nome = nomeInput.value.trim();
        const sobrenome = sobrenomeInput.value.trim();
        const senha = senhaInput.value; // Não aplicamos trim na senha, pois espaços podem ser intencionais

        if (!nome || !sobrenome || !senha) {
            alert('Erro: Preencha todos os campos!');
            return;
        }

        try {
            const response = await fetch('https://salas-app-back-end.onrender.com/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Enviamos os valores já limpos
                body: JSON.stringify({ nome, sobrenome, senha }),
            });

            const data = await response.json();

            if (response.status === 201) {
                alert('Sucesso: Cadastro realizado com sucesso! Você será redirecionado para o login.');
                // Redireciona para a página de login após o sucesso
                window.location.href = '/login/entrar.html'; // Corrigido para levar ao login
            } else {
                alert(`Erro: ${data.message || 'Erro ao cadastrar'}`);
            }
        } catch (error) {
            alert('Erro: Não foi possível conectar ao servidor.');
            console.error('Erro de rede:', error);
        }
    });
});
