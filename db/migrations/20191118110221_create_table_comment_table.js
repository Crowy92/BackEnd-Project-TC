
exports.up = function (knex) {
    return knex.schema.createTable('comments', (commentTable) => {
        commentTable.increments('comment_id').primary();
        commentTable.string('author').references('users.username');
        commentTable.integer('article_id').references('articles.article_id');
        commentTable.integer('votes');
        commentTable.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now());
        commentTable.text('body').notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('comments');
};
