
const { findArticle, updateArticle, fetchArticles } = require('../models/articlesModel')
const { findComments, postComment, getArtComs } = require('../models/commentsModel')
const { findUser } = require('../models/usersModel')
const { fetchTopic } = require('../models/topicsModel')

exports.getArticle = (req, res, next) => {
    findArticle(req.params.article_id)
        .then((article) => {
            if (article) res.status(200).send({ article })
            else res.status(404).send({ msg: 'Not found' })
        }).catch((err) => {
            next(err)
        })
}

exports.patchArticle = (req, res, next) => {
    updateArticle(req.body.inc_votes, req.params.article_id).then((article) => {
        if (article) res.status(200).send({ article })
        else res.status(404).send({ msg: 'Item not found' })
    }).catch((err) => {
        if (err.code) next(err)
        else res.status(404).send({ msg: 'Item not found' })
    })
}

exports.postArticleCom = (req, res, next) => {
    postComment(req.body, req.params.article_id).then((comment) => {
        res.status(201).send({ comment })
    }).catch((err) => {
        if (err.code) next(err)
        else res.status(404).send({ msg: 'Item not found' })
    })
}

exports.getComments = (req, res, next) => {
    getArtComs(req.params, req.query.sort_by, req.query.order)
        .then((comments) => {
            if (comments.length < 1) {
                findArticle(req.params.article_id).then((resp) => {
                    if (resp) res.status(200).send({ comments })
                    else res.status(404).send({ msg: 'Not found' })
                })
            }
            else {
                res.status(200).send({ comments })
            }
        }).catch((err) => {
            if (err.code) next(err)
            else res.status(404).send({ msg: 'Item not found' })
        })
}

exports.getArticles = (req, res, next) => {
    fetchArticles(req.query.sort_by, req.query.order, req.query.author, req.query.topic)
        .then((articles) => {
            if (articles.length < 1 && req.query.author) {
                findUser(req.query.author).then(author => {
                    res.status(200).send({ articles })
                }).catch((err) => {
                    (res.status(404).send({ msg: 'Not found' }))
                })
            } else if (articles.length < 1 && req.query.topic) {
                fetchTopic(req.query.topic).then((topic) => {
                    if (topic.length > 0) res.status(200).send({ articles })
                    else (next(err))
                }).catch((err) => {
                    res.status(404).send({ msg: 'Not found' })
                })
            }
            else res.status(200).send({ articles })
        }).catch((err) => {
            if (err.code) next(err)
            else res.status(404).send({ msg: 'Item not found' })
        })
}