// repository
const BlogPostRepo = require('../database/reposotory/blog-post-repository');
const BlogCatagoryRepo = require('../database/reposotory/blog-catagory-repository');

// middlewares
const createTree = require('../middlewares/recursion-array-tree');
const paginatingData = require('../middlewares/pagination-logic');

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
  async GetPostLogic(id, method) {
    if (method === 'cat') {
      const getPostByCatagory = [{}];
      if (!getPostByCatagory) return 404;
      return getPostByCatagory;
    }
    if (method === 'id') {
      let getPost = await this.postRepository.GetPostById(id);

      const cat = getPost[0].catagory;

      // replace catagory by tree data of catagory
      const formatCat = JSON.parse(JSON.stringify(cat));

      const formatedCatagory = createTree(formatCat);

      getPost[0].catagory = formatedCatagory;

      if (!getPost) return 404;
      return getPost;
    }

    let getAllPost = await this.postRepository.GetAllPost();

    const data = paginatingData(getAllPost, 4, 2);

    return data;
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
