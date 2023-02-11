const Mongoose = require('mongoose');
const catagoryModel = require('../models/blog-catagory');

class catagoryRepository {
  async CreateCatagoty({ name, parent_id }) {
    try {
      const crateCat = await catagoryModel.create({
        name: name,
        parent_id: parent_id,
      });

      return crateCat;
    } catch (error) {
      throw new Error(error);
    }
  }

  //
  async GetCatagory() {
    try {
      const cat = await catagoryModel.find();

      // const cat = await catagoryModel.aggregate([
      //   {
      //     $match: {
      //       _id: Mongoose.Types.ObjectId(id),
      //     },
      //   },
      //   {
      //     $graphLookup: {
      //       from: 'blogcatagories',
      //       startWith: '$_id',
      //       connectFromField: '_id',
      //       connectToField: 'parent_id',
      //       as: 'ref',
      //       // maxDepth: number,
      //       depthField: 'x',
      //       // restrictSearchWithMatch: {}
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: '$ref',
      //     },
      //   },
      //   {
      //     $sort: {
      //       'ref.x': 1,
      //       'ref.name': 1,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         name: '$name',
      //         _id: '$_id',
      //       },
      //       ref_by_x: {
      //         $push: '$ref',
      //       },
      //     },
      //   },
      //   {
      //     $project: {
      //       body: '$_id.body',
      //       // _id: "$_id._id",
      //       ref: '$ref_by_x',
      //     },
      //   },
      // ]);
      return cat;
    } catch (error) {
      throw new Error(error);
    }
  }

  async UpdateCatagory(id, name, parent_id) {
    try {
      if (parent_id === null) {
        const getAndUpdateCat = await catagoryModel.findByIdAndUpdate(id, {
          name: name,
        });
        return getAndUpdateCat;
      }

      const getAndUpdateCat = await catagoryModel.findByIdAndUpdate(id, {
        name: name,
        parent_id: parent_id,
      });

      return getAndUpdateCat;
    } catch (error) {}
    throw new Error(error);
  }

  async DeleteCatagory(id) {
    try {
      const d = await catagoryModel.deleteOne({ _id: id });

      return d;
    } catch (error) {
      throw new Error(error);
    }
  }

  async FindById(id) {
    try {
      const cat = await catagoryModel.findById(id);
      return cat;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = catagoryRepository;
