const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

/**
 * Setup BullBoard UI
 * @param {Express} app - your express app
 * @param {Array} queues - array of BullMQ Queue instances to monitor
 */

function setupBullBoard(app, queues = []) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  // Convert queues to BullBoard adapters
  const bullAdapters = queues.map((q) => new BullMQAdapter(q));

  // Create BullBoard instance
  const { router } = createBullBoard({
    queues: bullAdapters,
    serverAdapter,
  });

  // Mount BullBoard router to Express
  app.use('/admin/queues', serverAdapter.getRouter());
  app.use('/admin/queues', router);
}

module.exports = setupBullBoard;