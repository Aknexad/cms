const arrayToTree = (arr, parent = null) =>
  arr
    .filter(item => item.parent_id === parent)
    .map(child => ({ ...child, children: arrayToTree(arr, child._id) }));

// function creatTree(arr, parent_id) {
//   if (arr.length <= 0) return result;

//     arr.filter(item => item.parent_id === parent_id).map(c=>({...c,creatTree(arr,c._id)}))

// }

module.exports = arrayToTree;
