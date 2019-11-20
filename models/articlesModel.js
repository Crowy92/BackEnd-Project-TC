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