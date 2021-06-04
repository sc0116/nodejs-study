var db = require('./db')
var template = require('./template')
var qs = require('querystring')

exports.create = (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
      if (error) throw error
  
      db.query(`SELECT * FROM author`, (error2, authors) => {
        if (error2) throw error2
  
        var title = 'WEB - create'
        var list = template.list(topics)
        var html = template.html(title, list,
          `
          <form action="/create-process" method="POST">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description">
                </textarea>
            </p>
            <p>
              ${template.authorSelect(authors, '')}
            </p>
            <p>
                <input type="submit">
            </p>
          </form>
          `, ``)
  
        response.writeHead(200)
        response.end(html)
      })
    })
  }
  
  exports.create_process = (request, response) => {
    var body = ''
        request.on('data', (data) => {
          body += data
  
          if (body.length > 1e6) {
            request.socket.destroy()
          }
        })
  
        request.on('end', () => {
          var post = qs.parse(body)
          var title = post.title
          var description = post.description
          var author = post.author
  
          db.query(`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`,
          [title, description, author],
          (error, result) => {
            if (error) throw error
  
            response.writeHead(302, {Location: `/?id=${result.insertId}`})
            response.end()
          })
        })
  }

exports.update = (request, response) => {
    var myURL = new URL('http://localhost:3000' + request.url)
    var queryData = myURL.searchParams.get('id')

    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) throw error
        
        db.query(`SELECT * FROM topic WHERE id = ?`, [queryData], (error2, topic) => {
          if (error2) throw error2

            db.query(`SELECT * FROM author`, (error3, authors) => {
                if (error3) throw error3

                var id = topic[0].id
                var title = topic[0].title
                var description = topic[0].description
                var list = template.list(topics)
                var html = template.html(title, list,
                `
                <form action="/update-process" method="POST">
                    <input type="hidden" name="id" value="${id}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                    <textarea name="description" placeholder="description">
                    ${description}
                    </textarea>
                    </p>
                    <p>
                    ${template.authorSelect(authors, topic[0].author_id)}
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${id}">update</a>`)

                response.writeHead(200)
                response.end(html)
            })
        })
    })
}

exports.update_process = (request, response) => {
    var body = ''
      request.on('data', (data) => {
        body += data

        if (body.length > 1e6) {
          request.socket.destroy()
        }
      })

      request.on('end', () => {
        var post = qs.parse(body)
        var id = post.id
        var title = post.title
        var description = post.description
        var authorId = post.author

        db.query(`UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?`, [title, description, authorId, id], (err2, result) => {
          if (err2) throw err2

          response.writeHead(302, {Location: `/?id=${id}`})
          response.end()
        })
      })
}

exports.delete_process = (request, response) => {
    var body = ''
      request.on('data', (data) => {
        body += data

        if (body.length > 1e6) {
          request.socket.destroy()
        }
      })

      request.on('end', () => {
        var post = qs.parse(body)
        var id = post.id
        
        db.query(`DELETE FROM topic WHERE id = ${id}`, (err, result) => {
          if (err) throw err

          response.writeHead(302, {Location: `/`})
          response.end()
        })
      })
}