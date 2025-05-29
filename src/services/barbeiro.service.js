const supabase = require('../config/supabase');

// Busca horários padrão por barbeiro e dia da semana
exports.getDisponibilidade = async (barbeiro_id, dia_semana) => {
  const { data, error } = await supabase
    .from('disponibilidades')
    .select('*')
    .eq('barbeiro_id', barbeiro_id)
    .eq('dia_semana', dia_semana);

  if (error) throw error;
  return data;
};

// Cadastra disponibilidade padrão
exports.criarDisponibilidade = async ({ barbeiro_id, dia_semana, hora_inicio, hora_fim }) => {
  const { data, error } = await supabase
    .from('disponibilidades')
    .insert([{ barbeiro_id, dia_semana, hora_inicio, hora_fim }])
    .select();

  if (error) throw error;
  return data[0];
};

// Cadastra indisponibilidade específica
exports.criarIndisponibilidade = async ({ barbeiro_id, data, hora_inicio, hora_fim, motivo }) => {
  const { data: resData, error } = await supabase
    .from('indisponibilidades')
    .insert([{ barbeiro_id, data, hora_inicio, hora_fim, motivo }])
    .select();

  if (error) throw error;
  return resData[0];
};
