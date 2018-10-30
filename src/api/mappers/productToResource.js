const map = (product) => {
  const resource = {
    ...product,
    id: product._id,
  };
  delete resource._id;
  return resource;
};

module.exports = { map };
