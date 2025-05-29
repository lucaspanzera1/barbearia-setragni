const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const servicoRoutes = require('./servico.routes');
const barbeiroRoutes = require('./barbeiro.routes');
const agendamentoRoutes = require('./agendamento.routes'); 

router.use('/auth', authRoutes);
router.use('/servicos', servicoRoutes);
router.use('/barbeiros', barbeiroRoutes);
router.use('/agendamentos', agendamentoRoutes); 

module.exports = router;



