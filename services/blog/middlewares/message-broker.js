// const amqplib = require('amqplib');
// ``;
// const { v4: uuid4 } = require('uuid');

// require('dotenv').config({ path: './config/.env' });

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

//
//
//
//

let amqplibConnection = null;

const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect(MB_URL);
  }
  return await amqplibConnection.createChannel();
};

const expensiveDBOperation = (payload, fakeResponse) => {
  console.log(payload);
  console.log(fakeResponse);

  return new Promise((res, rej) => {
    setTimeout(() => {
      res(fakeResponse);
    }, 3000);
  });
};

const RPCObserver = async (RPC_QUEUE_NAME, fakeResponse) => {
  const channel = await getChannel();
  await channel.assertQueue(RPC_QUEUE_NAME, {
    durable: false,
  });
  channel.prefetch(1);
  channel.consume(
    RPC_QUEUE_NAME,
    async msg => {
      if (msg.content) {
        // DB Operation
        const payload = JSON.parse(msg.content.toString());
        const response = await expensiveDBOperation(payload, fakeResponse); // call fake DB operation

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
};

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  try {
    const channel = await getChannel();

    const q = await channel.assertQueue('', { exclusive: true });

    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: q.queue,
        correlationId: uuid,
      }
    );

    return new Promise((resolve, reject) => {
      // timeout n
      const timeout = setTimeout(() => {
        channel.close();
        resolve('API could not fullfil the request!');
      }, 8000);
      channel.consume(
        q.queue,
        msg => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeout);
          } else {
            reject('data Not found!');
          }
        },
        {
          noAck: true,
        }
      );
    });
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  const uuid = uuid4(); // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};

module.exports = {
  getChannel,
  RPCObserver,
  RPCRequest,
};
