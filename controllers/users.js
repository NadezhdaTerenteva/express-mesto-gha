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
  // res.send(users);
}

// const getUserById = (req, res) => {
  // if (!users[req.params.id]) {
    // res.send(`Такого пользователя не существует`);
    // return;
  // }
  // res.send(users[req.params.id])
// }

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.export = {
  createUser,
  getUsers,
  getUserById
}