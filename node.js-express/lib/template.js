var sanitizeHtml = require('sanitize-html')

module.exports = {  //var template = {
    html:function(title, list, body, control) {
      return `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <p><a href="/author">author</p>
          ${list}
          ${control}
          ${body}
        </body>
        </html>
        `
    },
    list:function(filelist) {
      var list = '<ul>'
        for (i = 0; i < filelist.length; i++){
          list += `<li><a href="/topic/${filelist[i].id}">${sanitizeHtml(filelist[i].title)}</a></li>`
        }
        list += '</ul>'
      return list
    },
    authorSelect:function(authors, author_id) {
      var tag =''
        for (i = 0; i < authors.length; i++) {
          selected = ''
          if(authors[i].id === author_id) {
            selected = ' selected'
          }
          tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
        }
      return `
        <select name="author">
          ${tag}
        </select>
        `    
    },
    authorTable:function(authors) {
      var tag = '<table>'
        for (i = 0; i < authors.length; i++) {
          tag += `
            <tr>
              <td>${authors[i].name}</td>
              <td>${authors[i].profile}</td>
              <td><a href="/author/update/${authors[i].id}">update</a></td>
              <td>
                <form action="/author/delete-process" method="post">
                  <input type="hidden" name="id" value="${authors[i].id}">
                  <input type="submit" value="delete">
                </form>
              </td>
            </tr>
            `
        }
      tag += '</table>'
      tag += `
        <style>
          table {
           border-collapse: collapse;
          }
          td {
            border:1px solid black;
          }
        </style>
      `
        
      return tag
    }
  }

//module.exports = template