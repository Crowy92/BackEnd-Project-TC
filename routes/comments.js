const commentsRouter = require('express').Router();
const { patchComment, deleteComment } = require('../controllers/commentsController.js')
const badMethod = require('./utilityFuncs')

commentsRouter.route('/:comment_id')
    .patch(patchComment)
    .delete(deleteComment)
    .all(badMethod)

module.exports = commentsRouter;