const express = require('express')
const router = express.Router();
const ClientController = require('../controller/ClientController')
const multer = require('multer')

const storage = multer.diskStorage({
    destination:'./uploads/',
    filename:(req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const upload = multer({storage:storage});
router.post('/generateQR',ClientController.generateQRCode)
router.post('/fetchlogs',ClientController.fetchLogs)
router.post('/report',ClientController.createReport)
router.patch('/updategeneral',ClientController.updateGeneralInfo)
router.put('/newmobile',ClientController.updateMobileNumber)
router.post('/password', ClientController.validatePasswordIsSame)
router.post('/savepassword',ClientController.saveNewPassword)
router.put('/profile/:id',upload.single('profile'),ClientController.createProfilePicture)


module.exports = router;
