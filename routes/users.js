const usersRouter = require('express').Router();
const { getUser } = require('../controllers/usersController.js')

usersRouter.route('/:username')
    .get(getUser)

module.exports = usersRouter;