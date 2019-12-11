const { findUser, findUsers } = require('../models/usersModel')

exports.getUser = (req, res, next) => {
    findUser(req.params.username).then((user) => {
        res.status(200).send({ user })
    }).catch(next)
}

exports.getUsers = (req, res, next) => {
    findUsers().then((users) => {
        res.status(200).send({ users })
    }).catch(next)
}