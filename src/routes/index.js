const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const servicoRoutes = require('./servico.routes');
const barbeiroRoutes = require('./barbeiro.routes');

router.use('/auth', authRoutes);
router.use('/servicos', servicoRoutes);
router.use('/barbeiros', barbeiroRoutes);

module.exports = router;


