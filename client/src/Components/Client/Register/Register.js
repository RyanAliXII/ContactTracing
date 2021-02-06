import React, {useState} from 'react';
import '../../.././Assets/form.css'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
function Register(props) {

    const [steps,setSteps] = useState(1);
    const [userFormData,setFormData] = useState();

    const VALID = {
        OUTLINE:'2px solid #6BD382',
        DISPLAY:"NONE"
    }
    const INVALID = {
        OUTLINE:'2px solid #db5248',
        DISPLAY:"inline"
    }

    //function for changing the element style On valid or On invalid  
    //global function for changeElementAttributes
    function changeElementAttributes_GLOBAL(event,errorRef,outline, display){ 
        event.target.style.outline = outline;
        errorRef.current.style.display = display 
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
        return <StepOne handleFormData={handleFormData} VALID={VALID} INVALID={INVALID} changeElementAttributes_GLOBAL={changeElementAttributes_GLOBAL} incrementSteps={incrementSteps}></StepOne>
        case 2:
        return <StepTwo handleFormData={handleFormData} VALID={VALID} formData = {userFormData} INVALID={INVALID} changeElementAttributes_GLOBAL={changeElementAttributes_GLOBAL} incrementSteps={incrementSteps} > </StepTwo>
        default:
        return <StepOne handleFormData={handleFormData} VALID={VALID} INVALID={INVALID} changeElementAttributes_GLOBAL={changeElementAttributes_GLOBAL} incrementSteps={incrementSteps}></StepOne>
    }
}




export default Register;