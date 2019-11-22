
const { findArticle, updateArticle, fetchArticles
    , fetchArticlesCounter, createArticle } = require('../models/articlesModel')
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
    fetchArticlesCounter(req.query.sort_by, req.query.order, req.query.author, req.query.topic)
        .then((articles) => {
            const total_count = articles.length;
            fetchArticles(req.query.sort_by, req.query.order, req.query.author, req.query.topic
                , req.query.limit, req.query.p)
                .then((articles) => {
                    if (articles.length < 1 && req.query.author) {
                        findUser(req.query.author).then(author => {
                            if (author) res.status(200).send({ articles, total_count })
                            else res.status(404).send({ msg: 'Not found' })
                        }).catch((err) => {
                            (res.status(404).send({ msg: 'Not found' }))
                        })
                    } else if (articles.length < 1 && req.query.topic) {
                        fetchTopic(req.query.topic).then((topic) => {
                            if (topic.length > 0) res.status(200).send({ articles, total_count })
                            else (next(err))
                        }).catch((err) => {
                            res.status(404).send({ msg: 'Not found' })
                        })
                    }
                    else res.status(200).send({ articles, total_count })
                })
        }).catch((err) => {
            if (err.code) next(err)
            else res.status(404).send({ msg: 'Not found' })
        })
}