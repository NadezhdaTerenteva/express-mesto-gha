const Card = require('../models/card.js');

const createCard = (req, res) => {
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя

  Card.create({ name, link }) // создадим документ на основе пришедших данных
  // вернём записанные в базу данные
  .then(card => res.send({ data: card }))
  // данные не записались, вернём ошибку
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.export = {
  createCard,
  getCards,
  deleteCardById
}