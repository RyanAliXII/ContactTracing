const express = require('express');
const router = express.Router();
const provinces = require('philippines/provinces');
const cities = require('philippines/cities');
const cors = require('cors');
const corsConfig = require('../corsConfig')


router.get('/provinces/cities/:key',cors(corsConfig),(req,res)=>{
    const key = req.params.key;

    let citiesFilteredByProvinceKey = cities.map(city=>city).filter(city=>city.province === key);
    if(citiesFilteredByProvinceKey.length === 0) res.send({
        name:"NONE",
        province:"NONE",
        city: false
    })
    res.send(citiesFilteredByProvinceKey);

})

router.get('/provinces',cors(corsConfig),(req,res)=>{
   res.send(provinces);
})


module.exports = router;