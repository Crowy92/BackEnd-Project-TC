const articleRouter = require('express').Router();
const { getArticle, patchArticle, postArticleCom, getComments, getArticles } = require('../controllers/articlesController.js')
console.log(getArticle, '<--- getArticle')

articleRouter.route('/:article_id')
    .get(getArticle)
    .patch(patchArticle)

articleRouter.route('/:article_id/comments')
    .post(postArticleCom)
    .get(getComments)

articleRouter.route('/')
    .get(getArticles)

module.exports = articleRouter;