const express = require('express')
const router = express.Router();
const loginSystemController = require('../controller/LoginSytemController')


router.post('/createVerification',loginSystemController.createVerification);
router.post('/verify',loginSystemController.verify)
router.post('/signup',loginSystemController.signUp)
router.post('/signin',loginSystemController.signIn)
router.post('/validateEmailIfTaken', loginSystemController.validateEmailIfTaken)
router.post('/validateMobileNumberIfTaken', loginSystemController.validateMobileNumberIfTaken)
module.exports = router;
