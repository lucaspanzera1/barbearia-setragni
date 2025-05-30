const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');
const msgErro = document.getElementById('msgErro');

// Alterna abas
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  formLogin.classList.add('active');
  formRegister.classList.remove('active');
  msgErro.textContent = '';
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  formRegister.classList.add('active');
  formLogin.classList.remove('active');
  msgErro.textContent = '';
});

// Login
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgErro.textContent = '';

  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value.trim();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      msgErro.textContent = data.error || 'Erro no login';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/app';

  } catch (err) {
    msgErro.textContent = 'Erro na comunicação com o servidor.';
  }
});

// Registro
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgErro.textContent = '';

  const nome = document.getElementById('nomeRegister').value.trim();
  const email = document.getElementById('emailRegister').value.trim();
  const telefone = document.getElementById('telefoneRegister').value.trim();
  const senha = document.getElementById('senhaRegister').value.trim();
  const tipo = document.getElementById('tipoRegister').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, senha, tipo }),
    });

    const data = await res.json();

    if (!res.ok) {
      msgErro.textContent = data.error || 'Erro no registro';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/app';

  } catch (err) {
    msgErro.textContent = 'Erro na comunicação com o servidor.';
  }
});
