require('dotenv').config();

const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const imageRouter = require('./routes/image');
const messageRouter = require('./routes/message');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/image', imageRouter);
app.use('/message', messageRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

module.exports = app;
