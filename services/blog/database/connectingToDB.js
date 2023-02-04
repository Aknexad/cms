const mongoose = require('mongoose');

const DB_URL = 'mongodb://0.0.0.0:27017/blog-svc';

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
