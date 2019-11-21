const express = require('express');
const app = express();
const apiRouter = require('./routes/api');

app.use(express.json());
app.use('/api', apiRouter)

app.all('/*', (req, res, next) => res.status(404).send('Route not found'));

app.use((err, req, res, next) => {
    const Codes400 = ['22P02', '42703', '23502']
    const Codes404 = ['23503']
    if (Codes400.includes(err.code)) {
        res.status(400).send({ msg: 'Bad request' })
    } else if (Codes404.includes(err.code)) {
        res.status(404).send({ msg: 'Not found' })
    }
    else next(err)
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