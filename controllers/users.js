const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { errorHandler } = require('./errorHandler');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

const mongoUpdateParams = {
  new: true, // обработчик then получит на вход обновлённую запись
  runValidators: true, // данные будут валидированы перед изменением
};

const userExists = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

const createUser = async (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body; // получим из объекта запроса имя,

  if (await userExists(email)) {
    throw new ConflictError('Пользователь с таким email уже существует');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });
    res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ForbiddenError('Поля должны быть заполнены');
  }

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

            res.cookie('jwt', token, {
              httpOnly: true,
              sameSite: true,
              maxAge: 3600000 * 24 * 7,
            });
            res.send({ data: user.toJSON() });
          } else {
            throw new UnauthorizedError('Неправильные почта или пароль');
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

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
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
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new BadRequestError('Передано некорректное поле Аватар');
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, mongoUpdateParams)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
};
