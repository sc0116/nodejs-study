var db = require('./db')
var template = require('./template')

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) throw error

        var title = 'Welcome'
        var description = 'Hello, Node.js'
        var list = template.list(topics)
        var html = template.html(title, list,
        `<h2>${title}</h2><p>${description}</p>`, 
        `<a href="/create">create</a>`)

        response.writeHead(200)
        response.end(html)
    })
}

exports.page = (request, response) => {
    var myURL = new URL('http://localhost:3000' + request.url)
    var queryData = myURL.searchParams.get('id')

    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) throw error

        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id = ?`, [queryData], (error2, topic) => {
          if (error2) throw error2

          var title = topic[0].title
          var description = topic[0].description
          var authorName = topic[0].name
          var list = template.list(topics)
          var html = template.html(title, list, `
            <h2>${title}</h2><p>${description}</p><p>by ${authorName}</p>`,
            `<a href="/create">create</a> 
            <a href="/update?id=${queryData}">update</a> 
            <form action="delete-process" method="post">
              <input type="hidden" name="id" value="${queryData}">
              <input type="submit" value="delete">
            </form>`) 
          
          response.writeHead(200)
          response.end(html)
        })
    })
}