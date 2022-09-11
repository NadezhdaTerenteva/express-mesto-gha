const jwt = require('jsonwebtoken');

const STATUS_UNAUTHORIZED = require('../controllers/constants');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(STATUS_UNAUTHORIZED).send({ message: 'Ошибка авторизации' });
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
