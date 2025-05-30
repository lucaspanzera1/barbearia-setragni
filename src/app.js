const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(express.json()); 

app.get('/api', (req, res) => {
  res.json({
    message: 'Barbearia Setragni',
    versao: 'Beta',
    by: 'Lucas Panzera',
    status: 'online'
  });
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend'), { index: false }));

// Rotas para páginas específicas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/auth.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});




module.exports = app;
