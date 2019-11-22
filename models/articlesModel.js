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

const fetchArticles = (sort_by, order, author, topic, limit = 10, p = 1) => {
    return connection.select('articles.*').from('articles')
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .orderBy(sort_by || "created_at", order || "desc")
        .modify((query) => {
            if (author) query.where('articles.author', author);
            if (topic) query.where({ topic });
        })
        .limit(limit)
        .offset((p - 1) * limit)
}

const fetchArticlesCounter = (sort_by, order, author, topic) => {
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

const createArticle = (body) => {
    const insertObj = {
        title: body.title, body: body.body, topic: body.topic
        , created_at: new Date(), author: body.author
    }
    return connection('articles').insert(insertObj).returning('*').then((article) => {
        return article[0];
    })
}

module.exports = {
    findArticle, updateArticle, fetchArticles
    , fetchArticlesCounter, createArticle
}