require('dotenv').config();
const twilio = require('twilio')
const accountSID = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = new twilio(accountSID, authToken);


const twilioService = twilioClient.verify.services.create({friendlyName:"CONTACT TRACING APP"})


module.exports={

    signUp: (req,res)=>{
        
        twilioService.then(service=>{
            console.log(service.sid)
        })
        
        
    },

    verify: (req,res)=>{
    let mobileCode= req.body.code;
    let mobileNumber = req.body.mobileNumber;
    mobileNumber = mobileNumber.substring(1,11);
    twilioService.then(service=>{
        console.log(service.sid)
        twilioClient.verify.services(service.sid)
        .verificationChecks
        .create({to:`+63${mobileNumber}`,code:mobileCode})
        .then(verification_check=>{
            console.log(verification_check.status)
            if(verification_check.status === "approved"){
                res.send({message:"VERIFIED"})
            }
            else{
                res.send({message:"NOT VERIFIED"})
            }
        });


       
    })},

    createVerification: (req,res)=>{
        let mobileNumber = req.body.mobileNumber;
         mobileNumber = mobileNumber.substring(1,11);

        twilioService.then(service=>{
                twilioClient.verify.services(service.sid)
                .verifications
                .create({to:`+63${mobileNumber}`,channel:"sms"})
                .then(verification=> console.log(verification))
            })
    },
    signIn:(req,res)=>{

    }

    
    
}

