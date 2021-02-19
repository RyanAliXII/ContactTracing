import React,{useState,useRef} from 'react';
import axios from 'axios'
function StepThree({formData,showValid,incrementSteps}) {

    const [mobilecode,setCode] = useState();
    const codeErrorMessageRef = useRef()
    const codeInput = useRef();

    function handleCode(event){
        setCode(event.target.value)
        showValid(event,codeErrorMessageRef)
    }   
    

    
    function verify(event){
        event.preventDefault()
        axios.post('http://localhost:5000/verify',{code:mobilecode,mobileNumber:formData.mobileNumber}).then(resp=>{
            if(resp.data === "VERIFIED"){
                axios.post('http://localhost:5000/signup',formData).then((resp)=>{
                   incrementSteps();
                })
            }
            else{
                showInvalid_LOCAL(codeInput.current,codeErrorMessageRef);
            }
        });

        function showInvalid_LOCAL(inputs,messageTextRef){
            const INVALID = {
                OUTLINE:'2px solid #db5248', 
                DISPLAY:"inline"
            }
            if(Array.isArray(inputs)){
                inputs.forEach(input => { 
                  input.style.outline = INVALID.OUTLINE //MAKE EVERY ELEMENT OUTLINE RED
                });
            }
            else{
                inputs.style.outline = INVALID.OUTLINE
            }
            messageTextRef.current.style.display = INVALID.DISPLAY // DISPLAY ERROR MESSAGE
        }
    }
 
    function validateLengthOfCode(event){
        let enteredCode = event.target;
        if(enteredCode.value.length > 6){
            enteredCode.value = enteredCode.value.substring(0,6);
        }
    }
    return (
        <div>
        <div className="sign-up">
        <ol className="steps">
            <li className="stepOne">1. Account</li>
            <li className="stepTwo">2. Information</li>
            <li className="stepThree active">3. Confirmation</li>
        </ol>     
       <div className="form-wrapper">
       <div className="form-title">
           <span>Please enter 6-digit code we have sent to your mobile number.</span></div>
   <form className="form-form">
   <div className="input-wrapper">
       <label className="" htmlFor="email">6 - Digit Code</label>
       <input type="number" ref={codeInput} className="input signin-input input-code bg1" onChange={handleCode} name="code"  onInput={validateLengthOfCode} required></input>
       <span className="error-message" ref={codeErrorMessageRef}>You entered a wrong code</span>
   </div>
   <div className="btn-wrapper">
   <button type="submit" className="btn bl-bg default-clr" onClick={verify}>Confirm</button>
   </div>
   </form>
   </div>
   </div>
   </div>
    );
}

export default StepThree;