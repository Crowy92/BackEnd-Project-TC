process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection.js')

describe('/api', () => {
    after(() => connection.destroy());
    describe('/topics', () => {
        it('GET 200, responds with an array of topics', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    expect(body.topics).to.be.an('array')
                    expect(body.topics[0]).to.contain.keys('description', 'slug')
                })
        })
    })
    describe('/users', () => {
        it('GET 200 responds with username, avatar and name of specified user', () => {
            return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(({ body }) => {
                    expect(body.user).to.contain.keys('username', 'avatar_url', 'name')
                })
        });
        it('GET for an invalid user_id - status:400 and error message', () => {
            return request(app)
                .get('/api/users/notAnID')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not found');
                });
        });
    });
    describe('/articles', () => {
        it('GET 200:article_id responds with a specific article including comment count', () => {
            return request(app)
                .get('/api/articles/3')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).to.contain.keys('author', 'title', 'article_id',
                        'body', 'topic', 'created_at', 'votes', 'comment_count')
                })
        });
        it('GET for an invalid article_id - status:400 and error message', () => {
            return request(app)
                .get('/api/articles/999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not found');
                });
        });
        it('PATCH 202:article_id updates an article by adding in votes with a body', () => {
            return request(app)
                .patch('/api/articles/3')
                .send({ inc_votes: 5 })
                .expect(202)
                .then(({ body }) => {
                    expect(body.article.votes).to.equal(5)
                }).then(() => {
                    return request(app)
                        .patch('/api/articles/3')
                        .send({ inc_votes: 5 })
                        .expect(202)
                        .then(({ body }) => {
                            expect(body.article.votes).to.equal(10)
                        })
                })
        });
        it('PATCH for an invalid article_id - status:404 and error message', () => {
            return request(app)
                .patch('/api/articles/999')
                .send({ inc_votes: 5 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Item not found');
                });
        });
        it('POST 201 updates the file and returns the posted article', () => {
            return request(app)
                .post('/api/articles/3/comments')
                .send({ username: 'butter_bridge', body: 'this is a great article!' })
                .expect(201)
                .then(({ body }) => {
                    expect(body.comment).to.contain.keys('created_at', 'body', 'votes',
                        'article_id', 'author')
                })
        });
        it('GET 200 responds with an array of comments for a specific article', () => {
            return request(app)
                .get('/api/articles/3/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments[0]).to.contain.keys('created_at', 'body', 'votes',
                        'article_id', 'author')
                })
        });
        it('GET 200 responds with an array sorted by a query', () => {
            return request(app)
                .get('/api/articles/3/comments?sort_by=body')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments[0]).to.contain.keys('created_at', 'body', 'votes',
                        'article_id', 'author')
                    expect(body.comments[0].body).to.equal('Bastet walks amongst us, and the cats are taking arms!')
                })
        });
        it('GET 200 responds with an array sorted by a query in a specified order', () => {
            return request(app)
                .get('/api/articles/3/comments?sort_by=body&order=asc')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments[0]).to.contain.keys('created_at', 'body', 'votes',
                        'article_id', 'author')
                    expect(body.comments[0].body).to.equal('I find this existence challenging')
                })
        });
        it('GET articles 200 responds with an array of all articles', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).to.be.an('array')
                    expect(body.articles[0]).to.contain.keys('author', 'body', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                })
        });
    });
})