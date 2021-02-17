import React, { useState,useContext,useEffect,useRef } from "react";
import "../Assets/form.css";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import {AuthContext} from '../Contexts/AuthContext'

function Login({}) {
  
  const [formData, setFormData] = useState({});
  const [session,refetchSession] = useContext(AuthContext)
  const invalidLoginRef = useRef();
  function handleFormData(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  async function sendFormData() {
    try {
      const response = await axios.post("http://localhost:5000/signin", formData, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        withCredentials: true,
      });
      if (response.data.message === "OK") {
        localStorage.setItem('auth',JSON.stringify({bool:true,role:"Client"}))
        refetchSession(prevState=> prevState + 1);
      } 
      else {
          invalidLoginRef.current.style.display = "inline"
      }
    } catch (error) {
      console.log(error)
    }
  }
    return (
     !JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role !== "Client" ? (
      <div className="sign-in">
        <div className="form-wrapper">
          <div className="form-title">
            <span>Sign In</span>
          </div>
          <form className="form-form">
          <span className="error-message warn" ref={invalidLoginRef}>
                Invalid Username or Password
              </span>
            <div className="input-wrapper">
              <label className="" htmlFor="email">
                Email or Mobile Number
            </label>
              <input
                type="email"
                name="email"
                className="input signin-input bg1"
                onChange={handleFormData}
                required
              ></input>
            </div>
            <div className="input-wrapper">
              <label className="" htmlFor="email">
                Password
            </label>
              <input
                type="password"
                name="password"
                className="input signin-input bg1"
                onChange={handleFormData}
                required
              ></input>
            </div>
            <div className="no-account">
              <Link to="/signup">Don't have an account? Sign Up</Link>
            </div>
            <div className="btn-wrapper">
              <button
                type="button"
                onClick={sendFormData}
                className="btn signin-btn ok default-clr"
              >
                Sign In
            </button>
            </div>
          </form>
        </div>
      </div>
      ) : (<Redirect to="/dashboard"></Redirect>)
    );
  
}

export default Login;
