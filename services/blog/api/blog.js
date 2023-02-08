require('dotenv').config({ path: './config/.env' });

const BogLogic = require('../logic/blog-post-logic');

//middlewares

// endpoint
module.exports = async app => {
  const logic = new BogLogic();

  app.get('/', async (req, res, next) => {
    res.json({ status: 200, message: 'testing app', data: {} });
  });

  // post section
  app.post('/get-posts', async (req, res, next) => {
    try {
      const { id } = req.body;

      const post = await logic.GetPostLogic(id);
      if (post === 404) {
        return res.json({ status: 404, message: 'no post fonde', payload: {} });
      }

      res.json({ status: 200, message: 'all psot', payload: { post } });
    } catch (error) {
      next(error);
    }
  });

  app.post('/add', async (req, res, next) => {
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

  // author section

  app.get('/authoer', async (req, res, next) => {});

  // catagory section

  app.post('/catagory', async (req, res, next) => {
    const { id } = req.body;

    const result = await logic.GetCatagory(id);

    if (result === 400) {
      return res.json({ status: 400, message: 'try agen', payload: {} });
    }

    return res.json({ status: 200, message: '', payload: { result } });
  });
  //
  app.post('/creat-catagory', async (req, res, next) => {
    const { name, parent_id } = req.body;

    const result = await logic.CreatCatagory({ name, parent_id });

    if (result === 400) {
      return res.json({ status: 400, message: 'try agen', payload: {} });
    }

    return res.json({ status: 200, message: '', payload: { result } });
  });
};

// let payload = {
//   response: {
//     {name: "akhbar",children:{
//       root:{
//         id,
//         naem
//       }

//     }}
//   }
// }

// let x = {
//   tit:'a',
//   d:'d',
//   catagory:{
//       a:{id:"dwd231",naem:"a",chil:[a-1:{},a-2:{}]}

//   }

// }
