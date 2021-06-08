const express = require('express')
const router = express.Router()

const template = require('../lib/template')

router.get('/', (req, res) => {
    var title = 'Welcome'
    var description = 'Hello, Express.js'
    var list = template.list(req.topics)
    var html = template.html(title, list,
    `<h2>${title}</h2><p>${description}</p>
    <img src="/images/hello.jpg" style="width:500px; height:400px;">`, 
    `<a href="/topic/create">create</a>`)

    res.status(200).send(html)
})

module.exports = router