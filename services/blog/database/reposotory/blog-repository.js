const postModel = require('../models/blog-post');

class BlogRepository {
  async CreatePost(data) {
    try {
      const post = await postModel.create({
        titel: data.titel,
        description: 'a',
        content: 'dvaf',
        authoer: '123',
        catagory: [1, 3],
      });

      return post;
    } catch (error) {
      console.error(error);
    }
  }

  async GetAllPost() {
    try {
      const allPost = await postModel.find();
      return allPost;
    } catch (error) {
      throw new Error('internal server error');
    }
  }
}

module.exports = BlogRepository;
