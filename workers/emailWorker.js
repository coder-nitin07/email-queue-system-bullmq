const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const emailDLQ = require('../queues/emailDLQ');
require('dotenv').config();


// redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, 
});


// create worker for emailQueue
const worker = new Worker(
    'emailQueue',
    async (job) => {
        // Simulate email sending
        console.log(`Processing job ${job.id}`);
        console.log('Job data:', job.data);

        // simulate failue 50% of the time to test retries for test DLQ becasue this is basic BULLMQ project
        if (job.data.to === "fail@example.com"){
            throw new Error('Simulated email send failure');
        }

        console.log(`job ${ job.id } processed successfully`);
        return { success: true };
    },
    { 
        connection, 
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 }
    }
);

// event listeners
worker.on('completed', (job)=>{
    console.log(`Job ${ job.id } completed`);
});

worker.on('failed', async (job, err)=>{
    console.log(`Job ${ job.id } failed`, err.message);

    // Only push to DLQ after max retries
    if (job.attemptsMade >= job.opts.attempts) {
        console.log(`🚨 Job ${job.id} permanently failed. Moving to DLQ.`);

        await emailDLQ.add("dead-email-job", {
            originalData: job.data,
            failedReason: err.message,
            failedAt: new Date()
        });
    }
});

module.exports = worker;