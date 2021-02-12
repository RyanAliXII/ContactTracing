const dbUtils = require('../utils/dbUtils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports ={


    signIn: async (req,res)=>{
        const username = req.body.username;
        const password = req.body.password;
        try {
            const database = await dbUtils.connectToDB();
            const databaseResult = await database
                .collection("users")
                .findOne({username: username});

            if (databaseResult == null) {
                res.send("Invalid Username");
            } else {
                const isPasswordTheSame = await bcrypt.compare(
                    password,
                    databaseResult.password
                );
          
                   user = {
                        id: databaseResult._id,
                        username:databaseResult.username,
                        org: databaseResult.org,
                        role:databaseResult.role
                    }    
            
                if (isPasswordTheSame) {
                    req.session.user = user;
                    console.log(req.session.user)
                    const accessToken = jwt.sign(req.session.user,process.env.JWT_SECRET)
                    const refreshToken = jwt.sign(req.session.user,process.env.JWT_REFRESH_SECRET)
                   res.cookie("refreshToken",refreshToken,{maxAge:3600 * 1000, httpOnly:true}).json({message:"OK",token:accessToken,role:user.role});
                   
                } else {
                    res.send("Invalid Password");
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500);
        }
    },
    createOrg:async(req,res)=>{
        try {
            const org = req.body
            console.log(req.body)
            const database = await dbUtils.connectToDB();
             database.collection("orgs").insertOne(org);
            res.send("OK")
        } catch (error) {
            console.log(error)
             res.send("ERROR: SOMETHING BAD HAPPENED");
        } 
    },
    fetchOrgs:async(req,res)=>{
        try{

            const database = await dbUtils.connectToDB();
            const dbResult = await database.collection("orgs").find({}).toArray();
            console.log(dbResult)
            res.json(dbResult);
        
        }catch (error){
            console.log(error)
            res.send("ERROR: SOMETHING BAD HAPPENED")
            
        }
    },
    signUp:async(req,res)=>{
        try {
            const user = req.body;
            Object.assign(user, {role:"Scanner"});
            user.password = await bcrypt.hash(user.password, 10);
            const database = await dbUtils.connectToDB();
            database.collection("users").insertOne(user);
            res.send("OK");
        } catch (error) {
             res.send("ERROR: SOMETHING BAD HAPPENED");
        } 
    },
    createTravelLog:async(req,res)=>{
       const date = new Date();
        const log = {
            location:req.body.location,
            time: date.toLocaleString()
        }
        const database = await dbUtils.connectToDB();
        database.collection('users').updateOne({qrCode:req.body.qrCode},{$push:{travel_logs:log}})
        res.send("OK")
    }

    
}