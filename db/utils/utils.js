exports.formatDates = list => {
    const formattedDates = [];
    list.forEach(article => {
        article.created_at = new Date(article.created_at)
        formattedDates.push(article);
    })
    return formattedDates
};

exports.makeRefObj = list => {
    let refObj = {};
    list.forEach(article => {
        refObj[article.title] = article.article_id;
    })
    return refObj;
};

exports.formatComments = (comments, articleRef) => {
    comments.forEach(comment => {
        comment.article_id = articleRef[comment.belongs_to];
        delete comment.belongs_to;
        comment.author = comment.created_by;
        delete comment.created_by;
        comment.created_at = new Date(comment.created_at)
    });
    return comments;
};
