const express = require('express');
const router = express.Router();
const controller = require('../controllers/barbeiro.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

// Listar disponibilidade padrão de um barbeiro em um dia da semana
router.get('/:id/disponibilidade', auth, controller.listarDisponibilidade);

// Adicionar disponibilidade padrão (ex: horário fixo semanal) - só barbeiro/admin
router.post('/:id/disponibilidade', auth, authorize('barbeiro'), controller.adicionarDisponibilidade);

// Adicionar indisponibilidade em um dia e horário (folga, cancelamento) - só barbeiro/admin
router.post('/:id/indisponibilidades', auth, authorize('barbeiro'), controller.adicionarIndisponibilidade);

module.exports = router;
