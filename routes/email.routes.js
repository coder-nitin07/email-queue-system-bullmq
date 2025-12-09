const express = require('express');
const { sendEmail, getJobStatus } = require('../controllers/email.controller');
const emailRouter = express.Router();

emailRouter.post('/send-email', sendEmail);
emailRouter.get('/job/:id', getJobStatus);

module.exports = emailRouter;