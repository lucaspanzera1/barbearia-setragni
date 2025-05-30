const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const mensagem = document.getElementById('mensagem');

// Alternar abas
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  mensagem.textContent = '';
});

registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  mensagem.textContent = '';
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Erro no login');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    mensagem.style.color = 'green';
    mensagem.textContent = 'Login realizado com sucesso!';
    setTimeout(() => window.location.href = '../dashboard/index.html', 1000);

  } catch (err) {
    mensagem.style.color = 'red';
    mensagem.textContent = err.message;
  }
});

// Registro
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('registerNome').value;
  const email = document.getElementById('registerEmail').value;
  const telefone = document.getElementById('registerTelefone').value;
  const senha = document.getElementById('registerSenha').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, senha, tipo: 'cliente' })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Erro no registro');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    mensagem.style.color = 'green';
    mensagem.textContent = 'Registro realizado com sucesso!';
    setTimeout(() => window.location.href = '../dashboard/index.html', 1000);


  } catch (err) {
    mensagem.style.color = 'red';
    mensagem.textContent = err.message;
  }
});
