const { changeComment, removeComment } = require('../models/commentsModel')

exports.patchComment = (req, res, next) => {
    changeComment(req.params.comment_id, req.body.inc_votes)
        .then((comment) => {
            res.status(200).send({ comment })
        }).catch(next)
}

exports.deleteComment = (req, res, next) => {
    removeComment(req.params.comment_id).then((response) => {
        res.sendStatus(204)
    }).catch(next)
}