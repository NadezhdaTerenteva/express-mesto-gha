const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Ошибка авторизации');
  }
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (err) {
    next(new UnauthorizedError('Ошибка авторизации'));
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
