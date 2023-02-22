const express = require('express');

require('dotenv').config({ path: './config/.env' });

const expresApp = require('./express-app');
const connectToDB = require('./database/connectingToDB');
// const { CrateChannel } = require('./middlewares/message-broker');

const startServer = async () => {
  const app = express();

  // datavase
  await connectToDB();

  //
  // const channel = await CrateChannel();

  // expresApp
  expresApp(app);

  // catch errors
  app.use((error, req, res, next) => {
    return res.status(500).send(error.message);
  });

  app.listen(process.env.PORT, () =>
    console.log(`service run on ${process.env.PORT}`)
  );
};

startServer();
