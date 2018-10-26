const express = require('express');
const asyncify = require('express-asyncify');
const { getAllUsers, getUser, deleteUser, addUser, getUsersCount } = require('../../../repository/users');

//
// user routes
//

const router = asyncify(express.Router());

// GET /api/users
// GET /api/users?page=0&pageSize=10
router.get('/api/users', async (req, res) => {
  const page = req.query.page || 0;
  const pageSize = req.query.pageSize || 20;
  // console.log('page:', page);
  // console.log('pageSize:', pageSize);

  const users = await getAllUsers(page, pageSize);
  const total = await getUsersCount();

  // return all resource
  return res.json({
    total,
    page,
    pageSize,
    users: users,
  });
});

// GET /api/users/12
router.get('/api/users/:id', async (req, res) => {
  // find user
  const user = await getUser(+req.params.id);
  if (!user) {
    return res.status(404).json({
      code: 'Not Found',
      message: 'User not found',
    });
  }

  // return resource
  return res.json(user);
});

/* POST /api/users
{
  "firstName": "peter",
  "lastName": "cosemans",
  "age": 52,
  "email": "peter.cosemans@gmail.com",
  "role": "admin"
}
*/
router.post('/api/users', async (req, res) => {
  // Get resource
  const resource = req.body;

  // Assign number
  resource.id = new Date().valueOf();

  // Add to users's
  const user = await addUser(resource);

  // return resource
  res.status(201).json(user);
});

/* PUT /api/users/12
{
  "firstName": "peter",
  "lastName": "cosemans",
  "age": 52,
  "email": "peter.cosemans@gmail.com",
  "role": "admin"
}
*/
router.put('/api/users/:id', async (req, res) => {
  // Get resource
  const resource = req.body;

  // Find and update
  const user = await getUser(Number(req.params.id));
  if (!user) {
    return res.status(404).json({
      code: 'Not Found',
      message: 'User not found',
    });
  }

  user.firstName = resource.firstName;
  user.lastName = resource.lastName;
  user.email = resource.email;
  user.age = Number(resource.age);
  user.company = resource.company;

  return res.status(200).json(user);
});

// DELETE /api/users/12
router.delete('/api/users/:id', async (req, res) => {
  let user = getUser(Number(req.params.id));
  if (!user) {
    return res.status(204).json();
  }

  users = await deleteUser(user);
  return res.status(200).json(user);
});

module.exports = router;
