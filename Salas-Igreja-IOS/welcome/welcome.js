// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  const animatedContainer = document.getElementById('animated-container');

  // Adiciona a classe 'visible' para iniciar a transição CSS.
  // Usamos um pequeno timeout para garantir que o CSS inicial seja aplicado antes da transição começar.
  setTimeout(() => {
    if (animatedContainer) {
      animatedContainer.classList.add('visible');
    }
  }, 100); // Um pequeno delay ajuda a garantir que a transição ocorra suavemente.
});