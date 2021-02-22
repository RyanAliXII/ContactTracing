import React, { useState,useContext,useEffect,useRef } from "react";
import "../Assets/form.css";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import {AuthContext} from '../Contexts/AuthContext'
import cors from '../cors'

function Login({setLoadingClass}) {
 
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
      setLoadingClass('loading-wrapper')
      const response = await axios.post(`${cors.domain}/signin`, formData, {
        headers: {
          "Content-Type": "application/json"
         // "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        withCredentials: true,
      });
      if (response.data.message === "OK") {
        setLoadingClass('hide')
        localStorage.setItem('auth',JSON.stringify({bool:true,role:"Client"}))
        refetchSession(prevState=> prevState + 1);
      } 
      else {
          setLoadingClass('hide')
          invalidLoginRef.current.style.display = "inline"
      }
    } catch (error) {
      setLoadingClass('hide')
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
                name="username"
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
                className="btn signin-btn blue-bg default-clr"
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
