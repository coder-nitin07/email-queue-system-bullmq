const express = require('express');
const { sendEmail, getJobStatus } = require('../controllers/email.controller');
const emailDLQ = require('../queues/emailDLQ');
const emailRouter = express.Router();

emailRouter.post('/send-email', sendEmail);
emailRouter.get('/job/:id', getJobStatus);
emailRouter.get('/dlq', async (req, res)=>{
    const jobs = await emailDLQ.getJobs([ 'waiting', 'failed', 'delayed' ]);
    res.json(jobs);
});

module.exports = emailRouter;