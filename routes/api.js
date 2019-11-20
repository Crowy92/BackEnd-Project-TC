const apiRouter = require('express').Router();
const topicRouter = require('./topics.js');
const articleRouter = require('./articles.js');
const usersRouter = require('./users.js')
const commentRouter = require('./comments.js')

apiRouter.use('/topics', topicRouter)
apiRouter.use('/articles', articleRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentRouter)

module.exports = apiRouter;