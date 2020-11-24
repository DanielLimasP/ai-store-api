let router = require('express').Router()
let infoController = require('../controllers/info-controller')

// Info routes: TODO
router.post('/', infoController.addInfo)
router.get('/', infoController.getInfo)
router.get('/7days-logs', infoController.getLast7DaysLogs)
router.get('/7days-maxes', infoController.getLast7DaysMaxesData)
router.post('/interval', infoController.getLogsInDatesIntervals)

module.exports = router