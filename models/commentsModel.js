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

const getArtComs = ({ article_id }, sort_by, order, limit = 10, p = 1) => {
    return connection.select('comments.*')
        .from('comments')
        .where('comments.article_id', article_id)
        .leftJoin('articles'
            , 'articles.article_id', 'comments.article_id')
        .orderBy(`comments.${sort_by || 'created_at'}`, order || "desc")
        .limit(limit)
        .offset((p - 1) * limit)
}

const findComment = (comment_id) => {
    return connection('comments').select('*').where({ comment_id }).first()
}

const changeComment = (comment_id, votes = 0) => {
    return connection('comments').where({ comment_id })
        .increment({ votes }).returning('*').then((updated) => {
            return updated[0];
        })
}

const removeComment = (comment_id) => {
    return connection('comments').where({ comment_id })
        .del();
}

module.exports = { findComments, postComment, getArtComs, changeComment, removeComment }