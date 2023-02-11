// const arrayToTree = (arr, parent = null) =>
//   arr
//     .filter(item => item.parent_id === parent)
//     .map(child => ({ ...child, children: arrayToTree(arr, child._id) }));

// function creatTree(arr, parent_id) {
//   if (arr.length <= 0) return result;

//     arr.filter(item => item.parent_id === parent_id).map(c=>({...c,creatTree(arr,c._id)}))

// }

const buildTreeData = (arr, parent_id = null) => {
  if (arr.length === 0) return;
  let result = arr
    .filter(item => item.parent_id === parent_id)
    .map(
      child =>
        new Object({
          _id: child._id,
          name: child.name,
          children: buildTreeData(arr, child._id),
        })
    );

  return result;
};

module.exports = buildTreeData;
