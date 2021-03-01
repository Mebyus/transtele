import express = require('express');
import path = require('path');
import cookieParser = require('cookie-parser');
import logger = require('morgan');
import * as session from 'express-session';

const app = express();
export const sessionParser = session({
    resave: true,
    saveUninitialized: true,
    secret: 'my big secret',
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionParser);

app.use(express.static(path.join(__dirname, 'public')));
export default app;
