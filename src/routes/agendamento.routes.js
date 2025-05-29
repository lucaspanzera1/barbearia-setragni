const express = require('express');
const router = express.Router();
const controller = require('../controllers/agendamento.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/disponiveis', auth, controller.horariosDisponiveis);
router.post('/', auth, controller.criar);
router.delete('/:id', auth, controller.cancelar);

router.get('/barbeiros/:id/agendamentos', auth, controller.listarPorBarbeiro);
router.get('/clientes/:id/agendamentos', auth, controller.listarPorCliente);

module.exports = router;
