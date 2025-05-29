const express = require('express');
const router = express.Router();
const controller = require('../controllers/servico.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

router.get('/', controller.listarServicos);

router.post('/', auth, authorize('barbeiro'), controller.adicionarServico);

module.exports = router;

