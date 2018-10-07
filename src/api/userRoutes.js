const _ = require('underscore');
const express = require('express');
const { getAllUsers, getUser, deleteUser, addUser } = require('../data/users');

//
// user routes
//

const router = express.Router();

// GET /api/users
// GET /api/users?page=0&pageSize=10
router.get('/api/users', (req, res) => {
  const page = req.query.page || 0;
  const pageSize = req.query.pageSize || 20;
  console.log('page:', page);
  console.log('pageSize:', pageSize);

  const users = getAllUsers();
  const userSet = _.chain(users)
    .rest(page * pageSize)
    .first(pageSize)
    .value();
  // return all resource
  res.json({
    total: userSet.length,
    users: userSet,
  });
});

// GET /api/users/12
router.get('/api/users/:id', (req, res) => {
  // find user
  const user = getUser(+req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'User not found' });
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
router.post('/api/users', (req, res) => {
  // Get resource
  const resource = req.body;
  console.log('post', req.body);

  // Assign number
  resource.id = new Date().valueOf();

  // Add to users's
  const user = addUser(resource);

  // return resource
  res.status(200).json(user);
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
router.put('/api/users/:id', (req, res) => {
  // Get resource
  const resource = req.body;
  console.log('put', req.body);

  // Find and update
  const user = getUser(Number(req.params.id));
  if (!user) {
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'User not found' });
  }

  user.firstName = resource.firstName;
  user.lastName = resource.lastName;
  user.email = resource.email;
  user.age = Number(resource.age);
  user.company = resource.company;

  return res.status(200).json(user);
});

// DELETE /api/users/12
router.delete('/api/users/:id', (req, res) => {
  let user = getUser(Number(req.params.id));
  if (!user) {
    return res.status(204).json();
  }

  users = deleteUser(user);
  return res.status(200).json(user);
});

module.exports = router;
