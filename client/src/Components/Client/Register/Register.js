import React, {useState} from 'react';
import '../../.././Assets/form.css'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import Login from '../../Login'
import {Redirect} from 'react-router-dom'
function Register(props) {

    const [steps,setSteps] = useState(1);
    const [userFormData,setFormData] = useState();

    function showValid(inputs,messageTextRef){
        const VALID = {
            OUTLINE:'2px solid #6BD382',
            DISPLAY:"NONE"
        }
        if(Array.isArray(inputs)){ //check if element is an array
            inputs.forEach(input => { 
              input.style.outline = VALID.OUTLINE //MAKE EVERY <input> OUTLINE GREEN
            });
        }
        else{
            inputs.target.style.outline = VALID.OUTLINE
        }
        messageTextRef.current.style.display = VALID.DISPLAY // REMOVE ERROR MESSAGE
    }
    
    function showInvalid(inputs,messageTextRef){
        const INVALID = {
            OUTLINE:'2px solid #db5248', 
            DISPLAY:"inline"
        }
        if(Array.isArray(inputs)){
            inputs.forEach(input => { 
              input.style.outline = INVALID.OUTLINE //MAKE EVERY <input> OUTLINE RED
            });
        }
        else{
            inputs.target.style.outline = INVALID.OUTLINE
        }
        messageTextRef.current.style.display = INVALID.DISPLAY // DISPLAY ERROR MESSAGE
    }
    
    function incrementSteps(){
        setSteps(prevStep => prevStep + 1);
    }
    function handleFormData(e){
        const {name,value} = e.target;
        setFormData(prevData=>({
            ...prevData,
            [name]:value
        }))
       
    }
  
    switch(steps){
        case 1: 
        return <StepOne handleFormData={handleFormData} showValid={showValid} showInvalid={showInvalid} incrementSteps={incrementSteps}></StepOne>
        case 2:
        return <StepTwo handleFormData={handleFormData} showValid={showValid} showInvalid={showInvalid}  incrementSteps={incrementSteps} formData={userFormData} > </StepTwo>
        case 3:
        return <StepThree formData={userFormData} showValid={showValid} incrementSteps={incrementSteps} ></StepThree>
        default:
        return <Redirect to="/signin"></Redirect>
    }
}




export default Register;