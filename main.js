var http = require('http');
var fs = require('fs');

function templateHTML(title, list, body) {
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
    var myURL = new URL('http://localhost:3000' + _url);
    var queryData = myURL.searchParams.get('id');
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
          var template = templateHTML(title, list, `<h2>${title}</h2>
          <p>${description}</p>`)

          response.writeHead(200);
          response.end(template);
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
            var template = templateHTML(title, list, `<h2>${title}</h2>
            <p>${description}</p>`)
            
            response.writeHead(200);
            response.end(template);
          })
        })
      }
    }
    else {
      response.writeHead(404)
      response.end('Not found')
    }
});
app.listen(3000);