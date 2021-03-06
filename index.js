require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./src/routes/user');
const loginRouter = require('./src/routes/login');
const categoriesRouter = require('./src/routes/categories');
const postRouter = require('./src/routes/post');

const app = express();
app.use(bodyParser.json());

app.listen(3000, () => console.log('ouvindo porta 3000!'));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_req, res) => {
  res.send();
});

app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/categories', categoriesRouter);
app.use('/post', postRouter);

app.use((err, _req, res, _next) => {
  const { status, message } = err;
  const statusCode = status || 500;

  res.status(statusCode).json({
    message,
  });
});
