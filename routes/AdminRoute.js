const express = require('express')
const router = express.Router();
const AdminController = require('../controller/AdminController')

router.post('/signin',AdminController.signIn)
router.post('/signup',AdminController.signUp)

module.exports = router;