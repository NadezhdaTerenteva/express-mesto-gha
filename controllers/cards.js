const Card = require("../models/card.js");
const { hasLengthError, idHasError } = require("./validators.js");

const minlength = 2;
const maxlength = 30;

const createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  if (!name || !link || hasLengthError(name, minlength, maxlength)) {
    res
      .status(400)
      .send({ message: "Переданы некорректные данные при создании карточки" });
    return;
  }
  Card.create({ name, link, owner: req.user }) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then((card) => res.send({ data: card }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка на сервере" });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || idHasError(cardId) === true) {
    res.status(400).send({ message: "Передан некорректный _id карточки" });
    return;
  }
  Card.findByIdAndRemove(cardId)
    .then((cards) => {
      if (!cards) {
        res
          .status(404)
          .send({ message: "По переданному _id карточка не найдена" });
        return;
      }
      res.send({ data: cards });
    })
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || idHasError(cardId) === true) {
    res.status(400).send({ message: "Передан некорректный _id карточки" });
    return;
  }
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((cards) => {
      if (!cards) {
        res
          .status(404)
          .send({ message: "По переданному _id карточка не найдена" });
        return;
      }
      res.send({ data: cards });
    })
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId || idHasError(cardId) === true) {
    res.status(400).send({ message: "Передан некорректный _id карточки" });
    return;
  }
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((cards) => {
      if (!cards) {
        res
          .status(404)
          .send({ message: "По переданному _id карточка не найдена" });
        return;
      }
      res.send({ data: cards });
    })
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
