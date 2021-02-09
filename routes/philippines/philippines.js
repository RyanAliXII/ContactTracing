const express = require('express');
const router = express.Router();
const provinces = require('philippines/provinces');
const cities = require('philippines/cities');



router.get('/provinces/cities/:name',(req,res)=>{
    const name = req.params.name;
    let citiesFilteredByProvinceKey = cities.map(city=>{
        provinces.forEach(province =>{
            if(province.key === city.province){
                Object.assign(city, {province:province.name})
            }
        })
        
        return city;
    }).filter(city=>city.province === name);
    
    if(citiesFilteredByProvinceKey.length === 0) res.send({
        name:"NONE",
        province:"NONE",
        city: false
    })
    res.send(citiesFilteredByProvinceKey);

})

router.get('/provinces',(req,res)=>{
   res.send(provinces);
})


module.exports = router;