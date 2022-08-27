const User = require('../models/user.js');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;// получим из объекта запроса имя и описание пользователя
  if (!name || !about || !avatar ) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя'});
      return;
  }
  User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
  // вернём записанные в базу данные
  .then(user => res.send({ data: user }))
  // данные не записались, вернём ошибку
  .catch(err => res.status(500).send({ message: 'Произошла ошибка на сервере'}));
};

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка на сервере'}));
}

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Такого пользователя не существует' });
      return;
    }
    res.status(200).send(user);
    })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

const updateUser = (req, res) => {
  // обновим имя найденного по _id пользователя
  const { userId } = req.params;
  if (!userId) {
    res.status(404).send({ message: 'Пользователь с указанным _id не найден'});
      return;
  }
  User.findByIdAndUpdate(userId,
    { name: 'Надежда Терентьева', about: 'Студент Я.Практикума'},
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
  })
  .then((user) => {
    if (!user) {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      return;
    }
    res.status(200).send(user);
    })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере'}));
}

const updateAvatar = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(404).send({ message: 'Пользователь с указанным _id не найден'});
      return;
  }
  User.findByIdAndUpdate(userId,
    { avatar: 'https://i.pinimg.com/474x/ef/f3/9a/eff39a70bf5bc86c932bccbda58cd238.jpg'},
    {
      new: true,
      runValidators: true,
  })
  .then((user) => {
    if (!user) {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      return;
    }
    res.status(200).send(user);
    })
  .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере'}));
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar
}