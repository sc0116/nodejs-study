const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()

app.set('port', process.env.PORT || 3000)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    console.log('app.use 미들웨어!!!')
    next()
})

app.get('/',  (req, res) => {
    req.session.id = 'hello'
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/:name', (req, res) => {
    res.send(`hello ${name}`)
})

app.use((req, res, next) => {
    res.status(404).send('404 미들웨어!!')
})

app.use((err, req, res, next) => {
    console.error(err)
    console.log('에러났지롱! 근데 안알려주지롱!')
})

app.listen(app.get('port'), () => {
    console.log('Express 서버 실행!')
})