const express = require('express');
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

module.exports = app;
