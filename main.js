const express = require('express')
const app = express()
const port = 3000
const compression = require('compression')

const db = require('./lib/db')
const topic = require('./lib/topic')
const author = require('./lib/author')

const topicRouter = require('./routes/page')
const authorRouter = require('./routes/pageAuthor')


app.use(express.static('public'))
app.use(express.urlencoded({
  extended: false
 }))
app.use(compression())

app.get('*', (req, res, next) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if (error) throw error

    req.topics = topics
    next()
  }) 
})

app.use('/page', topicRouter)
app.use('/pageAuthor', authorRouter)

app.get('/', (req, res) => {
  topic.home(req, res)
})

app.use((req, res, next) => {
  res.status(404).send(`Sorry can't find that!!!`)
})

app.use((err, req, res, next) => {
  console.err(err.stack)
  res.status(500).send(`Something broke!!!`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*  Node.js 코드
var http = require('http')

var topic = require('./lib/topic')
var crud = require('./lib/crud')
var author = require('./lib/author')

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
    else if (pathname === '/author') {
      author.home(request, response)
    }
    else if (pathname === '/author/create-process') {
      author.create_process(request, response)
    }
    else if (pathname === '/author/update') {
      author.update(request, response)
    }
    else if (pathname === '/author/update-process') {
      author.update_process(request, response)
    }
    else if (pathname === '/author/delete-process') {
      author.delete_process(request, response)
    }
    else {
      response.writeHead(404)
      response.end('Not found')
    }
})
app.listen(3000)
*/