// Verifica se está logado
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const boasVindas = document.getElementById('boasVindas');
const logoutBtn = document.getElementById('logoutBtn');

if (!token || !user) {
  alert('Acesso não autorizado. Faça login.');
  window.location.href = '../auth/index.html';
} else {
  boasVindas.textContent = `Olá, ${user.nome}!`;
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../auth/index.html';
});
