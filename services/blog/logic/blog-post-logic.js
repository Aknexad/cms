// repository
const {
  BlogRepository,
  CommentRepository,
} = require('../database/reposotory/blog-post-repository');
const BlogCatagoryRepo = require('../database/reposotory/blog-catagory-repository');

// middlewares
const buildTreeData = require('../middlewares/recursion-array-tree');
const paginatingData = require('../middlewares/pagination-logic');

// Rabbit MQ
const { RPCRequest } = require('../middlewares/message-broker');

class BlogLogic {
  constructor() {
    this.postRepository = new BlogRepository();
    this.catagoryRepo = new BlogCatagoryRepo();
    this.commentRepo = new CommentRepository();
  }

  //
  async AddNewPost(data) {
    const post = await this.postRepository.CreatePost(data);

    if (!post) return 4000;
    return 200;
  }

  // return post all id and by catagory
  async GetPostLogic(id, pageNum, pageSize) {
    try {
      // by id
      if (id !== undefined) {
        let getPost = await this.postRepository.GetPostById(id);

        if (!getPost) throw new Error('Post dont exist');

        const cat = getPost[0].catagory;

        // replace catagory by tree data of catagory
        const formatCat = JSON.parse(JSON.stringify(cat));

        const formatedCatagory = buildTreeData(formatCat);

        const authoer = await RPCRequest('BRPC', {
          type: 'getName',
          data: getPost[0].authoer,
        });

        getPost[0].catagory = formatedCatagory;
        getPost[0].authoer = authoer;

        return getPost;
      }

      // all
      const data = paginatingData(pageNum, pageSize);
      let getAllPost = await this.postRepository.GetAllPost(data);
      // replace catagory  object white tree data
      const cat = getAllPost.map(x => {
        const convertId = JSON.parse(JSON.stringify(x.catagory));

        const formatingCatagory = buildTreeData(convertId);

        return (x.catagory = formatingCatagory);
      });
      getAllPost.catagory = cat;

      return getAllPost;
    } catch (error) {
      throw new Error(error);
    }
  }

  async UpdatePost(id, payload) {
    const chackPost = await this.postRepository.FindOne(id);
    if (!chackPost) throw new Error('post dose not exist');

    const updatePost = await this.postRepository.UpdatePost(id, payload);

    return updatePost;
  }

  async DeletePost(id) {
    try {
      const chackPost = await this.postRepository.FindOne(id);
      if (!chackPost) throw new Error('post dose not exist');

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

    return create;
  }

  async GetCatagory() {
    const cat = await this.catagoryRepo.GetCatagory();
    if (cat.length === 0) throw new Error('no existing catagory');

    const strfy = JSON.stringify(cat);
    const parser = JSON.parse(strfy);

    const result = buildTreeData(parser);

    if (!cat) return 400;
    return result;
  }

  async UpdateCatagory(id, name, parent_id) {
    const chackCat = await this.catagoryRepo.FindById(id);
    if (!chackCat) throw new Error('catagory dosent exist');

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
      if (!chackCat) throw new Error('catagory dosent exist');

      const deleteResult = await this.catagoryRepo.DeleteCatagory(id);
      return deleteResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  // comment

  async GetCommentForPost(id) {
    const postComment = await this.commentRepo.GetComment(id);

    return postComment;
  }

  //
  async CreateCommentForPost(payload) {
    const postComment = await this.commentRepo.CreateComment(payload);

    return postComment;
  }

  //
  async DeleteOnComment(id) {
    const postComment = await this.commentRepo.DeleteComment(id);

    return postComment;
  }
}

module.exports = BlogLogic;
