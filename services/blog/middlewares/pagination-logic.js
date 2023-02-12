function paginatingData(pageNumber = 1, pageSize = 10) {
  let skip = parseInt(pageSize) * (parseFloat(pageNumber) - 1);

  skip = parseInt(skip);
  let limit = parseInt(pageSize);

  return { skip, limit };
}

module.exports = paginatingData;
