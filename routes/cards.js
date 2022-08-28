const express = require("express");
const cardRouter = express.Router(); // создали роутер

const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards.js");

cardRouter.get("/", express.json(), getCards);

cardRouter.delete("/:cardId", express.json(), deleteCardById);

cardRouter.post("/", express.json(), createCard);

cardRouter.put("/:cardId/likes", express.json(), likeCard);

cardRouter.delete("/:cardId/likes", express.json(), dislikeCard);

module.exports = cardRouter; // экспортировали роутер
