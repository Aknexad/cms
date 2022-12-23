const express = require('express');
require('dotenv').config({ path: './config/.env' });

const expresApp = require('./express-app');
const connectToDB = require('./database/connectingToDB');

const startServer = async () => {
  const app = express();

  // datavase
  connectToDB();
  // expresApp
  expresApp(app);

  app.listen(process.env.PORT, () =>
    console.log(`service run on ${process.env.PORT}`)
  );
};

startServer();
