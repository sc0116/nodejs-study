var fs = require('fs')

/*
//readFileSync
console.log('A')
var result = fs.readFileSync('syntax/sample.txt', 'utf8')
console.log(result)
console.log('C')
*/

//readFile(Async)
console.log('A')
fs.readFile('syntax/sample.txt', 'utf8', (err, result) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(result)
})
console.log('C')