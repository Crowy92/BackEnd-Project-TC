const { findUser } = require('../models/usersModel')

exports.getUser = (req, res, next) => {
    findUser(req.params.username).then((user) => {
        if (user) {
            res.status(200).send({ user })
        } else {
            res.status(404).send({ msg: 'Not found' })
        }
    }).catch((err) => {
        console.log(err);
        next(err)
    })
}