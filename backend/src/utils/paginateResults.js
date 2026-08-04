const paginateResults = (page, limit) => {
  const startIndex = (page - 1) * limit;

  return {
    limit: Number(limit),
    offset: startIndex
  };
};

module.exports = paginateResults;