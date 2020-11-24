let router = require('express').Router()
let infoController = require('../controllers/info-controller')

// Info routes: TODO
router.post('/', infoController.addInfo)
router.get('/', infoController.getInfo)
router.get('/7days', infoController.getLast7DaysInfo)

module.exports = router