import React,{useEffect,useState,useRef,} from 'react';
import axios from 'axios';


function StepTwo({handleFormData,formData,incrementSteps,INVALID,VALID,changeElementAttributes_GLOBAL}) {

    const mobileNumberErrorRef = useRef();
    const [isValidMobileNumber,setValidMobileNumber]= useState(false);
    const [provinces,setProvinces] = useState([{
        key:"NV",
        name:"NOVALUE"
    }]);

    const [cities,setCities] = useState([{
        name:"Select Province First Then",
        province:"NONE", // none value
        city:false
    }])

    useEffect(()=>{ 
        async function getProvinces(){
            const data = await axios.get('http://localhost:5000/philippines/provinces')
            return data;
        }  
        getProvinces().then(response =>{
           setProvinces(response.data);
        })
    },[])
    
    function getCitiesByProvinceKey(event){
      let provinceKey = event.target.value;
    
      async function getCities(){
          const data = await axios.get(`http://localhost:5000/philippines/provinces/cities/${provinceKey}`)
          return data;
      }
      getCities().then(response => {
        setCities(response.data)  
        handleFormData(event)
      }
       
    )}

    function validateMobileNumber(event){
       let mobileNumber = event.target.value;
       let mobileRegexPattern = "^(09|\\+639)\\d{9}$"
        if(mobileNumber.match(mobileRegexPattern)){
            changeElementAttributes_GLOBAL(event,mobileNumberErrorRef,VALID.OUTLINE,VALID.DISPLAY);
            setValidMobileNumber(true);
        }
        else{
            changeElementAttributes_GLOBAL(event,mobileNumberErrorRef,INVALID.OUTLINE,INVALID.DISPLAY)
            setValidMobileNumber(false)
            if(event.target.value.length > 11){
                let  concatenatedMobileNumber = event.target.value.substring(0,11);
                event.target.value = concatenatedMobileNumber;
                setValidMobileNumber(true)
                changeElementAttributes_GLOBAL(event,mobileNumberErrorRef,VALID.OUTLINE,VALID.DISPLAY);
            }
           
        }
    }

    function proceed(event){
        event.preventDefault();
        console.log(formData)
    }
    return (
        <div>
        <div className="sign-up">        
       <div className="form-wrapper">
       <div className="form-title">
           <span>Sign Up</span></div>
   <form className="form-form">
   <div className="input-wrapper">
       <label className="" htmlFor="email">Fullname</label>
       <input type="name"  onChange={handleFormData} className="input signin-input bg1" name="fullname"required></input>
   </div>
   <div className="input-wrapper">
       <label className="" htmlFor="email">Mobile number</label>
       <input type="number" className="input bg1" onInput={validateMobileNumber} onChange={handleFormData}  name="mobileNumber" placeholder="09XX XXX XXXX"></input>
       <span className="error-message" ref={mobileNumberErrorRef}>Invalid mobile number</span>
   </div>
   <div className="divider"></div>
   <div className="input-wrapper">
       <label className="" htmlFor="email">Province</label>
      <select className="bg1" onChange={getCitiesByProvinceKey}  name="province">
          <option value="Select Province">Select Province</option>
          {
              provinces.map(province=>{
                  return <option value={province.key} key={province.key}>{province.name}</option>
              })
          }
      </select>
   </div>
   <div className="input-wrapper">
       <label className="" htmlFor="email">City</label>
      <select className="bg1" onChange={handleFormData} name="city">
          {
              cities.map((city,key)=>{
                return <option value={city.name + " City"} key={key}>{city.name + " City"}</option>
              } 
                )
          }
      </select>
   </div>
   <div className="input-wrapper">
   <label className="" htmlFor="email">Detailed address</label>
       <textarea className="bg1" onChange={handleFormData} name="fullAddress"></textarea>
   </div>
   <div className="btn-wrapper">
   <button type="submit" className="btn ok default-clr" onClick={proceed}>Next</button>
   </div>
   </form>
   </div>
   </div>
   </div>
    );
}

export default StepTwo;