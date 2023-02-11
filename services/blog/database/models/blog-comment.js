const mongoose = require('mongoose');

const BlogCommentSchema = new mongoose.Schema({
  userId: { type: String },
  content: { type: String },
  replay: [String],
});

const BlogComment = mongoose.model('BlogComment', BlogCommentSchema);

module.exports = BlogComment;
