const dbUtils = require('../utils/dbUtils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidV4 } = require("uuid");
const { ObjectId } = require('mongodb');
const moment = require('moment')
module.exports = {

    signIn: async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        try {
            const database = await dbUtils.connectToDB();
            const databaseResult = await database
                .collection("users")
                .findOne({
                    username: username,
                    role: "Scanner"
                });

            if (databaseResult == null) {
                res.send("Invalid Username");
            } else {
                const isPasswordTheSame = await bcrypt.compare(
                    password,
                    databaseResult.password
                );

                user = {
                    id: databaseResult._id,
                    username: databaseResult.username,
                    room: databaseResult.room,
                    role: databaseResult.role
                }

                if (isPasswordTheSame) {
                    req.session.user = user;
                    console.log(req.session.user)
                    const accessToken = jwt.sign(req.session.user, process.env.JWT_SECRET)
                    const refreshToken = jwt.sign(req.session.user, process.env.JWT_REFRESH_SECRET)
                    res.cookie("refreshToken", refreshToken, { maxAge: 3600 * 1000, httpOnly: true }).json({ message: "OK", token: accessToken, role: user.role });

                } else {
                    res.send("Invalid Password");
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500);
        }
    },
    createRoom: async (req, res) => {
        try {
            const room = req.body
            const database = await dbUtils.connectToDB();
            database.collection("rooms").insertOne(room);
            res.send("OK")
        } catch (error) {
            console.log(error)
            res.send("ERROR: SOMETHING BAD HAPPENED");
        }
    },
    fetchRooms: async (req, res) => {
        try {

            const database = await dbUtils.connectToDB();
            const dbResult = await database.collection("rooms").find({}).toArray();
        
            res.json(dbResult);

        } catch (error) {
            
            res.send("ERROR: SOMETHING BAD HAPPENED")

        }
    },
    signUp: async (req, res) => {
        try {
            const user = req.body;
            Object.assign(user, { role: "Scanner" });
            user.password = await bcrypt.hash(user.password, 10);
            const database = await dbUtils.connectToDB();
            database.collection("users").insertOne(user);
            res.send("OK");
        } catch (error) {
            res.send("ERROR: SOMETHING BAD HAPPENED");
        }
    },
    createTravelLog: async (req, res) => {
        try {
            const day = moment().format('dddd').valueOf()
            const month = moment().format('MMM Do YY').valueOf();
            const time = moment().format('h:mm:a').valueOf()
            const fullDate = moment().format('l').valueOf();   

            const log = {
                id: uuidV4(),
                location: req.body.location,
                day: day,
                time: time,
                month: month,
                fullDate: fullDate,
                isReported: false
            }
            const database = await dbUtils.connectToDB();
            database.collection('users').updateOne({ qrCode: req.body.qrCode }, { $push: { travel_logs: log } })
            res.send("OK")
        } catch (error) {
            console.log(error)
            res.send("BAD")
        }
    }



}