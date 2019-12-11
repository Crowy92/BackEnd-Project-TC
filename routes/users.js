const usersRouter = require('express').Router();
const { getUser, getUsers } = require('../controllers/usersController.js')
const badMethod = require('./utilityFuncs')

usersRouter.route('/:username')
    .get(getUser)
    .all(badMethod)

usersRouter.route('/')
    .get(getUsers)
    .all(badMethod);

module.exports = usersRouter;