const express = require('express')
const router = express.Router();
const cors = require('cors')
const loginSystemController = require('../controller/LoginSytemController')
const corsConfig = require('./corsConfig');

router.post('/createVerification',loginSystemController.createVerification);
router.post('/verify',loginSystemController.verify)
router.post('/signUp',loginSystemController.signUp)
router.post('/validateEmailIfTaken', loginSystemController.validateEmailIfTaken)
router.post('/validateMobileNumberIfTaken', loginSystemController.validateMobileNumberIfTaken)
module.exports = router;