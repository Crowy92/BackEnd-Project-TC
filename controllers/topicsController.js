const { fetchTopics, createTopic } = require('../models/topicsModel')

exports.getTopics = (req, res, next) => {
    fetchTopics().then(topics => {
        res.status(200).send({ topics })
    }).catch(next)
}

exports.postTopic = (req, res, next) => {
    createTopic(req.body).then(topic => {
        res.status(201).send({ topic })
    }).catch(next)
}