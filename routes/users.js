const usersRouter = require('express').Router();
const { getUser } = require('../controllers/usersController.js')
const badMethod = require('./utilityFuncs')

usersRouter.route('/:username')
    .get(getUser)
    .all(badMethod)

module.exports = usersRouter;