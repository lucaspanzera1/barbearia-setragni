const userNameSpan = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
  // Não está logado, redireciona para login
  window.location.href = '/login';
} else {
  userNameSpan.textContent = user.nome;
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
});
