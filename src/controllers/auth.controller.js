const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { nome, email, telefone, senha, tipo } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    // 1. Cria usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ nome, email, telefone, senha: senhaHash, tipo }])
      .select();

    if (userError) return res.status(500).json({ error: userError.message });

    const user = userData[0];

    // 2. Se for barbeiro, cria também na tabela 'barbeiros'
    if (tipo === 'barbeiro') {
      const { error: barberError } = await supabase
        .from('barbeiros')
        .insert([{ user_id: user.id, nome_exibicao: nome }]);

      if (barberError) return res.status(500).json({ error: 'Erro ao criar barbeiro: ' + barberError.message });
    }

    // 3. Gera token e responde
    const token = generateToken({ id: user.id, tipo: user.tipo });
    res.json({ user, token });

  } catch (err) {
    res.status(500).json({ error: 'Erro interno no registro', details: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return res.status(401).json({ error: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(senha, data.senha);

  if (!valid) return res.status(401).json({ error: 'Senha inválida' });

  const user = data;
  const token = generateToken({ id: user.id, tipo: user.tipo });

  res.json({ user, token });
};

// Reaproveita bcrypt e supabase já importados

// Buscar dados do usuário autenticado
exports.me = async (req, res) => {
  try {
    const { id } = req.user;

    const { data, error } = await supabase
      .from('users')
      .select('id, nome, email, telefone, tipo')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno ao buscar usuário' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { id } = req.user;
    const { nome, email, telefone, senha } = req.body;

    // Monta objeto para update
    const updateData = { nome, email, telefone };

    if (senha) {
      updateData.senha = await bcrypt.hash(senha, 10);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, nome, email, telefone, tipo')
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Perfil atualizado com sucesso', user: data });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno ao atualizar usuário' });
  }
};

