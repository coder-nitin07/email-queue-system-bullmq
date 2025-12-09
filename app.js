const express = require('express');
const emailRouter = require('./routes/email.routes');
const app = express();

// parse json request
app.use(express.json());

// routes
app.use('/', emailRouter);

module.exports = app;