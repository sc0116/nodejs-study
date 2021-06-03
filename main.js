var http = require('http')
var fs = require('fs')
var qs = require('querystring')
var path = require('path')
var sanitizeHtml = require('sanitize-html')
var mysql = require('mysql')

var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'opentutorials'
})
db.connect()


var template = require('./lib/template.js')

var app = http.createServer((request,response) => {
    var _url = request.url;
    var myURL = new URL('http://localhost:3000' + _url)
    var queryData = myURL.searchParams.get('id')
    var pathname = myURL.pathname

    if (!queryData) {
      queryData = undefined
    }

    if (pathname === '/') {
      if (queryData === undefined) {
        db.query(`SELECT * FROM topic`, (error, topics) => {
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
      else {
        // fs.readdir('./data', (err, filelist) => {
        //   var filteredId = path.parse(queryData).base
        //   fs.readFile(`data/${filteredId}`, 'utf8', (err, data) => {
        //     if(err) {
        //       console.error(err)
        //       return
        //     }

        //     var title = queryData
        //     var description = data
        //     var sanitizeTitle = sanitizeHtml(title)
        //     var sanitizeDescription = sanitizeHtml(description)
        //     var list = template.list(filelist)
        //     var html = template.html(sanitizeTitle, list, `
        //       <h2>${sanitizeTitle}</h2><p>${sanitizeDescription}</p>`,
        //       `<a href="/create">create</a> 
        //       <a href="/update?id=${sanitizeTitle}">update</a> 
        //       <form action="delete-process" method="post">
        //         <input type="hidden" name="id" value="${sanitizeTitle}">
        //         <input type="submit" value="delete">
        //       </form>`) 
            
        //     response.writeHead(200)
        //     response.end(html)
        //   })
        // })

        db.query(`SELECT * FROM topic`, (error, topics) => {
          if (error) throw error

          db.query(`SELECT * FROM topic WHERE id = ?`, [queryData], (error2, topic) => {
            if (error2) throw error2

            var title = sanitizeHtml(topic[0].title)
            var description = sanitizeHtml(topic[0].description)
            var list = template.list(topics)
            var html = template.html(title, list, `
              <h2>${title}</h2><p>${description}</p>`,
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
    }
    else if (pathname === '/create') {
      fs.readdir('./data', (err, filelist) => {
        var title = 'WEB - create'
        var list = template.list(filelist)
        var html = template.html(title, list, `
        <form action="/create-process" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description">
              </textarea>
          </p>
          <p>
              <input type="submit">
          </p>
        </form>`, ``)

        response.writeHead(200)
        response.end(html)
      })
    }
    else if (pathname === '/create-process') {
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
        
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          if (err) throw err

          response.writeHead(302, {Location: `/?id=${title}`})
          response.end()
        })
      })
    }
    else if (pathname === '/update') {
      fs.readdir('./data', (err, filelist) => {
        var filteredId = path.parse(queryData).base
        fs.readFile(`data/${filteredId}`, 'utf8', (err, data) => {
          if(err) {
            console.error(err)
            return
          }

          var title = queryData
          var description = data
          var list = template.list(filelist)
          var html = template.html(title, list, 
            `
            <form action="/update-process" method="POST">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">
                ${description}
                </textarea>
             </p>
             <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`)
          
          response.writeHead(200)
          response.end(html)
        })
      })
    }
    else if (pathname === '/update-process') {
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
        
        var filteredId = path.parse(id).base
        fs.rename(`data/${filteredId}`, `data/${title}`, (err) => {
          if (err) throw err
          fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
            if (err) throw err

            response.writeHead(302, {Location: `/?id=${title}`})
            response.end()
          })
        })
      })
    }
    else if (pathname === '/delete-process') {
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
        
        var filteredId = path.parse(id).base
        fs.unlink(`data/${filteredId}`, (err) => {
          if (err) throw err
          response.writeHead(302, {Location: `/`})
          response.end()
        })
      })
    }
    else {
      response.writeHead(404)
      response.end('Not found')
    }
})
app.listen(3000)