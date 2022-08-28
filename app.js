const express = require("express");
const path = require("path");
const userRouter = require("./routes/users.js"); // импортируем роутер
const cardRouter = require("./routes/cards.js");
const mongoose = require("mongoose");
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

// подключаем мидлвары, роуты и всё остальное...
app.use((req, res, next) => {
  req.user = {
    _id: "6308d34017082be12f8d85ab", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
