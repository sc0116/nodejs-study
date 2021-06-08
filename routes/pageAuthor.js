const express = require('express')
const router = express.Router()

const author = require('../lib/author')

router.get('/author', (req, res) => {
    author.home(req, res)
})

router.post('/create-process', (req, res) => {
    author.create_process(req, res)
})


router.post('/update-process', (req, res) => {
    author.update_process(req, res)
})

router.post('/delete-process', (req, res) => {
    author.delete_process(req, res)
})

router.get('/update/:authorId', (req, res) => {
    author.update(req, res)
})

module.exports = router