const express = require('express');
const asyncify = require('express-asyncify');
const { getAllUsers, getUser, deleteUser, addUser } = require('../data/users');
const validate = require('./middleware/validator');
const _ = require('underscore');
const sortOn = require('sort-on');

//
// user routes
//

const userSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      optional: true,
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    image: {
      type: 'string',
      optional: true,
    },
    phone: {
      type: 'string',
      optional: true,
    },
    company: {
      type: 'string',
      optional: true,
    },
    age: {
      type: 'number',
    },
  },
};

const router = asyncify(express.Router());

// GET /api/users
// GET /api/users?page=0&pageSize=10
router.get('/api/users', async (req, res) => {
  const page = Number(req.query.page || 0);
  const pageSize = Number(req.query.pageSize || 20);
  const sortBy = req.query.sort || '';
  console.log('page:', page);
  console.log('pageSize:', pageSize);
  console.log('sortBy:', sortBy);

  let users = await getAllUsers();
  if (sortBy) {
    users = sortOn(users, sortBy);
  }
  const userSet = _.chain(users)
    .rest(page * pageSize)
    .first(pageSize)
    .value();
  // return all resource
  res.json({
    users: userSet,
    total: users.length,
    page,
    pageSize,
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
router.post('/api/users', validate(userSchema), async (req, res) => {
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
router.put('/api/users/:id', validate(userSchema), async (req, res) => {
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
