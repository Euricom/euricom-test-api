let tasks = [];

module.exports = {
  clearTasks() {
    tasks = [];
  },
  seedTasks() {
    tasks = [
      {
        id: 1,
        desc: 'Drink coffee',
        completed: true,
      },
      {
        id: 2,
        desc: 'Write code',
        completed: false,
      },
      {
        id: 3,
        desc: 'Document work',
        completed: false,
      },
    ];
  },
  getAllTasks() {
    return tasks;
  },
  getTask(id) {
    return tasks.find((task) => task.id === id);
  },
  deleteTask(task) {
    tasks = tasks.filter((item) => task.id !== item.id);
    return tasks;
  },
  addTask(task) {
    tasks.push(task);
    return task;
  },
};
