const express = require('express');
const { userValidator, userIdValidator, avatarValidator } = require('../middlewares/validation');

const router = express.Router(); // создали роутер

const {
  getUsers,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', userIdValidator, getUserById);

router.patch('/me', userValidator, updateUser);

router.patch('/me/avatar', avatarValidator, updateAvatar);

module.exports = router; // экспортировали роутер
