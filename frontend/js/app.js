function updateHeaderUserInfo(user) {
      const userNameHeader = document.getElementById('userNameHeader');
      const userWelcome = document.getElementById('userWelcome');
      const dashboardLink = document.getElementById('dashboardLink');
      
      if (userNameHeader && user) {
        userNameHeader.textContent = user.nome;
      }
      
      // Mostrar elementos para usuário logado
      if (userWelcome) userWelcome.classList.remove('hidden');
      if (dashboardLink) dashboardLink.classList.remove('hidden');
    }
    
    // Função para mostrar estado de usuário não logado
    function showGuestState() {
      const userWelcome = document.getElementById('userWelcome');
      const dashboardLink = document.getElementById('dashboardLink');
      
      if (userWelcome) userWelcome.classList.add('hidden');
      if (dashboardLink) dashboardLink.classList.add('hidden');
    }
    const mensagem = document.getElementById('mensagem');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginLink = document.getElementById('loginLink');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      mensagem.textContent = `Olá, ${user.nome}! Você está logado como ${user.tipo}.`;
      logoutBtn.classList.remove('hidden');
      
      // Atualizar header com informações do usuário
      updateHeaderUserInfo(user);
    } else {
      mensagem.textContent = 'Você não está logado.';
      loginLink.classList.remove('hidden');
      
      // Mostrar estado de visitante no header
      showGuestState();
    }

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    });

