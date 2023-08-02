module.exports.getPagingData = (result, currentPage, limit) => {
  const { count: total, rows: data } = result;
  const page = currentPage ? +currentPage : 0;
  const pageSize = Math.ceil(total / limit);
  return { data, total, pageSize, page };
};
