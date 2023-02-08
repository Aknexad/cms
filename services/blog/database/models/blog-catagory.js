const mongoose = require('mongoose');

const catagoryModel = new mongoose.Schema({
  name: { type: String },
  parent_id: mongoose.ObjectId,
});

const BlogCatagory = mongoose.model('BlogCatagory', catagoryModel);

module.exports = BlogCatagory;
