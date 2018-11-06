const db = require('../dbConnection');

const seedTasks = async () => {
  const tasks = [
    {
      _id: 1,
      desc: 'Drink coffee',
      completed: true,
    },
    {
      _id: 2,
      desc: 'Write code',
      completed: false,
    },
    {
      _id: 3,
      desc: 'Document work',
      completed: false,
    },
  ];
  return db.collection('tasks').insertMany(tasks);
};

const getAllTasks = async () =>
  db
    .collection('tasks')
    .find({})
    .toArray();

const getTask = async (id) => db.collection('tasks').findOne({ _id: id });

const deleteTask = async (id) => db.collection('tasks').remove({ _id: id });

const addTask = async (task) => db.collection('tasks').insertOne(task);

const saveTask = async (task, id) =>
  db
    .collection('tasks')
    .findOneAndUpdate({ _id: id }, { $set: { completed: task.completed } }, { returnOriginal: false });

const clearTasks = async () => db.collection('tasks').drop();

module.exports = {
  clearTasks,
  seedTasks,
  getAllTasks,
  getTask,
  deleteTask,
  addTask,
  saveTask,
};
