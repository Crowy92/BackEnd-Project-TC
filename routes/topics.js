const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topicsController.js')
const badMethod = require('./utilityFuncs')

topicsRouter.route('/')
    .get(getTopics)
    .post(postTopic)
    .all(badMethod)

module.exports = topicsRouter;