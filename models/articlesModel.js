const connection = require('../db/connection')

const findArticle = (article_id) => {
    return connection.select('articles.*')
        .from('articles')
        .where('articles.article_id', article_id)
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .first()
}

const updateArticle = (votes = 0, article_id) => {
    return connection('articles').where({ article_id })
        .increment({ votes }).returning('*').then((updated) => {
            return updated[0];
        })
}

const fetchArticles = (sort_by, order, author, topic) => {
    return connection.select('articles.*').from('articles')
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .orderBy(sort_by || "created_at", order || "desc")
        .modify((query) => {
            if (author) query.where('articles.author', author);
            if (topic) query.where({ topic });
        })
}

module.exports = { findArticle, updateArticle, fetchArticles }