const Mongoose = require('mongoose');
const postModel = require('../models/blog-post');

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

  async GetAllPost() {
    try {
      const allPost = await postModel.aggregate([
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

module.exports = BlogRepository;
