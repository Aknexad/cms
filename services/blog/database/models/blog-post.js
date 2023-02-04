const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  titel: { type: String },
  description: { type: String },
  content: { type: String },
  authoer: { type: String },
  catagory: { type: [Number] },
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;
