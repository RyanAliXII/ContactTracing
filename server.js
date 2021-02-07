require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500
const PH_PROVINCES_CITIES = require('./routes/philippines/philippines');
const loginSystem = require('./routes/LoginSystemRoute')
const bodyParser = require('body-parser');
const corsConfig = require('./routes/corsConfig')
const cors = require('cors');

app.use(cors(corsConfig));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/philippines',PH_PROVINCES_CITIES)
app.use('/',loginSystem)

app.listen(process.env.PORT,()=>{
    console.log("Server up and running: " + PORT);
});