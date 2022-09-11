const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).send({ message: 'Ошибка авторизации' });
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
