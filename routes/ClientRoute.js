const express = require('express')
const router = express.Router();
const ClientController = require('../controller/ClientController')

router.post('/generateQR',ClientController.generateQRCode)
router.post('/fetchlogs',ClientController.fetchLogs)
router.post('/report',ClientController.createReport)
router.patch('/updategeneral',ClientController.updateGeneralInfo)
router.put('/newmobile',ClientController.updateMobileNumber)
router.post('/password', ClientController.validatePasswordIsSame)
router.post('/savepassword',ClientController.saveNewPassword)
module.exports = router;
