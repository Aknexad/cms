let x = {
  _id: {
    name: 'A',
    _id: '63e0342dfaa9880f8b0266bb',
  },
  ref: [
    {
      _id: '63e0343dfaa9880f8b0266bd',
      name: 'A1',
      children: ['63e042c370a83ed5d7117569', '63e042cb70a83ed5d711756d'],
      __v: 2,
      parent_id: '63e0342dfaa9880f8b0266bb',
      x: 0,
    },
    {
      _id: '63e0344efaa9880f8b0266c1',
      name: 'A2',
      children: [],
      __v: 0,
      parent_id: '63e0342dfaa9880f8b0266bb',
      x: 0,
    },
    {
      _id: '63e042c370a83ed5d7117569',
      name: 'A1-1',
      children: [],
      __v: 0,
      parent_id: '63e0343dfaa9880f8b0266bd',
      x: 1,
    },
    {
      _id: '63e042cb70a83ed5d711756d',
      name: 'A1-2',
      children: [],
      __v: 0,
      parent_id: '63e0343dfaa9880f8b0266bd',
      x: 1,
    },
  ],
};

function sortCatagoryQuery(obj, id) {
  let rootName = obj._id.name;

  let rootRef = obj.ref;
  let a = [];

  a.push(rootName);

  rootRef.map(x => {
    x.children.forEach(element => {
      if (element === id) {
        a.push(x.name);
      }
    });
    if (x._id === id) {
      a.push(x.name);
    }
  });

  return a;
}

module.exports = sortCatagoryQuery;
