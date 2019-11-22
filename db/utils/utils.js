exports.formatDates = list => {
    let localList = [...list];
    const formattedDates = [];
    localList.forEach(article => {
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
    let localComments = [...comments]
    localComments = localComments.map(comment => {
        const localComment = { ...comment }
        localComment.article_id = articleRef[localComment.belongs_to];
        delete localComment.belongs_to;
        localComment.author = localComment.created_by;
        delete localComment.created_by;
        localComment.created_at = new Date(localComment.created_at)
        return localComment
    });
    return localComments;
};
