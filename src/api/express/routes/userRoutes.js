const express = require('express');
const asyncify = require('express-asyncify');
const { getAllUsers, getUser, getUsersCount } = require('../../../repository/users');
const httpErrors = require('../../../httpErrors');
const validate = require('../../middleware/validator');
const mapper = require('../../mappers/userToResource');
const createUserCommand = require('../../../domain/commands/users/createUserCommand');
const updateUserCommand = require('../../../domain/commands/users/updateUserCommand');
const deleteUserCommand = require('../../../domain/commands/users/deleteUserCommand');
const userSchema = require('../../schemas/user');

//
// user routes
//

const router = asyncify(express.Router());

// GET /api/users
// GET /api/users?page=0&pageSize=10
router.get('/api/users', async (req, res) => {
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 20;

  const users = await getAllUsers(page, pageSize);
  const total = await getUsersCount();
  const resource = {
    total,
    page,
    pageSize,
    users: users.map((item) => mapper.map(item)),
  };
  return res.status(200).json(resource);
});

// GET /api/users/12
router.get('/api/users/:id', async (req, res) => {
  // find user
  const user = await getUser(+req.params.id);
  if (!user) {
    throw new httpErrors.NotFoundError('User not found');
  }
  const resource = mapper.map(user);
  // return resource
  return res.json(resource);
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
  const user = await createUserCommand.execute(req.body);
  const resource = mapper.map(user);
  // return resource
  return res.status(201).json(resource);
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
  const userId = Number(req.params.id);
  // Find and update
  const oldUser = await getUser(userId);
  if (!oldUser) {
    throw new httpErrors.NotFoundError('User not found');
  }
  const newUser = await updateUserCommand.execute(req.body, userId);
  const resource = mapper.map(newUser);
  return res.status(200).json(resource);
});

// DELETE /api/users/12
router.delete('/api/users/:id', async (req, res) => {
  const userId = Number(req.params.id);
  const user = await getUser(userId);
  if (!user) {
    return res.status(204).json();
  }

  await deleteUserCommand.execute(userId);
  const resource = mapper.map(user);
  return res.status(200).json(resource);
});

module.exports = router;
