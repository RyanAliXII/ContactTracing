import React from 'react';
import '../Assets/form.css'
import {Link} from "react-router-dom";
  
function Login(props) {
    return (
        <div className="sign-in">        
            <div className="form-wrapper">
            <div className="form-title">
                <span>Sign In</span></div>
        <form className="form-form">
        <div className="input-wrapper">
            <label className="" htmlFor="email">Email or Mobile Number</label>
            <input type="email" className="input signin-input bg1" required></input>
        </div>
        <div className="input-wrapper">
            <label className="" htmlFor="email">Password</label>
            <input type="password" className="input signin-input bg1" required></input>
        </div>
        <div className="no-account">
        <Link to="/Signup">Don't have an account? Sign Up</Link>
        </div>
        <div className="btn-wrapper">
        <button type="button" className="btn ok default-clr">Sign In</button>
        </div>
        </form>
        </div>
        </div>
    );
}

export default Login;