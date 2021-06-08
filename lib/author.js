var db = require('./db')
var template = require('./template')
var qs = require('querystring')
var sanitizeHtml = require('sanitize-html')

exports.home = (request, response) => {
    db.query(`SELECT * FROM author`, (err, authors) => {
        if (err) throw err

        var title = 'Author'
        var list = template.list(request.topics)
        var table = template.authorTable(authors)
        var html = template.html(title, list,
            `${table}  
            <form action="/pageAuthor/create-process" method="post">
            <p><input type="text" name="name" placeholder="name"></p>
            <p><textarea name="profile" placeholder="profile"></textarea></p>
            <p><input type="submit"></p>
            </form>
            `, '')

        response.status(200).send(html) 
    })
}

exports.create_process = (request, response) => {
    var post = request.body
    var name = sanitizeHtml(post.name)
    var profile = sanitizeHtml(post.profile)

    db.query(`INSERT INTO author (name, profile) VALUES (?, ?)`, [name, profile], (err, result) => {
        if (err) throw err

        response.redirect(`/pageAuthor/author`)
    })
}

exports.update = (request, response) => {
    var authorId = request.params.authorId

    db.query(`SELECT * FROM author`, (error2, authors) => {
        if (error2) throw error2

        db.query(`SELECT * FROM author WHERE id = ?`, [authorId], (error3, author) => {
            if (error3) throw error3

            var title = 'author'
            var list = template.list(request.topics)
            var html = template.html(title, list,
            `
            ${template.authorTable(authors)}
            <form action="/pageAuthor/update-process" method="POST">
                <p><input type="hidden" name="id" value="${authorId}"></p>
                <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
                <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
                <p><input type="submit" value="update"></p>
            </form>
            `, ``)

            response.status(200).send(html)
        })
    })
}

exports.update_process = (request, response) => {
    var post = request.body
    var id = post.id
    var name = post.name
    var profile = post.profile
    db.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?`, [name, profile, id], (err, result) => {
        if (err) throw err

        response.redirect('/pageAuthor/author')
    })
}

exports.delete_process = (request, response) => {
    var post = request.body
    var id = post.id
    
    db.query(`DELETE FROM topic WHERE author_id = ?`, [id], (err, result) => {
        if (err) throw err

        db.query(`DELETE FROM author WHERE id = ?`, [id], (err2, result2) => {
            if (err2) throw err2
    
            response.redirect(`/pageAuthor/author`)
            })
    })
}