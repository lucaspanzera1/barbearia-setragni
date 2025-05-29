const supabase = require('../config/supabase');
const { DateTime } = require('luxon');

exports.listarHorariosDisponiveis = async (barbeiro_id, data) => {
  // Busca disponibilidade padrão do barbeiro (dia da semana)
  const diaSemana = DateTime.fromISO(data).weekday % 7;

  const { data: disponiveis, error: err1 } = await supabase
    .from('disponibilidades')
    .select('*')
    .eq('barbeiro_id', barbeiro_id)
    .eq('dia_semana', diaSemana);

  if (err1) throw err1;
  if (disponiveis.length === 0) return [];

  const { hora_inicio, hora_fim } = disponiveis[0];

  // Horários em sequência de 1h
  const start = DateTime.fromISO(`${data}T${hora_inicio}`);
  const end = DateTime.fromISO(`${data}T${hora_fim}`);

  let horarios = [];
  for (let h = start; h < end; h = h.plus({ hours: 1 })) {
    horarios.push(h.toISO());
  }

  // Remove horários já agendados
  const { data: agendados, error: err2 } = await supabase
    .from('agendamentos')
    .select('data_hora')
    .eq('barbeiro_id', barbeiro_id)
    .eq('status', 'ativo')
    .gte('data_hora', start.toISO())
    .lt('data_hora', end.toISO());

  if (err2) throw err2;

  const ocupados = agendados.map(a => DateTime.fromISO(a.data_hora).toISO());
  const livres = horarios.filter(h => !ocupados.includes(h));

  return livres;
};

exports.criarAgendamento = async ({ cliente_id, barbeiro_id, servico_id, data_hora }) => {
  const { data, error } = await supabase
    .from('agendamentos')
    .insert([{ cliente_id, barbeiro_id, servico_id, data_hora }])
    .select();

  if (error) throw error;
  return data[0];
};

exports.cancelarAgendamento = async (id) => {
  const { data, error } = await supabase
    .from('agendamentos')
    .update({ status: 'cancelado' })
    .eq('id', id)
    .eq('status', 'ativo')
    .select();

  if (error) throw error;
  return data[0];
};

exports.getAgendamentoPorId = async (id) => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

exports.listarPorBarbeiro = async (barbeiro_id) => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('barbeiro_id', barbeiro_id)
    .order('data_hora', { ascending: true });

  if (error) throw error;
  return data;
};

exports.listarPorCliente = async (cliente_id) => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('cliente_id', cliente_id)
    .order('data_hora', { ascending: true });

  if (error) throw error;
  return data;
};
