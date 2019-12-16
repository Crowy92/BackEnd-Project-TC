const connection = require('../db/connection')
const { findUser } = require('../models/usersModel')
const { fetchTopic } = require('../models/topicsModel')

const findArticle = (article_id) => {
    return connection.select('articles.*')
        .from('articles')
        .where('articles.article_id', article_id)
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .first()
        .then(article => {
            if (!article) {
                return Promise.reject({ status: 404, msg: 'Not found' })
            }
            return article
        })
}

const removeArticle = (article_id) => {
    return connection('articles').where({ article_id })
        .del()
        .then(deleted => {
            if (deleted === 0) return Promise.reject({ status: 404, msg: 'Not found' })
            return deleted;
        })
}

const updateArticle = (votes = 0, article_id) => {
    return connection('articles').where({ article_id })
        .increment({ votes }).returning('*').then((updated) => {
            if (updated.length < 1) return Promise.reject({ status: 404, msg: 'Not found' })
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

const fetchArticles2 = (sort_by, order, author, topic, limit = 10, p = 1) => {
    const foundArts = connection.select('articles.*').from('articles')
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
    if (author) {
        return Promise.all([foundArts, findUser(author)])
            .then(([articles, user]) => {
                if (articles.length < 1 && !user) {
                    return Promise.reject({ status: 404, msg: "Not found" })
                } else return articles;
            })
    } else if (topic) {
        return Promise.all([foundArts, fetchTopic(topic)])
            .then(([articles, topic]) => {
                if (articles.length < 1 && topic.length < 1) {
                    return Promise.reject({ status: 404, msg: "Not found" })
                } else return articles;
            })
    } else {
        return Promise.resolve(foundArts)
            .then(foundArts => {
                return foundArts
            })
    }
}

const createArticle = (body) => {
    const insertObj = {
        title: body.title, body: body.body, topic: body.topic
        , created_at: new Date(), author: body.author
    }
    if (!body.body) {
        return Promise.reject({ status: 400, msg: 'Bad request' })
    }
    return connection('articles').insert(insertObj).returning('*').then((article) => {
        return article[0];
    })
}

module.exports = {
    findArticle, updateArticle, fetchArticles
    , fetchArticlesCounter, createArticle, fetchArticles2, removeArticle
}