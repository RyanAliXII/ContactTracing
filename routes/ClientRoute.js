const express = require('express')
const router = express.Router();
const ClientController = require('../controller/ClientController')

router.post('/generateQR',ClientController.generateQRCode);
router.post('/fetchlogs',ClientController.fetchLogs)
router.post('/report',ClientController.createReport)
module.exports = router;
