const { CrateChannel, SubscribMessage } = require('./message-broker');

async function main() {
  const channel = await CrateChannel();

  SubscribMessage(channel, 'service');
}

main();
