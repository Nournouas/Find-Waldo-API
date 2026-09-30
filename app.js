const express = require('express');
const { gameRouter } = require('./routers/gameRouter');
const app = express();
const port = 3000;
const session = require('express-session');
const genFunc  = require('connect-pg-simple');
require('dotenv').config()
const PostgresqlStore = genFunc(session);
const sessionStore = new PostgresqlStore({
    conString: process.env.CONNECTION_STRING,
  });

const cors = require('cors');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // must match your frontend's URL exactly
  credentials: true,
}));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  store: sessionStore
}));

app.use('/', gameRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});