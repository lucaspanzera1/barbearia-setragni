const service = require('../services/agendamento.service');
const { DateTime } = require('luxon');

exports.horariosDisponiveis = async (req, res) => {
  try {
    const { barbeiro_id, data } = req.query;
    if (!barbeiro_id || !data) return res.status(400).json({ error: 'Parâmetros ausentes' });

    const horarios = await service.listarHorariosDisponiveis(barbeiro_id, data);
    res.json(horarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const { cliente_id, barbeiro_id, servico_id, data_hora } = req.body;
    if (!cliente_id || !barbeiro_id || !servico_id || !data_hora)
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

    const agendamento = await service.criarAgendamento({ cliente_id, barbeiro_id, servico_id, data_hora });
    res.status(201).json(agendamento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelar = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamento = await service.getAgendamentoPorId(id);

    const horasFaltando = DateTime.fromISO(agendamento.data_hora).diffNow('hours').hours;
    if (horasFaltando < 12) return res.status(400).json({ error: 'Cancelamento deve ser feito com 12h de antecedência' });

    const cancelado = await service.cancelarAgendamento(id);
    res.json(cancelado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarPorBarbeiro = async (req, res) => {
  try {
    const agendamentos = await service.listarPorBarbeiro(req.params.id);
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarPorCliente = async (req, res) => {
  try {
    const agendamentos = await service.listarPorCliente(req.params.id);
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
