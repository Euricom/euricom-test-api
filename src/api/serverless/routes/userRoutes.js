/* eslint-disable no-param-reassign */
const app = require('lambda-api')();
const { getAllUsers, getUser, getUsersCount } = require('../../../repository/users');
const httpErrors = require('../../../httpErrors');
const errorHandler = require('../../middleware/errorHandler');
const validate = require('../middleware/validator');
const mapper = require('../../mappers/userToResource');
const createUserCommand = require('../../../domain/commands/users/createUserCommand');
const updateUserCommand = require('../../../domain/commands/users/updateUserCommand');
const deleteUserCommand = require('../../../domain/commands/users/deleteUserCommand');
const userSchema = require('../../schemas/user');

app.use((req, res, next) => {
  res.cors();
  next();
});

app.use(errorHandler);

app.get('/api/users', async (req, res) => {
  try {
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
  } catch (ex) {
    res.error(ex);
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await getUser(+req.params.id);
    if (!user) {
      throw new httpErrors.NotFoundError('User not found');
    }
    const resource = mapper.map(user);

    return res.json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const validationError = await validate(userSchema, req.body);
    if (validationError) {
      throw new httpErrors.BadRequestError(validationError);
    }
    const user = await createUserCommand.execute(req.body);
    const resource = mapper.map(user);
    // return resource
    return res.status(201).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const validationError = await validate(userSchema, req.body);
    if (validationError) {
      throw new httpErrors.BadRequestError(validationError);
    }
    const userId = Number(req.params.id);

    const oldUser = await getUser(userId);
    if (!oldUser) {
      throw new httpErrors.NotFoundError('User not found');
    }
    const newUser = await updateUserCommand.execute(req.body, userId);
    const resource = mapper.map(newUser);
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await getUser(userId);
    if (!user) {
      return res.status(204).json();
    }

    await deleteUserCommand.execute(userId);
    const resource = mapper.map(user);
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

module.exports = app;
