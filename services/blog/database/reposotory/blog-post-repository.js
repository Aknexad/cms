const Mongoose = require('mongoose');
const postModel = require('../models/blog-post');
const commentModel = require('../models/blog-comment');

class BlogRepository {
  async CreatePost(data) {
    // convert string to objectId
    const cat = data.catagory.map(x => Mongoose.Types.ObjectId(x));

    try {
      const post = await postModel.create({
        title: data.title,
        description: data.description,
        content: data.content,
        authoer: data.authoer,
        cover: data.cover,
        catagory: cat,
      });

      return post;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async GetPostById(id) {
    try {
      const post = await postModel.aggregate([
        {
          $match: {
            _id: Mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'blogcatagories',
            localField: 'catagory',
            foreignField: '_id',
            as: 'cat',
          },
        },
        {
          $project: {
            _id: '$_id',
            title: '$titel',
            description: '$description',
            content: '$content',
            authoer: '$authoer',
            cover: '$cover',
            catagory: '$cat',
          },
        },
      ]);
      return post;
    } catch (error) {
      throw new Error('internal server error');
    }
  }

  async GetAllPost(data) {
    try {
      const allPost = await postModel.aggregate([
        {
          $skip: data.skip,
        },
        {
          $limit: data.limit,
        },
        {
          $lookup: {
            from: 'blogcatagories',
            localField: 'catagory',
            foreignField: '_id',
            as: 'cat',
          },
        },
        {
          $project: {
            _id: '$_id',
            title: '$title',
            description: '$description',
            content: '$content',
            authoer: '$authoer',
            cover: '$cover',
            catagory: '$cat',
          },
        },
      ]);

      return allPost;
    } catch (error) {
      throw new Error(error);
    }
  }

  async UpdatePost(id, data) {
    try {
      const post = await postModel.findByIdAndUpdate(id, {
        title: data.title,
        description: data.description,
        content: data.content,
        cover: data.cover,
        catagory: data.catagory,
      });

      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async DeletePost(id) {
    try {
      const deletePost = await postModel.deleteOne({ _id: id });
      return deletePost;
    } catch (error) {
      throw new Error(error);
    }
  }

  async FindOne(id) {
    try {
      const data = await postModel.findById(id);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

class CommentRepository {
  async GetComment(id) {
    try {
      const comment = await commentModel.aggregate([
        {
          $match: {
            postId: id,
          },
        },
        {
          $project: {
            name: '$name',
            content: '$content',
            data: '$crateAt',
          },
        },
        {
          $sort: {
            data: 1,
          },
        },
      ]);

      return comment;
    } catch (error) {
      throw new Error(error);
    }
  }
  async CreateComment(payload) {
    try {
      const createComment = await commentModel.create({
        postId: payload.postId,
        name: payload.name,
        content: payload.content,
      });

      return createComment;
    } catch (error) {
      throw new Error(error);
    }
  }

  //
  async DeleteComment(id) {
    try {
      const deleteed = await commentModel.deleteOne({ _id: id });
      return deleteed;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = { BlogRepository, CommentRepository };
