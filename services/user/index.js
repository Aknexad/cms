const express = require('express');

const error = require('./middlewares/error');

require('dotenv').config({ path: './config/.env' });

const expresApp = require('./express-app');
const connectToDB = require('./database/connectingToDB');

const startServer = async () => {
  const app = express();

  // datavase
  connectToDB();
  // expresApp
  expresApp(app);

  // catch errors
  app.use((err, req, res, next) => {
    res.status(500).send('ssomting not working');
  });

  app.listen(process.env.PORT, () =>
    console.log(`service run on ${process.env.PORT}`)
  );
};

startServer();
