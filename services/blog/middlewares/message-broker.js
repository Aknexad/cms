const amqplib = require('amqplib');

require('dotenv').config({ path: './config/.env' });

const MB_URL = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
  locale: 'en_US',
  frameMax: 0,
  heartbeat: 0,
  vhost: '/',
};
const EXCHANGE_NAME = process.env.EXCHANGE_NAME;
const SHOPING_BINDING_KEY = process.env.TESTING_BINDING_KEY;
const USER_BINDING_KEY = process.env.USER_BINDING_KEY;

//
module.exports.CrateChannel = async () => {
  try {
    const connection = await amqplib.connect(MB_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
    return channel;
  } catch (error) {
    throw error;
  }
};

//
module.exports.PublishMessage = async (channel, bindingKey, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, bindingKey, Buffer.from(message));
    console.log('message is sended');
  } catch (error) {
    throw error;
  }
};

//
module.exports.SubscribMessage = async (channel, service, bindingKey) => {
  const appQueue = await channel.assertQueue('Queue_name');

  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, bindingKey);

  channel.consume(appQueue.queue, data => {
    console.log('received data');
    console.log(data.content.toString());
    channel.ack(data);
  });
};
