const express = require('express')
const router = express.Router()

const topic = require('../lib/topic')
const crud = require('../lib/crud')
 
router.get('/create', (req, res) => {
    crud.create(req, res)
})
  
router.post('/create-process', (req, res) => {
    crud.create_process(req, res)
})
  
router.post('/update-process', (req, res) => {
    crud.update_process(req, res)
})
  
router.post('/delete-process', (req, res) => {
    crud.delete_process(req, res)
})

router.get('/update/:pageId', (req, res) => {
    crud.update(req, res)
})

router.get('/:pageId', (req, res) => {
    topic.page(req, res)
}) 

module.exports = router