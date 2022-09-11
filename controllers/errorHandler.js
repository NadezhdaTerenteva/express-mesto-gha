// const { STATUS_BAD_REQUEST, STATUS_SERVER_ERROR } = require('./constants');
// const NotFoundError = require('../errors/not-found-err');
// const BadRequestError = require('../errors/bad-request-error');
// const ForbiddenError = require('../errors/forbidden-error');
// const UnauthorizedError = require('../errors/unauthorized-error');
// const ConflictError = require('../errors/conflict-error');

// const errorHandler = (err, res, next) => {
//   if (err.name === 'CastError') {

//     next(new BadRequestError('Некорректный id'));
//     //res.status(STATUS_BAD_REQUEST).send({ message: 'Некорректный id' });
//     return;
//   }
//   // if (err.name === 'ValidationError') {
//   //   next(new Va)
//   //   //res.status(STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
//   //   return;
//   // }

//   res.status(STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
// };

// module.exports = {
//   errorHandler,
// };
