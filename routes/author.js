const express = require('express')
const router = express.Router()

const db = require('../lib/db')
const template = require('../lib/template')
const sanitizeHtml = require('sanitize-html')

router.get('/', (req, res) => {
    db.query(`SELECT * FROM author`, (err, authors) => {
        if (err) throw err

        var title = 'Author'
        var list = template.list(req.topics)
        var table = template.authorTable(authors)
        var html = template.html(title, list,
            `${table}  
            <form action="/author/create-process" method="post">
            <p><input type="text" name="name" placeholder="name"></p>
            <p><textarea name="profile" placeholder="profile"></textarea></p>
            <p><input type="submit"></p>
            </form>
            `, '')

        res.status(200).send(html) 
    })
})

router.post('/create-process', (req, res) => {
    var post = req.body

    var name = sanitizeHtml(post.name)
    var profile = sanitizeHtml(post.profile)

    db.query(`INSERT INTO author (name, profile) VALUES (?, ?)`, [name, profile], (err, result) => {
        if (err) throw err

        res.redirect(`/author`)
    })
})

 
router.post('/update-process', (req, res) => {
    var post = req.body

    var id = post.id
    var name = post.name
    var profile = post.profile

    db.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?`, [name, profile, id], (err, result) => {
        if (err) throw err

        res.redirect('/author')
    })
})

router.post('/delete-process', (req, res) => {
    var post = req.body

    var id = post.id
    
    db.query(`DELETE FROM topic WHERE author_id = ?`, [id], (err, result) => {
        if (err) throw err

        db.query(`DELETE FROM author WHERE id = ?`, [id], (err2, result2) => {
            if (err2) throw err2
    
            res.redirect(`/author`)
        })
    })
})

router.get('/update/:authorId', (req, res) => {
    var authorId = req.params.authorId

    db.query(`SELECT * FROM author`, (err, authors) => {
        if (err) throw err

        db.query(`SELECT * FROM author WHERE id = ?`, [authorId], (err2, author) => {
            if (err2) throw err2

            var title = 'author'
            var list = template.list(req.topics)
            var html = template.html(title, list,
            `
            ${template.authorTable(authors)}
            <form action="/author/update-process" method="POST">
                <p><input type="hidden" name="id" value="${authorId}"></p>
                <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
                <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
                <p><input type="submit" value="update"></p>
            </form>
            `, ``)

            res.status(200).send(html)
        })
    })
})

module.exports = router