import React,{useRef,useState} from 'react';
import {Link} from "react-router-dom";


function StepOne({handleFormData,incrementSteps,VALID,INVALID,changeElementAttributes_GLOBAL}) {
    
    const [isFormInValidState,setFormValidState] = useState({
        email: false,
        password: false,
        confirmPassword: false

    });
    function proceed(e){
    e.preventDefault();

        if(isFormInValidState.email && isFormInValidState.password && isFormInValidState.confirmPassword ){
            incrementSteps();
         }
         
    }
    const passwordNotSameErrorRef = useRef()//error message , span element
    const emailErrorRef = useRef();//error message, span element
    const passwordLengthErrorRef = useRef();//error message , span element
    

    const passwordInputRef = useRef();//password input, input element
    function validateIfPasswordsAreSame(event){
        const confirmPasswordInput = event.target;
        if(passwordInputRef.current.value === confirmPasswordInput.value){
            changeElementAttributes_OVERIDE(VALID.OUTLINE,VALID.DISPLAY)
            setFormValidState(prevState=>({
                ...prevState,confirmPassword:true
            }))
        }
        else{
            changeElementAttributes_OVERIDE(INVALID.OUTLINE,INVALID.DISPLAY)
            setFormValidState(prevState=>({
                ...prevState,confirmPassword:false
            }))
        }

        function changeElementAttributes_OVERIDE(outline, display){ // modified global function, if password did not match
            passwordInputRef.current.style.outline = outline
            confirmPasswordInput.style.outline = outline
            passwordNotSameErrorRef.current.style.display = display
        }
    }
    
    function validatePasswordLength(event){
        const password = event.target.value;
        if(password.length >= 8){
            changeElementAttributes_GLOBAL(event,passwordLengthErrorRef,VALID.OUTLINE,VALID.DISPLAY);
            setFormValidState(prevState=>({
                ...prevState,password:true
            }))
        }
        else{
            changeElementAttributes_GLOBAL(event,passwordLengthErrorRef,INVALID.OUTLINE,INVALID.DISPLAY);
            setFormValidState(prevState=>({
                ...prevState,password:false
            }))
        }
      
    }

    function validateEmail(event){
        let email = event.target.value;

        if(isValidEmail(email)){
            changeElementAttributes_GLOBAL(event,emailErrorRef,VALID.OUTLINE,VALID.DISPLAY)
            setFormValidState(prevState=>({
                ...prevState,email:true
            }))
        }
        else{
            changeElementAttributes_GLOBAL(event,emailErrorRef,INVALID.OUTLINE,INVALID.DISPLAY)
            setFormValidState(prevState=>({
                ...prevState,email:false
            }))
        }
        function isValidEmail(email){
            const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(String(email).toLowerCase());
        }

    }
    return (
        <div>
             <div className="sign-up">      

            <ol className="steps">
            <li className="stepOne active">1. Account</li>
            <li className="stepTwo">2. Information</li>
            <li className="stepThree">3. Confirmation</li>
        </ol>  
            <div className="form-wrapper">
            <div className="form-title">
                <span>Let's setup your user account details</span>
               
                </div>
                
        <form className="form-form">
        <div className="input-wrapper">
            <label className="" htmlFor="email">Email</label>
           
            <input type="email"  
            onChange={handleFormData} 
            onInput={validateEmail} 
            className="input signin-input bg1"
             name="email" required></input>

            <span className="error-message" ref={emailErrorRef}>Invalid email address</span>

        </div>
        <div className="input-wrapper">
            <label className="" htmlFor="email">Password</label>

            <input type="password" 
            onChange={handleFormData} 
            onInput={validatePasswordLength} 
            ref={passwordInputRef} 
            className="input signin-input  bg1" 
            name = "password" required></input>

            <span className="error-message" ref={passwordLengthErrorRef}>Password must be atleast 8 characters</span>

        </div>
        <div className="input-wrapper">
            <label className="" htmlFor="email">Confirm password</label>

            <input type="password"
             onChange={handleFormData}
              onInput={validateIfPasswordsAreSame} 
              className="input signin-input bg1" 
              name="confirmPassword" required></input>

            <span className="error-message" ref={passwordNotSameErrorRef}>Passwords did not match</span>

        </div>
        <div className="have-account">
        <Link to="/Signup">Already have an account? Sign In</Link>
        </div>
        <div className="btn-wrapper">
        <button type="submit" className="btn bl-bg default-clr" onClick={proceed}>Next</button>
        </div>
        </form>
        </div>
        </div>
        </div>
    );
}

export default StepOne;