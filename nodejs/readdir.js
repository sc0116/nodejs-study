const testFolder = './data'
const fs = require('fs')

fs.readdir(testFolder, (err, files) => {
    if (err) {
        console.error(err)
        return
    }

    files.forEach(file => {
        console.log(file)
    })
})