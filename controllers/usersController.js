const { findUser } = require('../models/usersModel')

exports.getUser = (req, res, next) => {
    findUser(req.params.username).then((user) => {
        res.status(200).send({ user })
    }).catch(next)
}