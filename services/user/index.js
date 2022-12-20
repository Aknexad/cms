const express = require('express');

const expresApp = require('./express-app');
const connectToDB = require('./database/connectingToDB');

const startServer = async () => {
  const app = express();

  // datavase
  connectToDB();
  // expresApp
  expresApp(app);

  app.listen(8080, () => console.log(`service run on ${8080}`));
};

startServer();
