const express = require('express');

const { CrateChannel, SubscribMessage } = require('./message-broker');

const app = express();

main();

app.get('/', (req, res) => {
  res.send('testing app');
});

app.listen(process.env.PORT, () => console.log('testing service is running'));

async function main() {
  const channel = await CrateChannel();

  SubscribMessage(channel, 'service');
}
