require('dotenv').config();

console.log(process.env.JWT_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users'); // импортируем роутер
const cardRouter = require('./routes/cards');
const { authorizationValidator, registrationValidator } = require('./middlewares/validation');

const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const generalErrorHandler = require('./middlewares/generalErrorHandler');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

app.use(express.json());
app.use(cookieParser());
app.post('/signup', registrationValidator, createUser);
app.post('/signin', authorizationValidator, login);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', express.json(), (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

app.use(errors()); // обработчик ошибок celebrate

app.use(generalErrorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
