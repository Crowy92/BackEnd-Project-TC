const articleRouter = require('express').Router();
const badMethod = require('./utilityFuncs')
const { getArticle, patchArticle, postArticleCom, getComments
    , getArticles, postArticle } = require('../controllers/articlesController.js')
console.log(getArticle, '<--- getArticle')

articleRouter.route('/:article_id')
    .get(getArticle)
    .patch(patchArticle)
    .all(badMethod);

articleRouter.route('/:article_id/comments')
    .post(postArticleCom)
    .get(getComments)
    .all(badMethod);

articleRouter.route('/')
    .get(getArticles)
    .post(postArticle)
    .all(badMethod);

module.exports = articleRouter;