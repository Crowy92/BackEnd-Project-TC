const connection = require('../db/connection')

const findComments = (author) => {
    return connection('comments').select('*').where({ author })
}

const postComment = (body, artId) => {
    const insertObj = {
        author: body.username, article_id: artId, votes: 0
        , created_at: new Date(), body: body.body
    }
    return connection('comments').insert(insertObj).returning('*').then((comment) => {
        return comment[0];
    })
}

const getArtComs = (id, sort_by, order) => {
    return connection.select('*').from('comments').leftJoin('articles'
        , 'articles.article_id', 'comments.article_id')
        .orderBy(`comments.${sort_by || 'created_at'}`, order || "desc")
}

module.exports = { findComments, postComment, getArtComs }