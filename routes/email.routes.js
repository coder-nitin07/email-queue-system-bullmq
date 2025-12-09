const express = require('express');
const { sendEmail } = require('../controllers/email.controller');
const emailRouter = express.Router();

emailRouter.post('/send-email', sendEmail);
emailRouter.get('/job/:id', (req, res)=>{
    res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = emailRouter;