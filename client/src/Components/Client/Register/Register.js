import React, {useState} from 'react';
import '../../.././Assets/form.css'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
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


    //global function for changeElementAttributes
    //to make inputs have an outline on valid or on invalid
    //or to show display message or not
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
        case 3:
        return <StepThree formData={userFormData}></StepThree>
        default:
        return <StepOne handleFormData={handleFormData} VALID={VALID} INVALID={INVALID} changeElementAttributes_GLOBAL={changeElementAttributes_GLOBAL} incrementSteps={incrementSteps}></StepOne>
    }
}




export default Register;