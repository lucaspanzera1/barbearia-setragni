const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { nome, email, telefone, senha, tipo } = req.body;

  const senhaHash = await bcrypt.hash(senha, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ nome, email, telefone, senha: senhaHash, tipo }])
    .select();

  if (error) return res.status(500).json({ error });

  const user = data[0];
  const token = generateToken({ id: user.id, tipo: user.tipo });

  res.json({ user, token });
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
