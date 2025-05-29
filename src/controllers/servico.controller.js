const servicoService = require('../services/servico.service');

exports.listarServicos = async (req, res) => {
  try {
    const servicos = await servicoService.getServicos();
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar serviços', details: err });
  }
};

exports.adicionarServico = async (req, res) => {
  try {
    const { nome, duracao, preco } = req.body;

    if (!nome || !duracao || !preco) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, duracao, preco' });
    }

    const novo = await servicoService.criarServico({ nome, duracao, preco });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar serviço', details: err });
  }
};
