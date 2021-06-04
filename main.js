var http = require('http')
var qs = require('querystring')

var db = require('./lib/db')
var topic = require('./lib/topic')
var crud = require('./lib/crud')

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
        topic.home(request, response)
      }
      else {
        topic.page(request, response)
      }
    }
    else if (pathname === '/create') {
      crud.create(request, response)
    }
    else if (pathname === '/create-process') {
      crud.create_process(request, response)
    }
    else if (pathname === `/update`) {
      crud.update(request, response)
    }
    else if (pathname === `/update-process`) {
      crud.update_process(request, response)
    }
    else if (pathname === '/delete-process') {
      crud.delete_process(request, response)
    }
    else {
      response.writeHead(404)
      response.end('Not found')
    }
})
app.listen(3000)