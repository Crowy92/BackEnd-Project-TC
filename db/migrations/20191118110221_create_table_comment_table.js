
exports.up = function (knex) {
    console.log("creating comment table...");
    return knex.schema.createTable('comments', (commentTable) => {
        commentTable.increments('comment_id').primary();
        commentTable.string('author').references('users.username');
        commentTable.integer('article_id').references('articles.article_id');
        commentTable.integer('votes');
        commentTable.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now());
        commentTable.text('body');
    })
};

exports.down = function (knex) {
    console.log('removing comment table...');
    return knex.schema.dropTable('comments');
};
