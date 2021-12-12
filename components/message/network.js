const express = require('express')
const multer = require('multer')
const controller = require('./controller')
const response = require('../../network/response')
const router = express.Router()

const upload = multer({
    dest: 'public/files',
})

router.get('/', function (req, res){
    const filterMessages = req.query.user || null
    controller.getMessages(filterMessages)
        .then((messageList) => {
            response.success(req, res, messageList, 200)
        })
        .catch((e) => {
            response.error(req, res, 'Unexpected error', 500, e)
        })
})

router.post('/', upload.single('file'), function (req, res){
    //console.log(req.file)
    // console.log(req.body)
    // console.log(req.query)
    // res.status(201).send({
    //     error: '', body: 'Creado correctamente'
    // })
    controller.addMessage(req.body.chat, req.body.user, req.body.message, req.file)
    .then((fullMessage) => {
        response.success(req, res, fullMessage, 201)
    })
    .catch(() =>{
        response.error(req, res, 'Información inválida', 400, 'error en el controlador')
    })
})

router.patch('/:id', function (req, res) {
    controller.updateMessage(req.params.id, req.body.message)
        .then((data) => {
            response.success(req, res, data, 200)
        })
        .catch((e) => {
            response.error(req, res, 'Error interno', 500, e)
        })
})

router.delete('/:id', function (req, res) {
    controller.deleteMessage(req.params.id)
        .then(() => {
            response.success(req, res, `Usuario ${req.params.id} eliminado`, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error interno', 500, e)
        })
})

module.exports = router;