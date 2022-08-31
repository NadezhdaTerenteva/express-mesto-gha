const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users'); // импортируем роутер
const cardRouter = require('./routes/cards');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

// подключаем мидлвары, роуты и всё остальное...
app.use((req, res, next) => {
  req.user = {
    _id: '6308d34017082be12f8d85ab', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(express.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', express.json(), (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
