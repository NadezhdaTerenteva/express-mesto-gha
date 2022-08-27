const Card = require('../models/card.js');

const createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  if (!name || !link) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании карточки'});
      return;
  }
  Card.create({ name, link }) // создадим документ на основе пришедших данных
  // вернём записанные в базу данные
  .then(card => res.send({ data: card }))
  // данные не записались, вернём ошибку
  .catch(err => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

const deleteCardById = (req, res) => {
  const cardId = req.params.id;
  if (!cardId) {
    res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      return;
  }
  Card.findByIdAndRemove(cardId)
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

const likeCard = (req, res) => {
  const cardId = req.params.cardId;
  if (!cardId) {
    res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      return;
  }
Card.findByIdAndUpdate(cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true })
  .then(cards => res.send({ data: cards }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

const dislikeCard = (req, res) => {
const cardId = req.params.cardId;
  if (!cardId) {
    res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      return;
  }
Card.findByIdAndUpdate(cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true })
  .then(cards => res.send({ data: cards }))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
}

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard
}