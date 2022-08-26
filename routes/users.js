const express = require('express');
const router = express.Router(); // создали роутер

const { createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar } = require('../controllers/users.js')

router.get('/', express.json(), getUsers);

router.get('/:userId', express.json(), getUserById);

router.post('/', express.json(), createUser);

router.patch('/me', express.json(), updateUser);

router.patch('/me/avatar', express.json(), updateAvatar);

module.exports = router; // экспортировали роутер
