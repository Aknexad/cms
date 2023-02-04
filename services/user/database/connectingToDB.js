const mongoose = require('mongoose');

const DB_URL =
  'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/user-svc?replicaSet=myReplicaSet&tls=true';

module.exports = async () => {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connect to DB');
  } catch (error) {
    console.error('Error ============ ON DB Connection');
    console.log(error);
  }
};
