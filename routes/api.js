const apiRouter = require('express').Router();
const topicRouter = require('./topics.js');
const articleRouter = require('./articles.js');
const usersRouter = require('./users.js')

apiRouter.use('/topics', topicRouter)
apiRouter.use('/articles', articleRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter;