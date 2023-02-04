require('dotenv').config({ path: './config/.env' });

const BogLogic = require('../logic/blog-logic');

//middlewares

// endpoint
module.exports = async app => {
  const logic = new BogLogic();

  app.get('/', async (req, res, next) => {
    res.json({ status: 200, message: 'testing app', data: {} });
  });

  app.get('/all', async (req, res, next) => {
    const allPosts = await logic.AllPosts();
    if (allPosts === 404) {
      return res.json({ status: 404, message: 'no post fonde', payload: {} });
    }

    res.json({ status: 200, message: 'all psot', payload: { allPosts } });
  });

  app.get('/post', async (req, res, next) => {});

  app.post('/add', async (req, res, ext) => {
    const data = { title: req.body.title };

    const result = await logic.AddNewPost(data);

    if (result === 200) {
      return res.json({ status: 200, message: 'post added', payload: {} });
    }
    res.json({ staus: 400 });
  });
};
