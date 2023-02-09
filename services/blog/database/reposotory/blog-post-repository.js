const Mongoose = require('mongoose');
const postModel = require('../models/blog-post');

class BlogRepository {
  async CreatePost(data) {
    // convert string to objectId
    const cat = data.catagory.map(x => Mongoose.Types.ObjectId(x));

    try {
      const post = await postModel.create({
        titel: data.title,
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
      if (id === null) {
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
      }

      const allPost = await postModel.aggregate([
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
      return allPost;
    } catch (error) {
      throw new Error('internal server error');
    }
  }

  async GetAllPost() {
    try {
      const posts = await postModel.find();

      return posts;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = BlogRepository;
