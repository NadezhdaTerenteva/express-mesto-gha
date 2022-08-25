const express = require('express');
const userRouter = express.Router(); // создали роутер

const { createUser, getUsers, getUserById } = require('../controllers/users.js')

userRouter.get('/', express.json(), getUsers);

userRouter.get('/:userId', express.json(), getUserById);

userRouter.post('/', express.json(), createUser);

module.exports = userRouter; // экспортировали роутер
