// Função auto-executável para aplicar o tema imediatamente
(function() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        // Usamos document.documentElement (o <html>) para aplicar a classe
        // o mais cedo possível, evitando o "flash" de tela branca.
        document.documentElement.classList.add('dark-mode');
    }
})();

// Aguarda o restante da página carregar para configurar o botão
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    // Se o botão de troca de tema existir nesta página (no caso, a Home)
    if (themeToggle) {
        // Define o estado inicial do botão (marcado ou não) com base no tema salvo
        themeToggle.checked = localStorage.getItem('theme') === 'dark';

        // Adiciona o listener para o evento de mudança (clique)
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                // Se marcado, adiciona a classe dark-mode e salva no localStorage
                document.documentElement.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                // Se desmarcado, remove a classe e salva no localStorage
                document.documentElement.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});