const connection = require('../db/connection')

const findUser = (username) => {
    return connection('users').select('*').where({ username }).first();
}

module.exports = { findUser }