require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500
const PH_PROVINCES_CITIES = require('./routes/philippines/philippines');
const loginSystem = require('./routes/LoginSystemRoute')
const orgRoutes = require('./routes/OrgRoutes')
const bodyParser = require('body-parser');
const corsConfig = require('./routes/corsConfig')
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')



app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(corsConfig));



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    maxAge: 3600 * 1000,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
}))


app.get('/auth', (req, res) => {

    if (req.session.user === undefined) {
        res.json({auth:false,role:"NONE"});
    }
    else {
        res.json({auth:true,role:req.session.user.role})
    }
})
app.post('/user',(req,res)=>{
    const user = req.session.user;
    res.json(user)
})

app.post('/fetchtoken', (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
         const newAccessToken =  jwt.sign(req.session.user,process.env.JWT_SECRET)
         res.send(newAccessToken);
    }
    catch (error) {
        res.send("");
    }
})


app.use('/philippines', PH_PROVINCES_CITIES)
app.use('/', loginSystem)
app.use('/org',orgRoutes)
app.listen(process.env.PORT, () => {
    console.log("Server up and running: " + PORT);
});