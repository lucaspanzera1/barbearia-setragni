module.exports = function permitTipos(...tiposPermitidos) {
  return (req, res, next) => {
    if (!tiposPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({ error: 'Acesso negado: permissões insuficientes' });
    }
    next();
  };
};
