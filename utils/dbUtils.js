require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://Ryanali12:${process.env.DB_PASSWORD}@cluster0.wwlmp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const clientDB = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });

module.exports ={
    connectToDB:async()=>{
        try{
            await clientDB.connect()
            const database = clientDB.db(process.env.DB_NAME);
            return database
        }
        catch(err){
            console.log(err)
        }
    }

}