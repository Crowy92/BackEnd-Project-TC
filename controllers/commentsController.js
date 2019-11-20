const { changeComment, removeComment } = require('../models/commentsModel')

exports.patchComment = (req, res, next) => {
    changeComment(req.params.comment_id, req.body.inc_votes).then((comment) => {
        res.status(202).send({ comment })
    })
}

exports.deleteComment = (req, res, next) => {
    removeComment(req.params.comment_id).then((response) => {
        if (response === 0) res.status(404).send({ msg: 'Not found' })
        else res.sendStatus(204)
    }).catch(err => {
        console.log(err)
        next(err)
    })
}