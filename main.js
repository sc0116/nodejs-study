var http = require('http')
var fs = require('fs')
var qs = require('querystring')

function templateHTML(title, list, body, control) {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `
}

function templateList(filelist) {
  var list = '<ul>'
    for (i = 0; i < filelist.length; i++){
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
    }
    list += '</ul>'
  return list
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var myURL = new URL('http://localhost:3000' + _url)
    var queryData = myURL.searchParams.get('id')
    var pathname = myURL.pathname

    if (!queryData) {
      queryData = undefined
    }

    if (pathname === '/') {
      if (queryData === undefined) {
        fs.readdir('./data', (err, filelist) => {
          var title = 'Welcome'
          var description = 'Hello, Node.js'
          var list = templateList(filelist)
          var template = templateHTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`, 
            `<a href="/create">create</a>`)

          response.writeHead(200)
          response.end(template)
        })
      }
      else {
        fs.readdir('./data', (err, filelist) => {
          fs.readFile(`data/${queryData}`, 'utf8', (err, data) => {
            if(err) {
              console.error(err)
              return
            }

            var title = queryData
            var description = data
            var list = templateList(filelist)
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,
              `<a href="/create">create</a> 
              <a href="/update?id=${title}">update</a> 
              <form action="delete-process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>`)
            
            response.writeHead(200)
            response.end(template)
          })
        })
      }
    }
    else if (pathname === '/create') {
      fs.readdir('./data', (err, filelist) => {
        var title = 'WEB - create'
        var list = templateList(filelist)
        var template = templateHTML(title, list, `
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
        response.end(template)
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
        fs.readFile(`data/${queryData}`, 'utf8', (err, data) => {
          if(err) {
            console.error(err)
            return
          }

          var title = queryData
          var description = data
          var list = templateList(filelist)
          var template = templateHTML(title, list, 
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
          response.end(template)
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
        
        fs.rename(`data/${id}`, `data/${title}`, (err) => {
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
        
        fs.unlink(`data/${id}`, (err) => {
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