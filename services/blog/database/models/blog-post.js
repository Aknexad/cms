const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  content: { type: String },
  authoer: { type: String },
  cover: { type: String },
  catagory: [mongoose.ObjectId],
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;
