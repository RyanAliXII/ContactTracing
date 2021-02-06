require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500
const PH_PROVINCES_CITIES = require('./routes/philippines/philippines');

app.use('/philippines',PH_PROVINCES_CITIES)

app.listen(process.env.PORT,()=>{
    console.log("Server up and running: " + PORT);
});