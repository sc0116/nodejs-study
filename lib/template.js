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
          list += `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`
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
    }
  }

//module.exports = template