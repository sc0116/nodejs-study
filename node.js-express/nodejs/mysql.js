var mysql = require('mysql')
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'opentutorials'
})

connection.connect()

connection.query('SELECT * FROM topic', (error, results, fields) => {
    if (error) throw error
    console.log('The solution is: ', results)
})

connection.end() 