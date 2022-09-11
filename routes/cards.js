const express = require('express');
const { cardValidator, cardIdValidator } = require('../middlewares/validation');

const cardRouter = express.Router(); // создали роутер

const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', cardIdValidator, deleteCardById);

cardRouter.post('/', cardValidator, createCard);

cardRouter.put('/:cardId/likes', cardIdValidator, likeCard);

cardRouter.delete('/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = cardRouter; // экспортировали роутер
