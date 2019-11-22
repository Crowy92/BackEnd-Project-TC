const connection = require('../db/connection')

const findUser = (username) => {
    return connection('users').select('*').where({ username }).first()
        .then(user => {
            if (!user) return Promise.reject({ status: 404, msg: 'Not found' })
            return user
        })
}

module.exports = { findUser }