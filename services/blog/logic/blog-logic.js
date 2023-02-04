const BlogReop = require('../database/reposotory/blog-repository');

class BlogLogic {
  constructor() {
    this.postRepository = new BlogReop();
  }

  async AddNewPost(data) {
    const post = await this.postRepository.CreatePost(data);

    if (!post) return 4000;
    return 200;
  }

  // return app post
  async AllPosts() {
    const allPosts = await this.postRepository.GetAllPost();

    if (!allPosts) return 404;
    return allPosts;
  }
}

module.exports = BlogLogic;
