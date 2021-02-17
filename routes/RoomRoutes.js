const express = require('express')
const router = express.Router();
const RoomController = require('../controller/RoomController')

router.post('/signin',RoomController.signIn)
router.post('/signup',RoomController.signUp)
router.post('/createroom',RoomController.createRoom)
router.get('/fetchrooms',RoomController.fetchRooms)
router.post('/createlog',RoomController.createTravelLog)

module.exports = router;