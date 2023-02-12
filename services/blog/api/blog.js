require('dotenv').config({ path: './config/.env' });

const BogLogic = require('../logic/blog-post-logic');

const { RPCObserver, RPCRequest } = require('../middlewares/message-broker');

//middlewares

// endpoint
module.exports = async app => {
  const logic = new BogLogic();

  // post section

  // Get Post
  app.get('/posts', async (req, res, next) => {
    try {
      const { id, pageNum, pageSize } = req.query;

      const posts = await logic.GetPostLogic(id, pageNum, pageSize);

      res.json({ status: 200, message: 'post added', payload: { posts } });
    } catch (error) {
      next(error);
    }
  });

  // Crate Post
  app.post('/posts', async (req, res, next) => {
    try {
      const { payload } = req.body;

      const result = await logic.AddNewPost(payload);

      if (result === 200) {
        return res.json({ status: 200, message: 'post added', payload: {} });
      }
      res.json({ staus: 400, message: 'try agen' });
    } catch (error) {
      next(error);
    }
  });

  // Update post
  app.put('/posts', async (req, res, next) => {
    try {
      const { id, payload } = req.body;

      const result = await logic.UpdatePost(id, payload);

      if (result === null) {
        return res
          .status(404)
          .json({ status: 404, message: 'post dont exsite', payload: {} });
      }

      return res.json({
        status: 200,
        message: 'post updated',
        payload: { result },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  // Delete post
  app.delete('/posts', async (req, res, next) => {
    try {
      const { id } = req.body;

      const result = await logic.DeletePost(id);

      if (result === null) {
        return res
          .status(404)
          .json({ status: 404, message: 'post dont exsite', payload: {} });
      }

      res.json({ status: 200, message: '', payload: { result } });
    } catch (error) {
      next(error);
    }
  });

  // catagory section

  // Get Catagory
  app.get('/catagorys', async (req, res, next) => {
    try {
      const result = await logic.GetCatagory();
      res.status(200).json({ status: 200, message: '', payload: { result } });
    } catch (error) {
      next(error);
    }
  });

  // Crate Catagory
  app.post('/catagorys', async (req, res, next) => {
    try {
      const { name, parent_id } = req.body;

      const result = await logic.CreatCatagory({ name, parent_id });

      if (result === 400) {
        return res.json({ status: 400, message: 'try agen', payload: {} });
      }

      return res.json({ status: 200, message: '', payload: { result } });
    } catch (error) {
      next(error);
    }
  });

  // Update Catagory
  app.put('/catagorys', async (req, res, next) => {
    try {
      const { id, naem, parent_id } = req.body;

      const result = await logic.UpdateCatagory(id, naem, parent_id);

      if (result === null) {
        return res
          .status(404)
          .json({ status: 404, message: 'catagory dont exsite', payload: {} });
      }

      res.json({
        status: 200,
        message: 'catagory updated',
        payload: { result },
      });
    } catch (error) {
      next(error);
    }
  });

  // Delete Catagory

  app.delete('/catagorys', async (req, res, next) => {
    try {
      const { id } = req.body;

      const result = await logic.DeleteCatagory(id);

      if (result === null) {
        return res
          .status(404)
          .json({ status: 404, message: 'post dont exsite', payload: {} });
      }

      res.json({ status: 400, message: 'try agen', payload: { result } });
    } catch (error) {
      next(error);
    }
  });

  //

  // Get Comment

  app.get('/posts/comment', async (req, res, next) => {
    try {
      const postId = req.query.postId;

      if (postId === undefined) {
        return res.status(400).json({
          status: 400,
          message: 'id of post must be set',
          payload: {},
        });
      }

      const result = await logic.GetCommentForPost(postId);

      if (result.length === 0) {
        return res.status(404).json({
          status: 404,
          message: 'no comment for this post ',
          payload: {},
        });
      }
      res.status(200).json({ status: 200, message: '', payload: { result } });
    } catch (error) {
      next(error);
    }
  });

  // Create Comment

  app.post('/posts/comment', async (req, res, next) => {
    try {
      const { payload } = req.body;

      const result = await logic.CreateCommentForPost(payload);

      if (!result) {
        return res
          .status(404)
          .json({ status: 404, message: 'try agen', payload: {} });
      }

      res
        .status(200)
        .json({ status: 200, message: 'comment add', payload: { result } });
    } catch (error) {
      next(error);
    }
  });

  // delete Comment
  app.delete('/posts/comment', async (req, res, next) => {
    try {
      const id = req.body.id;

      const result = await logic.DeleteOnComment(id);

      if (result.acknowledged === false || result.deletedCount === 0) {
        return res.status(400).json({
          status: 400,
          message: 'comment dot delete try agen',
          payload: {},
        });
      }

      res
        .status(200)
        .json({ status: 200, message: 'comment delete', payload: {} });
    } catch (error) {
      next(error);
    }
  });
};
