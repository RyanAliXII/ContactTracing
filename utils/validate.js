const dbUtils = require('./dbUtils')
const { ObjectId } = require('mongodb');
const bcrypt = require("bcrypt");
module.exports = {

    isEmpty: (string,length) => string.length <= 0 ? true : false,
    
    isLengthEqual:(string,length)=>string.length ==- length ? true:false,

    isEmail:(email)=>{
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(String(email).toLowerCase());
    },
    isMobileNumber:(phonenumber)=>{
        let mobileRegexPattern = "^(09|\\+639)\\d{9}$"
        return phonenumber.match(mobileRegexPattern);
    },
    isEmailFieldTaken:async(email)=>{
        try{
        const database = await dbUtils.connectToDB();
        
        const result = await database.collection('users').findOne({email:email})
        
            if(result != null){
                return true;
            }
            else{
                return false;
            }
        }
        catch(error){
            console.log(error);
        }
    },
    isMobileNumberTaken:async(mobileNumber)=>{
        try{
            const database = await dbUtils.connectToDB();
            const result = await database.collection('users').findOne({mobileNumber:mobileNumber})
            
                if(result != null){
                    return true;
                }
                else{
                    return false;
                }
            }
            catch(error){
                console.log(error);
            }
    },
    isPasswordTheSame: async (userId,password) => {
        
        try{
            const database = await dbUtils.connectToDB();
            const result = await database.collection('users').findOne({_id:ObjectId(userId)});
            if(result == null){
                return false;
            }
            else{
                const isSame = await bcrypt.compare(
                    password,
                    result.password
                );
                return isSame;
            }
        }
        catch (error) {
            console.log(error)
        }
    },
    isImage:(fileExtension)=>{
            const arrayOfAllowedFileExtensions = ['image/jpeg','image/png']

            for(let i = 0; i < arrayOfAllowedFileExtensions.length; i++){
                if(fileExtension === arrayOfAllowedFileExtensions[i]){
                    return true;
                }
            }

            return false;
    }
}