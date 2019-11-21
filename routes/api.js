const apiRouter = require('express').Router();
const topicRouter = require('./topics.js');
const articleRouter = require('./articles.js');
const usersRouter = require('./users.js')
const commentRouter = require('./comments.js')
const fs = require('fs')
const badMethod = require('./utilityFuncs')

const sendEndpoints = (req, res, next) => {
    fs.readFile('endpoints.json', 'utf8', (err, endpoints) => {
        res.status(200).json({ endpoints: JSON.parse(endpoints) })
    })
}

apiRouter.route('/').get(sendEndpoints).all(badMethod)
apiRouter.use('/topics', topicRouter)
apiRouter.use('/articles', articleRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentRouter)

module.exports = apiRouter;