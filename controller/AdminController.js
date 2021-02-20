const dbUtils = require('../utils/dbUtils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const moment = require('moment');
module.exports = {

    signIn: async (req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const database = await dbUtils.connectToDB()
            const dbResult = await database.collection('users').findOne({ username: username , role:"Admin"});
            if (dbResult == null) {
                res.send("INVALID EMAIL");
            }
            const isPasswordTheSame = await bcrypt.compare(password, dbResult.password);
            const user = {
                id: dbResult._id,
                username: dbResult.username,
                name: dbResult.name,
                role: dbResult.role
            }
            if (isPasswordTheSame) {
                req.session.user = user;
                console.log(req.session.user)
                const accessToken = jwt.sign(req.session.user, process.env.JWT_SECRET)
                const refreshToken = jwt.sign(req.session.user, process.env.JWT_REFRESH_SECRET)
                res.cookie("refreshToken", refreshToken, { maxAge: 3600 * 1000, httpOnly: true }).json({ message: "OK", token: accessToken, role: user.role });
            }
            else {
                res.send("INVALID PASSWORD")
            }
        } catch (error) {
            console.error(error)
            res.send("ERROR: SOMETHING BAD HAPPENED")
        }
    },
    signUp: async (req, res) => {
        try {
            const user = {
                username: "Ryan@admin",
                name: "Ryan Ali",
                password: "Ryan091138",
                role: "Admin"
            }
            user.password = await bcrypt.hash(user.password, 10);
            const database = await dbUtils.connectToDB();
            database.collection("users").insertOne(user)
            res.send("OK")

        } catch (error) {
            console.log(error)
            res.send("ERROR: SOMETHING BAD HAPPENED")
        }

    },
    fetchReports: async (req, res) => {
        try{
        const database = await dbUtils.connectToDB();
        const dbResult = await database.collection('reports').find({}).toArray();
        if(dbResult == null){
            res.send([])
        }
        res.send(dbResult);
    }catch (error) {
        res.send("ERROR: SOMETHING BAD HAPPENED")
        console.log(error);
    }
    },
    fetchTravelLogs: async (req, res) => {
        
        try{
        const database = await dbUtils.connectToDB();
        const dbResults = await database.collection('users').find({role:"Client"}).toArray();
        if(dbResults === null){
            return res.send([]);
        }

        let data = [];
         dbResults.forEach(result =>{
            
           result.travel_logs.map(log=>{
                log.name = result.fullname;
                log.userId = result._id;
                log.mobileNumber = result.mobileNumber;
                data.push(log)
           })
        
        })
        res.send(data)
        }catch (error) {
            console.log(error)
            res.send("BAD");
        }   
        
    },
    filterTravelLogs: async (req, res) => {
        try{
            const date = new Date(req.params.date);
            const  room = req.params.room;
            const convertedDate = moment(date).format('l').valueOf();

            const database = await dbUtils.connectToDB();
            const dbResults = await database.collection('users').find({role:"Client"}).toArray();
            if(dbResults === null){
                return res.send([]);
            }
    
            let data = [];
             dbResults.forEach(result =>{
               result.travel_logs.map(log=>{
                log.name = result.fullname;
                log.userId = result._id;
                log.mobileNumber = result.mobileNumber;
                  data.push(log)
               })
            
            })
            const filteredData = data.filter(d=>d.fullDate === convertedDate && d.location === room).map(d=> d);
            console.log(filteredData)
            res.send(filteredData);
            }catch (error) {
                console.log(error)
                res.send([]);
            }   
    },
    
}