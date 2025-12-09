const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

function setupBullBoard(app, queues = []) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const bullAdapters = queues.map((q) => new BullMQAdapter(q));

  createBullBoard({
    queues: bullAdapters,
    serverAdapter,
  });

  // Only mount the serverAdapter router
  app.use('/admin/queues', serverAdapter.getRouter());
}

module.exports = setupBullBoard;