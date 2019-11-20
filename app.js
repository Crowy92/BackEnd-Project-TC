const express = require('express');
const app = express();
const apiRouter = require('./routes/api');

app.use(express.json());
app.use('/api', apiRouter)

app.all('/*', (req, res, next) => res.status(404).send('Route not found'));

app.use((err, req, res, next) => {
    const psqlCodes = ['22P02', '42703']
    if (psqlCodes.includes(err.code)) {
        res.status(400).send({ msg: 'Bad request' })
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.msg) {
        res.status(404).send(err.msg)
    } else next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error :(' })
})

module.exports = app;