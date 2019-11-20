
const { findArticle, updateArticle, fetchArticles } = require('../models/articlesModel')
const { findComments, postComment, getArtComs } = require('../models/commentsModel')

exports.getArticle = (req, res, next) => {
    findArticle(req.params.article_id)
        .then((article) => {
            if (article) return Promise.all([article, findComments(article.author)])
            else res.status(404).send({ msg: 'Not found' })
        }).then(([article, comments]) => {
            article.comment_count = comments.length;
            res.status(200).send({ article })
        }).catch((err) => {
            next(err)
        })
}

exports.patchArticle = (req, res, next) => {
    updateArticle(req.body.inc_votes, req.params.article_id).then((article) => {
        res.status(202).send({ article })
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
            if (comments.length < 1) res.status(404).send({ msg: 'Not found' })
            else res.status(200).send({ comments })
        }).catch((err) => {
            if (err.code) next(err)
            else res.status(404).send({ msg: 'Item not found' })
        })
}

exports.getArticles = (req, res, next) => {
    fetchArticles(req.query.sort_by, req.query.order, req.query.author, req.query.topic)
        .then((articles) => {
            if (articles.length > 0) res.status(200).send({ articles })
            else res.status(404).send({ msg: 'Not found' })
        }).catch((err) => {
            if (err.code) next(err)
            else res.status(404).send({ msg: 'Item not found' })
        })
}