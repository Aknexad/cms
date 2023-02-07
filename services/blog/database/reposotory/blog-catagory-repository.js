const Mongoose = require('mongoose');
const catagoryModel = require('../models/blog-catagory');

class catagoryRepository {
  async CreateCatagoty({ name, parent_id }) {
    try {
      const cat = await catagoryModel.create({
        name: name,
      });

      if (parent_id !== '') {
        const getAndUpdateParent = await this.UpdateCatagory(
          parent_id,
          '',
          cat.id
        );

        return getAndUpdateParent;
      }

      return cat;
    } catch (error) {
      throw new Error(error);
    }
  }
  // teting creat catagory

  async CCT(name, parent_id) {
    try {
      if (parent_id.length < 7) {
        const cat = await catagoryModel.create({
          name: name,
          parent_id: null,
        });
        return cat;
      }

      const cat = await catagoryModel.create({
        name: name,
        parent_id: parent_id,
      });

      return cat;
    } catch (error) {
      throw new Error(error);
    }
  }

  //
  //
  async GetCatagory(id) {
    try {
      const cat = await catagoryModel.aggregate([
        {
          $match: {
            _id: Mongoose.Types.ObjectId(id),
          },
        },
        {
          $graphLookup: {
            from: 'blogcatagories',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parent_id',
            as: 'ref',
            // maxDepth: number,
            depthField: 'x',
            // restrictSearchWithMatch: {}
          },
        },
        {
          $unwind: {
            path: '$ref',
          },
        },
        {
          $sort: {
            'ref.x': 1,
            'ref.name': 1,
          },
        },
        {
          $group: {
            _id: {
              name: '$name',
              _id: '$_id',
            },
            ref_by_x: {
              $push: '$ref',
            },
          },
        },
        {
          $project: {
            body: '$_id.body',
            // _id: "$_id._id",
            ref: '$ref_by_x',
          },
        },
      ]);
      return cat;
    } catch (error) {
      throw new Error(error);
    }
  }

  async UpdateCatagory(id, name, childId) {
    try {
      if (childId === null) {
        const getAndUpdateCat = await catagoryModel.findByIdAndUpdate(id, {
          name: name,
        });
        return getAndUpdateCat;
      }

      const getAndUpdateCat = await catagoryModel.findById(id);

      getAndUpdateCat.children.push(childId);

      await getAndUpdateCat.save();

      return getAndUpdateCat;
    } catch (error) {}
    throw new Error(error);
  }
}

module.exports = catagoryRepository;
