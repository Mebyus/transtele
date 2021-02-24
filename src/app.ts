import express = require('express');
import path = require('path');
import cookieParser = require('cookie-parser');
import logger = require('morgan');

import indexRouter = require('./routes/index');
import usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export = app;
