const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topicsController.js')
const badMethod = require('./utilityFuncs')

topicsRouter.route('/')
    .get(getTopics)
    .all(badMethod)

module.exports = topicsRouter;