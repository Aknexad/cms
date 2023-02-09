function paginatingData(data, totalDoc, page = 1, limit = 2) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const result = [...data];

  return result.slice(startIndex, endIndex);
}

module.exports = paginatingData;
