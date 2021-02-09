require('dotenv').config();

const accountSID = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID

const validate = require('../utils/validate')
const dbUtils = require('../utils/dbUtils')
const {v4:uuidV4} = require('uuid')
const bcrypt = require('bcrypt')

const twilioClient = require('twilio')(accountSID,authToken)

module.exports={

    signUp: async(req,res)=>{

        try{
        const user = req.body;

        Object.assign(user,{qrCode: uuidV4()})
        user.password = await bcrypt.hash(user.password,10);
        const database = await dbUtils.connectToDB()
    
        database.collection('users').insertOne(user)
        
        }
        catch(error){
            if(error) res.send("ERROR: SOMETHING BAD HAPPENED")
        }
        finally{
            res.send("OK")
        }
        
    },
    signIn:(req,res)=>{

    },

    verify:async(req,res)=>{
    
    try{

    let mobileNumber =  req.body.mobileNumber;
    mobileNumber = `+63${mobileNumber.substring(1,11)}`;
    let mobileCode= req.body.code;
    const {status} = await twilioClient.verify.services(serviceId).verificationChecks.create({to:mobileNumber,code:mobileCode})

    if(status === "approved"){
        res.send("VERIFIED")
    }
    else{
        res.send("NOT VERIFIED")
    }
    
    }
    catch(error){
        res.send("BAD")
    }


   },

    createVerification: async(req,res)=>{
        try{        
        let mobileNumber = req.body.mobileNumber;
        mobileNumber = `+63${mobileNumber.substring(1,11)}`;
        await twilioClient.verify.services(serviceId).verifications.create({to: mobileNumber,channel: 'sms'})

        }
        catch(error){
            res.send("BAD");
        }
        finally{
            res.send("OK")
        }

    },
    validateEmailIfTaken: async(req,res)=>{

     const bool = await validate.isEmailFieldTaken(req.body.email);
        res.send(bool)
    },

    validateMobileNumberIfTaken:async(req,res)=>{
    const bool = await validate.isMobileNumberTaken(req.body.mobileNumber);
        res.send(bool)
    }
    
}

