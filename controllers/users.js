const User = require('../models/user');
const { STATUS_NOT_FOUND, STATUS_BAD_REQUEST } = require('./constants');
const { errorHandler } = require('./errorHandler');

const mongoUpdateParams = {
  new: true, // обработчик then получит на вход обновлённую запись
  runValidators: true, // данные будут валидированы перед изменением
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя, описание пользователя

  User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then((user) => res.status(200).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => errorHandler(err, res));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => errorHandler(err, res));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_NOT_FOUND).send({ message: 'Такого пользователя не существует' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => errorHandler(err, res));
};

const updateUser = (req, res) => {
  // обновим имя найденного по _id пользователя
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // Передадим объект опций:
    mongoUpdateParams,
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_NOT_FOUND).send({ message: 'Такого пользователя не существует' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(err, res));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(STATUS_BAD_REQUEST).send({ message: 'Передано некорректное поле Аватар' });
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, mongoUpdateParams)
    .then((user) => {
      if (!user) {
        res.status(STATUS_NOT_FOUND).send({ message: 'Такого пользователя не существует' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(err, res));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
