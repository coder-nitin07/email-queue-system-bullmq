const app = require('./app');
const setupBullBoard = require('./monitor/bullBoard');
const { emailQueue } = require('./queues/emailQueue');
require('dotenv').config();
require('./workers/emailWorker');

const PORT = process.env.PORT || 3000;

setupBullBoard(app, [ emailQueue ]);

app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${ PORT }`);
  console.log(`BullBoard available at http://localhost:${ PORT }/admin/queues`);
});