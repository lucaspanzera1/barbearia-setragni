document.getElementById('tabLogin').addEventListener('click', function() {
      // Atualizar tabs
      document.getElementById('tabLogin').classList.add('bg-black', 'text-white', 'border-black');
      document.getElementById('tabLogin').classList.remove('border-transparent');
      document.getElementById('tabRegister').classList.remove('bg-black', 'text-white', 'border-black');
      document.getElementById('tabRegister').classList.add('border-transparent');
      
      // Mostrar/ocultar formulários
      document.getElementById('formLogin').classList.remove('hidden');
      document.getElementById('formRegister').classList.add('hidden');
    });

    document.getElementById('tabRegister').addEventListener('click', function() {
      // Atualizar tabs
      document.getElementById('tabRegister').classList.add('bg-black', 'text-white', 'border-black');
      document.getElementById('tabRegister').classList.remove('border-transparent');
      document.getElementById('tabLogin').classList.remove('bg-black', 'text-white', 'border-black');
      document.getElementById('tabLogin').classList.add('border-transparent');
      
      // Mostrar/ocultar formulários
      document.getElementById('formRegister').classList.remove('hidden');
      document.getElementById('formLogin').classList.add('hidden');
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
