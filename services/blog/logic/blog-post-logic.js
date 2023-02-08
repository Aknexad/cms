// repository
const BlogPostRepo = require('../database/reposotory/blog-post-repository');
const BlogCatagoryRepo = require('../database/reposotory/blog-catagory-repository');

// middlewares
const createTree = require('../middlewares/recursion-array-tree');

class BlogLogic {
  constructor() {
    this.postRepository = new BlogPostRepo();
    this.catagoryRepo = new BlogCatagoryRepo();
  }

  async AddNewPost(data) {
    const post = await this.postRepository.CreatePost(data);

    if (!post) return 4000;
    return 200;
  }

  // return  post
  async GetPostLogic(id) {
    const getPost = await this.postRepository.GetPost(id);

    // const res = createTree()

    if (!getPost) return 404;

    let postObj = getPost;

    return postObj;
  }

  // catagory

  async CreatCatagory(data) {
    const create = await this.catagoryRepo.CreateCatagoty(data);

    if (!create) return 400;
    return create;
  }

  async GetCatagory(id) {
    const cat = await this.catagoryRepo.GetCatagory(id);

    const strfy = JSON.stringify(cat);
    const parser = JSON.parse(strfy);

    const result = createTree(parser);

    if (!cat) return 400;
    return result;
  }
}

module.exports = BlogLogic;
