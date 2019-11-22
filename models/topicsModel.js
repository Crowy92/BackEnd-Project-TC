const connection = require('../db/connection')

exports.fetchTopics = () => {
    return connection('topics')
        .select('*');
}

exports.fetchTopic = (slug) => {
    return connection('topics')
        .select('*').where({ slug })
}

exports.createTopic = (body) => {
    const insertObj = {
        slug: body.slug, description: body.description
    }
    return connection('topics').insert(insertObj).returning('*').then((topic) => {
        return topic[0]
    })
}