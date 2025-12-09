const { emailQueue } = require("../queues/emailQueue");

const sendEmail = async (req, res)=>{
    const { to, subject, message } = req.body;

    // validate message
    if(!to || !subject || !message){
        return res.status(400).json({ message: 'to, subject and message are required' });
    }

    try {
        // add job to emailQueue
        const job = await emailQueue.add(
            'send-email',
            { to, subject, message },
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 }, // retry delay
                timeout: 30_000, // 30 seconds max per job
                removeOnComplete:  { age: 600 }, // delete job from Redis if success
                removeOnFail: false // keep job in Redis if fails
            }
        );

        res.status(202).json({ jobId: job.id });
    } catch (err) {
        console.error('Error adding job : ', err);
        res.status(500).json({ error: 'Failed to add job' });
    }
};

module.exports = { sendEmail };