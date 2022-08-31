const { STATUS_BAD_REQUEST, STATUS_SERVER_ERROR } = require('./constants');

const errorHandler = (err, res) => {
  if (err.name === 'CastError') {
    res.status(STATUS_BAD_REQUEST).send({ message: 'Некорректный id' });
    return;
  }
  if (err.name === 'ValidationError') {
    res.status(STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
    return;
  }

  res.status(STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
};

module.exports = {
  errorHandler,
};
