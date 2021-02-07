import React,{useState} from 'react';
import axios from 'axios'
function StepThree({formData}) {

    const [mobilecode,setCode] = useState();
    function handleCode(event){
        setCode(event.target.value)
    }   
    function verify(event){
        event.preventDefault()
        axios.post('http://localhost:5000/verify',{code:mobilecode,mobileNumber:formData.mobileNumber}).then(resp=>{
            console.log(resp.data)
        });
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
           <span>Please enter 4-digit code we have sent to your mobile number.</span></div>
   <form className="form-form">
   <div className="input-wrapper">
       <label className="" htmlFor="email">6 - Digit Code</label>
       <input type="number"  className="input signin-input bg1" onChange={handleCode} name="code" required></input>
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