require('dotenv').config();
const dbUtils = require('../utils/dbUtils')
const { v4: uuidV4 } = require("uuid");
const { ObjectId } = require('mongodb');
const moment = require('moment');
const bcrypt = require("bcrypt");
const validate = require('../utils/validate')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

module.exports = {

    generateQRCode: async(req,res)=>{

        try{
        const userId = req.body.id;
        const newQrCode = uuidV4();

        const database = await dbUtils.connectToDB()

        const {value} = await database.collection('users').findOneAndUpdate({_id:ObjectId(userId)},{$set:{qrCode:newQrCode}},{returnOriginal:false})
       
        user = {
            id: value._id,
            name: value.fullname,
            email:value.email,
            mobileNumber:value.mobileNumber,
            province:value.province,
            city:value.city,
            fullAddress:value.fullAddress,
            qrCode:value.qrCode,
            role:value.role
        }  
        req.session.user = user;
        res.send("OK");
        }
        catch(error){
            console.log(error)
            res.status(500)
            res.send("SOMETHING BAD HAPPENED");
        }
        
    },
    fetchLogs: async(req,res)=>{
        const date = moment("2014/12/08").format("MMM Do YY").valueOf()
        try{
        const userId = req.body.id;
        const database = await dbUtils.connectToDB()
        const databaseResult = await database.collection('users').findOne({_id:ObjectId(userId)});
        if(databaseResult === null){
            return res.send([])
        }
        
        res.send(databaseResult.travel_logs);
        }catch (error) {
            return res.send("ERROR: SOMETHING BAD HAPPENED")
        }
    }
    ,
    createReport:async(req,res)=>{
        
        try{

            const day = moment().format('dddd').valueOf()
            const month = moment().format('MMM Do YY').valueOf();
            const time = moment().format('h:mm').valueOf()

            const userId = req.body.id;
            const logId = req.body.logId;
            const location = req.body.location;
            const name = req.body.name;
            const logTime = req.body.time;
            const reportDate = `${day}, ${time}, ${month}`
            const report = {
                reporter: name,
                reportDate: reportDate,
                location:location,
                reportText: `${name} reported that he/she did not go to ${location} at ${logTime}` 
            }
            const database = await dbUtils.connectToDB();
            await database.collection('reports').insertOne(report)
            await database.collection('users').updateOne({_id:ObjectId(userId),"travel_logs.id":logId},{
                $set:{"travel_logs.$.isReported": true}
            })

            return res.send("OK")
        }catch (error){
            console.log(error);
           return res.send("SOMETHING BAD HAPPENED")
        }

    },
    updateGeneralInfo:async(req,res)=>{
         
        try{
        const database = await dbUtils.connectToDB();
        const userId = req.body.id;
        const newData = {
            fullname:req.body.fullname,
            province:req.body.province,
            city:req.body.city,
            fullAddress:req.body.fullAddress,
        }
    const {value} =  await database.collection('users').findOneAndUpdate({_id:ObjectId(userId)},{$set:newData},{returnOriginal:false})
    user = {
        id: value._id,
        name: value.fullname,
        email:value.email,
        mobileNumber:value.mobileNumber,
        province:value.province,
        city:value.city,
        fullAddress:value.fullAddress,
        qrCode:value.qrCode,
        role:value.role,
        profilePicture:value.profilePicture
    } 
     
       req.session.user = user;
        return res.send("OK")
    }
    catch (error) {
        console.log(error);
       return res.send("BAD")
        
    }
    },
    updateMobileNumber:async(req,res)=>{
        try{
     
        const userId = req.body.id;
        const mobileNumber = req.body.mobileNumber;
        const database = await dbUtils.connectToDB();
        
        const {value} =  await database.collection('users').findOneAndUpdate({_id:ObjectId(userId)},{$set:{mobileNumber: mobileNumber}},{returnOriginal:false})
        user = {
            id: value._id,
            name: value.fullname,
            email:value.email,
            mobileNumber:value.mobileNumber,
            province:value.province,
            city:value.city,
            fullAddress:value.fullAddress,
            qrCode:value.qrCode,
            role:value.role,
            profilePicture:value.profilePicture
        } 
         
        req.session.user = user;
        
        res.send("OK")
        }catch (error) {
            console.log(error)
            res.send("ERROR")
        }
    },
    validatePasswordIsSame:async(req,res)=>{
       
        const userId = req.body.id;
        const password = req.body.password;
        const bool = await validate.isPasswordTheSame(userId,password)
        if(bool){
            res.send("OK")
        }
        else{
            res.send("BAD")
        }
    },
    saveNewPassword:async (req,res)=>{
    
        try{
            const userId = req.body.id;
            const password = await bcrypt.hash(req.body.password, 10);   
            const database = await dbUtils.connectToDB();
            database.collection('users').updateOne({_id:ObjectId(userId)},{$set:{password:password}});
            return res.send("OK");
        }catch(error){
            console.log(error)
            return res.send("BAD")
            
        }
    
        
    
    
    },
    createProfilePicture:async(req,res)=>{

        console.log(req.file);
        try{
            const imageFile = req.file;
            const userId = req.params.id;
            const uploadResult = await cloudinary.uploader.upload(`./uploads/${imageFile.originalname}`,{
                folder:"profile-pictures",
                public_id:`${Date.now()}${imageFile.originalname}`

            })
            console.log("UPLOADED")
            const profilePicture = {
                profilePicture:{
                id:uploadResult.public_id,
                name:uploadResult.original_filename+"."+uploadResult.format,
                url:uploadResult.secure_url
            }
            }
            const database = await dbUtils.connectToDB();
            const {value} =  await database.collection('users').findOneAndUpdate({_id:ObjectId(userId)},{$set:profilePicture})
           console.log("DATABASE LOADED")
           if('id' in value.profilePicture){ // delete last profile pic in cloudinary if there is any
               const deleteResult  = await cloudinary.uploader.destroy(value.profilePicture.id);
               console.log(deleteResult);
           }
         
            user = {
            id: value._id,
            name: value.fullname,
            email:value.email,
            mobileNumber:value.mobileNumber,
            province:value.province,
            city:value.city,
            fullAddress:value.fullAddress,
            qrCode:value.qrCode,
            role:value.role,
            profilePicture:profilePicture.profilePicture,
        } 
        req.session.user = user;
        res.send("OK")
        }catch(error){
            console.log(error)
            res.send("BAD")
        }
    }
}