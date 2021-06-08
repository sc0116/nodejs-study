var db = require('./db')
var template = require('./template')
var sanitizeHtml = require('sanitize-html')

exports.home = (request, response) => {
    var title = 'Welcome'
    var description = 'Hello, Express.js'
    var list = template.list(request.topics)
    var html = template.html(title, list,
    `<h2>${title}</h2><p>${description}</p>
    <img src="/images/hello.jpg" style="width:500px; height:400px;">`, 
    `<a href="/page/create">create</a>`)

    response.status(200).send(html)
}

exports.page = (request, response) => {
    var pageId = request.params.pageId

    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id = ?`, [pageId], (error2, topic) => {
        if (error2) throw error2

        var title = sanitizeHtml(topic[0].title)
        var description = sanitizeHtml(topic[0].description)
        var authorName = topic[0].name
        var list = template.list(request.topics)
        var html = template.html(title, list, `
            <h2>${title}</h2><p>${description}</p><p>by ${authorName}</p>`,
            `<a href="/page/create">create</a> 
            <a href="/page/update/${pageId}">update</a> 
            <form action="/page/delete-process" method="post">
                <input type="hidden" name="id" value="${pageId}">
                <input type="submit" value="delete">
            </form>`) 

        response.send(html)
    })
}