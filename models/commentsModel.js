const connection = require('../db/connection')
const { findArticle } = require('./articlesModel')

const findComments = (author) => {
    return connection('comments').select('*').where({ author })
}

const postComment = (body, artId) => {
    const insertObj = {
        author: body.username, article_id: artId, votes: 0
        , created_at: new Date(), body: body.body
    }
    if (!body.body || !body.username) {
        return Promise.reject({ status: 400, msg: 'Bad request' })
    }
    return connection('comments').insert(insertObj).returning('*').then((comment) => {
        return comment[0];
    })
}

const getArtComs = ({ article_id }, sort_by, order, limit = 10, p = 1) => {
    const foundComments = connection.select('comments.*')
        .from('comments')
        .where('comments.article_id', article_id)
        .leftJoin('articles'
            , 'articles.article_id', 'comments.article_id')
        .orderBy(`comments.${sort_by || 'created_at'}`, order || "desc")
        .limit(limit)
        .offset((p - 1) * limit)
    return Promise.all([foundComments, findArticle(article_id)])
        .then(([comments, article]) => {
            if (comments.length < 1 && article.length < 1) {
                return Promise.reject({ status: 404, msg: 'Not found' })
            }
            return comments
        })
}

const findComment = (comment_id) => {
    return connection('comments').select('*').where({ comment_id }).first()
}

const changeComment = (comment_id, votes = 0) => {
    return connection('comments').where({ comment_id })
        .increment({ votes }).returning('*').then((updated) => {
            if (updated.length < 1) return Promise.reject({ status: 404, msg: 'Not found' })
            return updated[0];
        })
}

const removeComment = (comment_id) => {
    return connection('comments').where({ comment_id })
        .del()
        .then(deleted => {
            if (deleted === 0) return Promise.reject({ status: 404, msg: 'Not found' })
            return deleted;
        })
}

module.exports = { findComments, postComment, getArtComs, changeComment, removeComment }