const express = require('express')
const router = express.Router();
const AdminController = require('../controller/AdminController')

router.post('/signin',AdminController.signIn)
//router.post('/signup',AdminController.signUp)
router.post('/reports', AdminController.fetchReports);
router.post('/logs', AdminController.fetchTravelLogs)
router.post('/logs/:date/:room', AdminController.filterTravelLogs)
module.exports = router;