const Card = require('../models/card.js');

const createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;

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

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
) 

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard
}