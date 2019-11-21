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
        it('GET for a non existant article_id - status:404 and error message', () => {
            return request(app)
                .get('/api/articles/999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not found');
                });
        });
        it('GET for an invalid article_id - status:400 bad request', () => {
            return request(app)
                .get('/api/articles/banana')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Bad request');
                });
        });
        it('PATCH 200:article_id updates an article by adding in votes with a body', () => {
            return request(app)
                .patch('/api/articles/3')
                .send({ inc_votes: 5 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.article.votes).to.equal(5)
                }).then(() => {
                    return request(app)
                        .patch('/api/articles/3')
                        .send({ inc_votes: 5 })
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.article.votes).to.equal(10)
                        })
                })
        });
        it('PATCH for an article with no body should return the same article', () => {
            return request(app)
                .patch('/api/articles/3')
                .send()
                .expect(200)
                .then(({ body }) => {
                    expect(body.article.votes).to.equal(10)
                });
        });
        it('PATCH for an non-existant article_id - status:404 and error message', () => {
            return request(app)
                .patch('/api/articles/999')
                .send({ inc_votes: 5 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Item not found');
                });
        });
        it('PATCH for an invalid article_id - status:400 bad request', () => {
            return request(app)
                .patch('/api/articles/banana')
                .send({ inc_votes: 'bird' })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Bad request');
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
        it('POST 404 updateing an article that doesn"t exist fails', () => {
            return request(app)
                .post('/api/articles/1000/comments')
                .send({ username: 'butter_bridge', body: 'this is a great article!' })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not found');
                });
        });
        it('POST for an invalid article_id - status:400 bad request', () => {
            return request(app)
                .post('/api/articles/banana/comments')
                .send({ inc_votes: 'bird' })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Bad request');
                });
        });
        it('`POST` 400 request does not include all the required keys', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send()
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Bad request');
                });
        });
        it('GET 200 responds with an array of comments for a specific article', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments[0]).to.contain.keys('created_at', 'body', 'votes',
                        'article_id', 'author')
                })
        });
        it('GET 404 responds a not found message if none can be found', () => {
            return request(app)
                .get('/api/articles/343/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not found');
                })
        });
        it('GET 200 responds with an array sorted by a query', () => {
            return request(app)
                .get('/api/articles/1/comments?sort_by=votes')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments[0]).to.contain.keys('created_at', 'body', 'votes',
                        'article_id', 'author')
                    expect(body.comments[0].votes).to.equal(100)
                })
        });
        it('GET 200 responds with an empty array when there are no comments', () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments.length).to.equal(0)
                })
        });
        it('GET reponds with an error if asked to sort by something that doesn"t exist', () => {
            return request(app)
                .get('/api/articles/1/comments?sort_by=pineapple')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Bad request');
                })
        });
        it('GET reponds with an error if asked to sort by something that doesn"t exist', () => {
            return request(app)
                .get('/api/articles/1/comments?order=not-a-valid-order')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments[0]).to.contain.keys('created_at', 'body', 'votes',
                        'article_id', 'author')
                })
        });
        it('GET 200 responds with an array sorted by a query in a specified order', () => {
            return request(app)
                .get('/api/articles/1/comments?sort_by=body&order=asc')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments[0]).to.contain.keys('created_at', 'body', 'votes',
                        'article_id', 'author')
                    expect(body.comments[0].body).to.equal('Ambidextrous marsupial')
                })
        });
        it('GET articles 200 responds with an array of all articles including their comment count', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).to.be.an('array')
                    expect(body.articles[0]).to.contain.keys('author', 'body', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                })
        });
        it('DELETE request on api/articles responds with method not allowed message', () => {
            return request(app)
                .post('/api/articles')
                .expect(405)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Method not allowed')
                })
        });
        it('GET articles 200 responds with an array sorted by date', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).to.be.an('array')
                    expect(body.articles[0].topic).to.equal('mitch')
                    expect(body.articles[0].comment_count).to.equal('13')
                })
        });
        it('GET articles 200 responds with an empty array when seraching for a topic that doesn"t exist', () => {
            return request(app)
                .get('/api/articles?author=lurker')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).to.be.an('array')
                    expect(body.articles.length).to.equal(0)
                })
        });
        it('GET articles 200 responds with an array filtered by topic and sorted', () => {
            return request(app)
                .get('/api/articles?topic=mitch&sort_by=comment_count')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).to.be.an('array')
                    expect(body.articles[0].topic).to.equal('mitch')
                    expect(body.articles[0].comment_count).to.equal('13')
                })
        });
        it('GET articles 200 responds with an empty array when seraching for a topic with no articles', () => {
            return request(app)
                .get('/api/articles?topic=paper')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).to.be.an('array')
                    expect(body.articles.length).to.equal(0)
                })
        });
        it('GET articles 200 responds with an article with 0 comments, not null', () => {
            return request(app)
                .get('/api/articles/4')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).to.be.an('object')
                    expect(body.article.votes).to.equal(0)
                })
        });
        it('GET articles 200 responds with an article with 13 comments', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).to.be.an('object')
                    expect(body.article.comment_count).to.equal('13')
                })
        });
        it('GET articles 400 responds with an error if query is bad', () => {
            return request(app)
                .get('/api/articles?topic=mitch&sort_by=strawberries')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Bad request');
                })
        });
        it('GET articles 404 responds with a not found if search includes non-existant criteria', () => {
            return request(app)
                .get('/api/articles?topic=strawberry')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not found');
                })
        });
        it('GET articles 200 responds with an array filtered by author', () => {
            return request(app)
                .get('/api/articles?author=icellusedkars')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).to.be.an('array')
                    expect(body.articles[0].author).to.equal('icellusedkars')
                })
        });
    });
    describe('/comments', () => {
        it('200 comment updated with new votes returned', () => {
            return request(app)
                .patch('/api/comments/4')
                .send({ inc_votes: 13 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.comment.votes).to.equal(-87)
                })
        });
        it('400 error message if incorrect type input is provided', () => {
            return request(app)
                .patch('/api/comments/1')
                .send({ inc_votes: 'apple' })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Bad request')
                })
        });
        it('404 error if unable to find the user/comment id', () => {
            return request(app)
                .patch('/api/comments/1000')
                .send({ inc_votes: 10 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not found')
                })
        });
        it('400 error if invalid id is input, bad request is returned', () => {
            return request(app)
                .patch('/api/comments/not-a-valid-id')
                .send({ inc_votes: 10 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Bad request')
                })
        });
        it('204 comment deleted and message returned when provided valid id', () => {
            return request(app)
                .delete('/api/comments/4')
                .expect(204)
        });
        it('404 returns a message telling the user there was no such comment if none is found', () => {
            return request(app)
                .delete('/api/comments/5555')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not found')
                })
        });
    });
    describe('/', () => {
        it('GET 200 sends a JSON object with all the endpoints and what they do', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body }) => {
                    expect(body.endpoints).to.be.an('object')
                })
        });
        it('GET 200 sends a JSON object with all the endpoints and what they do', () => {
            return request(app)
                .delete('/api')
                .expect(405)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Method not allowed')
                })
        });
    });
})