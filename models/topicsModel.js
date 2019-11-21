const connection = require('../db/connection')

exports.fetchTopics = () => {
    return connection('topics')
        .select('*');
}

exports.fetchTopic = (slug) => {
    return connection('topics')
        .select('*').where({ slug })
}