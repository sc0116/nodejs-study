var db = require('./db')
var template = require('./template')
var qs = require('querystring')

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        db.query(`SELECT * FROM author`, (err2, authors) => {
            if (err) throw err

            var title = 'Author'
            var list = template.list(topics)
            var table = template.authorTable(authors)
            var html = template.html(title, list,
                `${table}  
                <form action="/author/create-process" method="post">
                <p><input type="text" name="name" placeholder="name"></p>
                <p><textarea name="profile" placeholder="description"></textarea></p>
                <p><input type="submit"></p>
                </form>
                `, '')

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
        var name = post.name
        var profile = post.profile
    
        db.query(`INSERT INTO author (name, profile) VALUES (?, ?)`, [name, profile], (err, result) => {
            if (err) throw err
    
            response.writeHead(302, {Location: `/author`})
            response.end()
        })
    }) 
}

exports.update = (request, response) => {
    var url = new URL('http://localhost:3000' + request.url)
    var queryData = url.searchParams.get('id')

    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) throw error
        
        db.query(`SELECT * FROM author`, (error2, authors) => {
          if (error2) throw error2

            db.query(`SELECT * FROM author WHERE id = ?`, [queryData], (error3, author) => {
                if (error3) throw error3

                var title = 'author'
                var list = template.list(topics)
                var html = template.html(title, list,
                `
                ${template.authorTable(authors)}
                <form action="/author/update-process" method="POST">
                    <p><input type="hidden" name="id" value="${queryData}"></p>
                    <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
                    <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
                    <p><input type="submit" value="update"></p>
                </form>
                `, ``)

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
        var name = post.name
        var profile = post.profile

        db.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?`, [name, profile, id], (err, result) => {
          if (err) throw err

          response.writeHead(302, {Location: `/author`})
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
        
        db.query(`DELETE FROM topic WHERE author_id = ?`, [id], (err, result) => {
            if (err) throw err

            db.query(`DELETE FROM author WHERE id = ${id}`, (err2, result2) => {
                if (err2) throw err2
      
                response.writeHead(302, {Location: `/author`})
                response.end()
              })
        })
    })
}