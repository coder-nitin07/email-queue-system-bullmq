const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// redis connection
const connection = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
});

const emailQueue = new Queue('emailQueue',  {
    connection
});

module.exports = { emailQueue };