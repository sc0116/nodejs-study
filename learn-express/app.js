const express = require('express')
const path = require('path')

const app = express()

app.set('port', process.env.PORT || 3000)

app.use((req, res, next) => {
    console.log('app.use 미들웨어!!!')
    next()
})

app.get('/',  (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
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