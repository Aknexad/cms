const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  frist_name: { type: String },
  last_name: { type: String },
  role: String,
  porfolio: String,
  cover: String,
});

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
