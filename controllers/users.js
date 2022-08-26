const User = require('../models/user.js');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя

  User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
  // вернём записанные в базу данные
  .then(user => res.send({ data: user }))
  // данные не записались, вернём ошибку
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};


const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const updateUser = (req, res) => {
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id,
    { name: 'Надежда Терентьева', about: 'Студент Я.Практикума'},
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
  })
  .then(user => res.send({ data: user }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id,
    { avatar: 'https://i.pinimg.com/474x/ef/f3/9a/eff39a70bf5bc86c932bccbda58cd238.jpg'},
    {
      new: true,
      runValidators: true,
  })
  .then(user => res.send({ data: user }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar
}