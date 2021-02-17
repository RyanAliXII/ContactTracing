require("dotenv").config();

const accountSID = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const twilioClient = require("twilio")(accountSID, authToken);

const validate = require("../utils/validate");
const dbUtils = require("../utils/dbUtils");

const jwt = require("jsonwebtoken");
const { v4: uuidV4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
    signUp: async (req, res) => {
        try {
            const user = req.body;
            Object.assign(user, { qrCode: uuidV4(),role:"Client",travel_logs:[]});
            user.password = await bcrypt.hash(user.password, 10);
            const database = await dbUtils.connectToDB();
            database.collection("users").insertOne(user);
            res.send("OK")
        } catch (error) {
            console.log(error)
             res.send("ERROR: SOMETHING BAD HAPPENED");
        } 
    },
    signIn: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        try {
            const database = await dbUtils.connectToDB();
            const databaseResult = await database
                .collection("users")
                .findOne({ email: email });

            if (databaseResult == null) {
                res.send("Invalid Email");
            } else {
                const isPasswordTheSame = await bcrypt.compare(
                    password,
                    databaseResult.password
                );
                   user = {
                        id: databaseResult._id,
                        name: databaseResult.fullname,
                        email:databaseResult.email,
                        mobileNumber:databaseResult.mobileNumber,
                        province:databaseResult.province,
                        city:databaseResult.city,
                        fullAddress:databaseResult.fullAddress,
                        qrCode:databaseResult.qrCode,
                        role:databaseResult.role
                    }    
            
                if (isPasswordTheSame) {
        
                    req.session.user = user;
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

    verify: async (req, res) => {
        try {
            let mobileNumber = req.body.mobileNumber;
            mobileNumber = `+63${mobileNumber.substring(1, 11)}`;
            let mobileCode = req.body.code;
            const { status } = await twilioClient.verify
                .services(serviceId)
                .verificationChecks.create({ to: mobileNumber, code: mobileCode });

            if (status === "approved") {
                res.send("VERIFIED");
            } else {
                res.send("NOT VERIFIED");
            }
        } catch (error) {
            console.log(error);
            res.send("BAD");
        }
    },

    createVerification: async (req, res) => {
        try {
            let mobileNumber = req.body.mobileNumber;
            mobileNumber = `+63${mobileNumber.substring(1, 11)}`;
            await twilioClient.verify
                .services(serviceId)
                .verifications.create({ to: mobileNumber, channel: "sms" });
                res.send("OK")
        } catch (error) {
            console.log(error)
            res.send("BAD");
        }
    },
    validateEmailIfTaken: async (req, res) => {
        const bool = await validate.isEmailFieldTaken(req.body.email);
        res.send(bool);
    },

    validateMobileNumberIfTaken: async (req, res) => {
        const bool = await validate.isMobileNumberTaken(req.body.mobileNumber);
        res.send(bool);
    },
};
