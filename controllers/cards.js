const Card = require('../models/card');
const { errorHandler } = require('./errorHandler');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-error');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user }) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then((card) => res.send({ data: card }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      errorHandler(err, res);
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => errorHandler(err, res));
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findOneAndRemove({
    _id: cardId,
    owner: req.user._id,
  })
    .then((cards) => {
      if (!cards) {
        throw new UnauthorizedError('Невозможно удалить карточку другого пользователя');
      }
      res.send();
    })
    .catch((err) => errorHandler(err, res));
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('По переданному _id карточка не найдена');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('По переданному _id карточка не найдена');
      }
      res.send({ data: cards });
    })
    .catch((err) => errorHandler(err, res));
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
