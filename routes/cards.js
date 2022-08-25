const express = require('express');
const cardRouter = express.Router(); // создали роутер

const { createCard, getCards, deleteCardById } = require('../controllers/cards.js')

cardRouter.get('/', express.json(), getCards);

cardRouter.delete('/:cardId', express.json(), deleteCardById);

cardRouter.post('/', express.json(), createCard);

module.exports = cardRouter; // экспортировали роутер