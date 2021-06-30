const express = require('express')
const router = express.Router() 

const db = require('../lib/db')
const template = require('../lib/template')
const sanitizeHtml = require('sanitize-html')
 
router.get('/create', (req, res) => {
    db.query(`SELECT * FROM author`, (err, authors) => {
        if (err) throw err

        var title = 'WEB - create'
        var list = template.list(req.topics)
        var html = template.html(sanitizeHtml(title) , list,
            `
            <form action="/topic/create-process" method="POST">
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

        res.send(html)
    })
})
  
router.post('/create-process', (req, res) => {
    var post = req.body
    var title = post.title
    var description = post.description
    var author = post.author

    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`,
    [title, description, author],
    (error, result) => {
        if (error) throw error

        res.redirect(`/topic/${result.insertId}`)
    })
})
  
router.post('/update-process', (req, res) => {
    var post = req.body
    
    var id = post.id
    var title = post.title
    var description = post.description
    var authorId = post.author

    db.query(`UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?`, [title, description, authorId, id], (err, result) => {
        if (err) throw err

        res.redirect(`/topic/${id}`)
    })
})
  
router.post('/delete-process', (req, res) => {
    var post = req.body

    var id = post.id
    
    db.query(`DELETE FROM topic WHERE id = ?`, [id], (err, result) => {
        if (err) throw err

        res.redirect('/')
    })
})

router.get('/update/:pageId', (req, res) => {
    var pageId = req.params.pageId
        
    db.query(`SELECT * FROM topic WHERE id = ?`, [pageId], (err, topic) => {
        if (err) throw err

        db.query(`SELECT * FROM author`, (err2, authors) => {
            if (err2) throw err2

            var id = topic[0].id
            var title = sanitizeHtml(topic[0].title)
            var description = topic[0].description
            var list = template.list(req.topics)
            var html = template.html(title, list,
            `
            <form action="/topic/update-process" method="POST">
                <input type="hidden" name="id" value="${id}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p><textarea name="description" placeholder="description"> ${description}</textarea></p>
                <p>${template.authorSelect(authors, topic[0].author_id)}</p>
                <p><input type="submit"></p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update/${id}">update</a>`)

            res.status(200).send(html)
        })
    })
})

router.get('/:pageId', (req, res) => {
    var pageId = req.params.pageId

    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id = ?`, [pageId], (err, topic) => {
        if (err) throw err

        var title = sanitizeHtml(topic[0].title)
        var description = sanitizeHtml(topic[0].description)
        var authorName = topic[0].name
        var list = template.list(req.topics)
        var html = template.html(title, list, `
            <h2>${title}</h2><p>${description}</p><p>by ${authorName}</p>`,
            `<a href="/topic/create">create</a> 
            <a href="/topic/update/${pageId}">update</a> 
            <form action="/topic/delete-process" method="post">
                <input type="hidden" name="id" value="${pageId}">
                <input type="submit" value="delete">
            </form>`) 

        res.send(html)
    })
}) 

module.exports = router