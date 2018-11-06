const map = (task) => {
  const resource = {
    ...task,
    id: task._id,
  };
  delete resource._id;
  return resource;
};

module.exports = { map };
