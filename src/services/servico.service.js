const supabase = require('../config/supabase');

exports.getServicos = async () => {
  const { data, error } = await supabase
    .from('servicos')
    .select('*')
    .order('nome', { ascending: true });

  if (error) throw error;
  return data;
};

exports.criarServico = async ({ nome, duracao, preco }) => {
  const { data, error } = await supabase
    .from('servicos')
    .insert([{ nome, duracao, preco }])
    .select();

  if (error) throw error;
  return data[0];
};
