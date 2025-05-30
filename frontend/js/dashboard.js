const userNameSpan = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

const profileForm = document.getElementById('profileForm');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputTelefone = document.getElementById('telefone');
const inputSenha = document.getElementById('senha');

const msgStatus = document.getElementById('msgStatus');
const msgErro = document.getElementById('msgErro');

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
  window.location.href = '/login';
} else {
  userNameSpan.textContent = user.nome;

  // Busca dados atualizados do perfil (GET /auth/me)
  fetch('/api/auth/me', {
    headers: { Authorization: 'Bearer ' + token },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Não autorizado');
      return res.json();
    })
    .then((data) => {
      inputNome.value = data.nome;
      inputEmail.value = data.email;
      inputTelefone.value = data.telefone;
    })
    .catch(() => {
      // Se token inválido, redireciona
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
});

// Atualizar perfil
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgStatus.textContent = '';
  msgErro.textContent = '';

  const nome = inputNome.value.trim();
  const email = inputEmail.value.trim();
  const telefone = inputTelefone.value.trim();
  const senha = inputSenha.value;

  // Monta o corpo da requisição sem enviar senha se estiver vazia
  const bodyData = { nome, email, telefone };
  if (senha) {
    bodyData.senha = senha;
  }

  try {
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();

    if (!res.ok) {
      msgErro.textContent = data.error || 'Erro ao atualizar perfil';
      return;
    }

    msgStatus.textContent = data.message;

    // Atualiza o nome exibido e o localStorage user para refletir mudança
    userNameSpan.textContent = data.user.nome;
    localStorage.setItem('user', JSON.stringify(data.user));

    // Limpa campo senha
    inputSenha.value = '';

  } catch (err) {
    msgErro.textContent = 'Erro de comunicação com o servidor.';
  }
});


