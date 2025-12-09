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

const getJobStatus = async (req, res)=>{
    const { id } = req.params;

    try {
        const job = await emailQueue.getJob(id);

        if(!job){
            return res.status(404).json({ error: 'Job not found' });
        }

        const state = await job.getState();
        const progress = job.progress;
        const attemptsMade = job.attemptsMade;
        const failedReason = job.failedReason;
        const timestamps = {
            timestamp: job.timestamp,
            finishedOn: job.finishedOn,
            processedOn: job.processedOn,
        };

        res.json({
            id: job.id,
            data: job.data,
            state,
            progress,
            attemptsMade,
            failedReason,
            timestamps
        });
    } catch (err) {
        console.error('Error fetching job:', err);
        res.status(500).json({ error: 'Failed to fetch job status' });
    }
};

module.exports = { sendEmail, getJobStatus };