const mongoose = require('mongoose');

const BlogCommentSchema = new mongoose.Schema({
  postId: { type: String, requierd: true },
  name: { type: String },
  content: { type: String },
  crateAt: { type: Date, default: Date.now() },
});

const BlogComment = mongoose.model('BlogComment', BlogCommentSchema);

module.exports = BlogComment;
