const User = require("../models/user.js");

const mongoUpdateParams = {
  new: true, // обработчик then получит на вход обновлённую запись
  runValidators: true, // данные будут валидированы перед изменением
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя

  let validationError = checkValidation(req.body);

  if (validationError === true) {
    res.status(400).send({
      message: "Переданы некорректные данные при создании пользователя",
    });
    return;
  }

  User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then((user) => res.status(200).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  if (!userId || userId.length !== 24) {
    res.status(400).send({ message: "Передан некорректный id" });
    return;
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Такого пользователя не существует" });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch(() =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

const updateUser = (req, res) => {
  // обновим имя найденного по _id пользователя

  let validationError = checkValidation(req.body);

  if (validationError === true) {
    res
      .status(400)
      .send({ message: "Переданы некорректные данные при обновлении профиля" });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    // Передадим объект опций:
    mongoUpdateParams
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Такого пользователя не существует" });
        return;
      }
      res.status(200).send(user);
    })
    .catch(() =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(400).send({ message: "Передано некорректное поле Аватар" });
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, mongoUpdateParams)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Такого пользователя не существует" });
        return;
      }
      res.status(200).send(user);
    })
    .catch(() =>
      res.status(500).send({ message: "Произошла ошибка на сервере" })
    );
};

const checkValidation = ({ name, about, avatar }) => {
  let validationError = false;

  if (!name || !about || !avatar) {
    validationError = true;
  }

  if (validationError === false) {
    const nameLength = name.length;
    const aboutLength = about.length;
    validationError =
      nameLength < 2 || nameLength > 30 || aboutLength < 2 || aboutLength > 30;
  }

  return validationError;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
