const mensagem = document.getElementById('mensagem');
const logoutBtn = document.getElementById('logoutBtn');
const loginLink = document.getElementById('loginLink');

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (token && user) {
  mensagem.textContent = `Olá, ${user.nome}! Você está logado como ${user.tipo}.`;
  logoutBtn.classList.remove('hidden');
} else {
  mensagem.textContent = 'Você não está logado.';
  loginLink.classList.remove('hidden');
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
});
