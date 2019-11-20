const connection = require('../db/connection')

const findArticle = (article_id) => {
    return connection('articles').select('*').where({ article_id }).first()
}

const updateArticle = (votes, article_id) => {
    return findArticle(article_id).then((article) => {
        const totalVotes = votes + article.votes;
        return connection('articles').where({ article_id })
            .update({ votes: totalVotes }).returning('*').then((updated) => {
                return updated[0];
            })
    })
}

const fetchArticles = () => {
    return connection('articles').select('*')
}

module.exports = { findArticle, updateArticle, fetchArticles }