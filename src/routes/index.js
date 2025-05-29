const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const servicoRoutes = require('./servico.routes');

router.use('/auth', authRoutes);
router.use('/servicos', servicoRoutes);

module.exports = router;

