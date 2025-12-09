const { Worker } = require('bullmq');
const IORedis = require('ioredis');
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
        if (Math.random() < 0.5){
            throw new Error('Simulated email send failure');
        }

        console.log(`job ${ job.id } processed successfully`);
        return { success: true };
    },
    { connection, concurrency: 5 }
);

// event listeners
worker.on('completed', (job)=>{
    console.log(`Job ${ job.id } completed`);
});

worker.on('failed', (job, err)=>{
    console.log(`Job ${ job.id } failed`, err.message);
});

module.exports = worker;