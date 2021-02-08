import React, {useState} from 'react';
import '../../.././Assets/form.css'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
function Register(props) {

    const [steps,setSteps] = useState(1);
    const [userFormData,setFormData] = useState();

    function showValid(element,messageTextRef){
        const VALID = {
            OUTLINE:'2px solid #6BD382',
            DISPLAY:"NONE"
        }
        if(Array.isArray(element)){ //check if element is an array
            element.forEach(element => { 
              element.style.outline = VALID.OUTLINE //MAKE EVERY ELEMENT OUTLINE GREEN
            });
        }
        else{
            element.target.style.outline = VALID.OUTLINE
        }
        messageTextRef.current.style.display = VALID.DISPLAY // REMOVE ERROR MESSAGE
    }
    
    function showInvalid(element,messageTextRef){
        const INVALID = {
            OUTLINE:'2px solid #db5248', 
            DISPLAY:"inline"
        }
        if(Array.isArray(element)){
            element.forEach(element => { 
              element.style.outline = INVALID.OUTLINE //MAKE EVERY ELEMENT OUTLINE RED
            });
        }
        else{
            element.target.style.outline = INVALID.OUTLINE
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
        return <StepTwo handleFormData={handleFormData} showValid={showValid} showInvalid={showInvalid}  incrementSteps={incrementSteps} > </StepTwo>
        case 3:
        return <StepThree formData={userFormData}></StepThree>
        default:
        return <StepOne handleFormData={handleFormData}  incrementSteps={incrementSteps}></StepOne>
    }
}




export default Register;