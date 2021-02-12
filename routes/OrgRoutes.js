const express = require('express')
const router = express.Router();
const OrgController = require('../controller/OrgController')




router.post('/signin',OrgController.signIn)
router.post('/signup',OrgController.signUp)
router.post('/createorg',OrgController.createOrg)
router.get('/fetchorgs',OrgController.fetchOrgs)

module.exports = router;