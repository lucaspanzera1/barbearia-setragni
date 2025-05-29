const barbeiroService = require('../services/barbeiro.service');
const supabase = require('../config/supabase');

// GET /barbeiros/:id/disponibilidade?dia_semana=1
exports.listarDisponibilidade = async (req, res) => {
  try {
    const barbeiro_id = req.params.id;
    const dia_semana = parseInt(req.query.dia_semana);

    if (isNaN(dia_semana) || dia_semana < 0 || dia_semana > 6) {
      return res.status(400).json({ error: 'Parâmetro dia_semana inválido (0-6)' });
    }

    const disponibilidades = await barbeiroService.getDisponibilidade(barbeiro_id, dia_semana);
    res.json(disponibilidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar disponibilidade', details: error.message });
  }
};

// POST /barbeiros/:id/disponibilidade
exports.adicionarDisponibilidade = async (req, res) => {
  try {
    const barbeiro_id = req.params.id;
    const { dia_semana, hora_inicio, hora_fim } = req.body;

    if (
      dia_semana === undefined ||
      !hora_inicio ||
      !hora_fim ||
      dia_semana < 0 ||
      dia_semana > 6
    ) {
      return res.status(400).json({ error: 'Campos inválidos ou ausentes' });
    }

    // Verifica se o barbeiro existe
    const { data: barbeiro, error: barbeiroError } = await supabase
      .from('barbeiros')
      .select('id')
      .eq('id', barbeiro_id)
      .single();

    if (barbeiroError || !barbeiro) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }

    const novaDisp = await barbeiroService.criarDisponibilidade({
      barbeiro_id,
      dia_semana,
      hora_inicio,
      hora_fim,
    });

    res.status(201).json(novaDisp);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao adicionar disponibilidade',
      details: error.message,
    });
  }
};

// POST /barbeiros/:id/indisponibilidades
exports.adicionarIndisponibilidade = async (req, res) => {
  try {
    const barbeiro_id = req.params.id;
    const { data, hora_inicio, hora_fim, motivo } = req.body;

    if (!data || !hora_inicio || !hora_fim) {
      return res.status(400).json({
        error: 'Campos obrigatórios: data, hora_inicio, hora_fim',
      });
    }

    // Verifica se o barbeiro existe na tabela barbeiros
    const { data: barbeiro, error: barbeiroError } = await supabase
      .from('barbeiros')
      .select('id')
      .eq('id', barbeiro_id)
      .single();

    if (barbeiroError || !barbeiro) {
      return res.status(404).json({ error: 'Barbeiro não encontrado' });
    }

    const indisponibilidade = await barbeiroService.criarIndisponibilidade({
      barbeiro_id,
      data,
      hora_inicio,
      hora_fim,
      motivo,
    });

    res.status(201).json(indisponibilidade);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao adicionar indisponibilidade',
      details: error.message,
    });
  }
};