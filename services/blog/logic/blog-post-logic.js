const BlogPostRepo = require('../database/reposotory/blog-post-repository');
const BlogCatagoryRepo = require('../database/reposotory/blog-catagory-repository');

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

    if (!getPost) return 404;

    let postObj = getPost;
    // console.log(postObj);

    // let x = postObj.catagory;

    // const extractNameOfCat = x.map(x => x.name);

    // postObj.catagory = extractNameOfCat;

    return postObj;
  }

  // catagory

  async CreatCatagory(data) {
    const create = await this.catagoryRepo.CreateCatagoty(data);

    if (!create) return 400;
    return create;
  }

  async GetCatagory(name) {
    const cat = await this.catagoryRepo.GetCatagory(name);

    if (!cat) return 400;
    return cat;
  }
}

module.exports = BlogLogic;
