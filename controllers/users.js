const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_NOT_FOUND, STATUS_BAD_REQUEST } = require('./constants');
const { errorHandler } = require('./errorHandler');

const mongoUpdateParams = {
  new: true, // обработчик then получит на вход обновлённую запись
  runValidators: true, // данные будут валидированы перед изменением
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body; // получим из объекта запроса имя,

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        email,
        password: hashedPassword,
        name,
        about,
        avatar,
      })
        .then((user) => res.status(200).send({ data: user })
        // данные не записались, вернём ошибку
          .catch(next));
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({ _id: user._id }, 'secret');

            res.cookie('jwt', token, {
              expiresIn: '7d',
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            res.status(403).send({ message: 'Неправильный пароль' });
          }
        });
    })
    .catch(next);
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
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: 'Такого пользователя не существует' });
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
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: 'Такого пользователя не существует' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(err, res));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res
      .status(STATUS_BAD_REQUEST)
      .send({ message: 'Передано некорректное поле Аватар' });
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, mongoUpdateParams)
    .then((user) => {
      if (!user) {
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: 'Такого пользователя не существует' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(err, res));
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
