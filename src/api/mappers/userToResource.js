const map = (user) => {
  const resource = {
    ...user,
    id: user._id,
  };
  delete resource._id;
  return resource;
};

module.exports = { map };
