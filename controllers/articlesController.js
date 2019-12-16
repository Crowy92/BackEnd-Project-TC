
const { findArticle, updateArticle, fetchArticles, removeArticle
    , fetchArticlesCounter, createArticle, fetchArticles2 } = require('../models/articlesModel')
const { findComments, postComment, getArtComs } = require('../models/commentsModel')
const { findUser } = require('../models/usersModel')
const { fetchTopic } = require('../models/topicsModel')

exports.getArticle = (req, res, next) => {
    findArticle(req.params.article_id)
        .then((article) => {
            res.status(200).send({ article })
        }).catch(next)
}

exports.patchArticle = (req, res, next) => {
    updateArticle(req.body.inc_votes, req.params.article_id).then((article) => {
        res.status(200).send({ article })
    }).catch(next)
}

exports.deleteArticle = (req, res, next) => {
    removeArticle(req.params.article_id).then((response) => {
        res.sendStatus(204)
    }).catch(next)
}

exports.postArticleCom = (req, res, next) => {
    postComment(req.body, req.params.article_id).then((comment) => {
        res.status(201).send({ comment })
    }).catch(next)
}

exports.postArticle = (req, res, next) => {
    createArticle(req.body).then((article) => {
        res.status(201).send({ article })
    }).catch(next)
}

exports.getComments = (req, res, next) => {
    getArtComs(req.params, req.query.sort_by, req.query.order, req.query.limit, req.query.p)
        .then((comments) => {
            const total_count = comments.length;
            res.status(200).send({ comments, total_count })
        }).catch(next)
}

exports.getArticles = (req, res, next) => {
    const total_count = fetchArticlesCounter(req.query.sort_by, req.query.order, req.query.author, req.query.topic)
        .then(articles => {
            return articles.length;
        })
    const articles = fetchArticles2(req.query.sort_by, req.query.order, req.query.author, req.query.topic
        , req.query.limit, req.query.p)
        .then((articles) => {
            return articles;
        })
    return Promise.all([total_count, articles])
        .then(([total_count, articles]) => {
            res.status(200).send({ articles, total_count })
        }).catch(next)
}