// repository
const BlogPostRepo = require('../database/reposotory/blog-post-repository');
const BlogCatagoryRepo = require('../database/reposotory/blog-catagory-repository');

// middlewares
const buildTreeData = require('../middlewares/recursion-array-tree');
const paginatingData = require('../middlewares/pagination-logic');

class BlogLogic {
  constructor() {
    this.postRepository = new BlogPostRepo();
    this.catagoryRepo = new BlogCatagoryRepo();
  }

  //
  async AddNewPost(data) {
    const post = await this.postRepository.CreatePost(data);

    if (!post) return 4000;
    return 200;
  }

  // return post all id and by catagory
  async GetPostLogic(id, page) {
    try {
      // by id
      if (id !== undefined) {
        let getPost = await this.postRepository.GetPostById(id);

        const cat = getPost[0].catagory;

        // replace catagory by tree data of catagory
        const formatCat = JSON.parse(JSON.stringify(cat));

        const formatedCatagory = buildTreeData(formatCat);

        getPost[0].catagory = formatedCatagory;

        if (!getPost) return 404;

        return getPost;
      }

      // all
      let getAllPost = await this.postRepository.GetAllPost();
      // replace catagory  object white tree data
      const cat = getAllPost.map(x => {
        const convertId = JSON.parse(JSON.stringify(x.catagory));

        const formatingCatagory = buildTreeData(convertId);

        return (x.catagory = formatingCatagory);
      });
      getAllPost.catagory = cat;

      // const data = paginatingData(getAllPost, 4);

      return getAllPost;
    } catch (error) {
      throw new Error(error);
    }
  }

  async UpdatePost(id, payload) {
    try {
      const chackPost = await this.postRepository.FindOne(id);
      if (!chackPost) {
        return chackPost;
      }

      const updatePost = await this.postRepository.UpdatePost(id, payload);

      return updatePost;
    } catch (error) {
      throw new Error(error);
    }
  }

  async DeletePost(id) {
    try {
      const chackPost = await this.postRepository.FindOne(id);
      if (!chackPost) {
        return chackPost;
      }

      const deleteed = await this.postRepository.DeletePost(id);
      return deleteed;
    } catch (error) {
      throw new Error(error);
    }
  }

  //
  // catagory
  //

  async CreatCatagory(data) {
    const create = await this.catagoryRepo.CreateCatagoty(data);

    if (!create) return 400;
    return create;
  }

  async GetCatagory() {
    const cat = await this.catagoryRepo.GetCatagory();

    const strfy = JSON.stringify(cat);
    const parser = JSON.parse(strfy);

    const result = buildTreeData(parser);

    if (!cat) return 400;
    return result;
  }

  async UpdateCatagory(id, name, parent_id) {
    const chackCat = await this.catagoryRepo.FindById(id);
    if (!chackCat) return chackCat;

    const updateResulre = await this.catagoryRepo.UpdateCatagory(
      id,
      name,
      parent_id
    );
    return updateResulre;
  }

  async DeleteCatagory(id) {
    try {
      const chackCat = await this.catagoryRepo.FindById(id);
      if (!chackCat) return chackCat;

      const deleteResult = await this.catagoryRepo.DeleteCatagory(id);
      return deleteResult;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = BlogLogic;
