import React, { useState,useContext,useRef} from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {AuthContext} from '../../Contexts/AuthContext'
import cors from '../../cors'

function ScannerLogin({setLoadingClass}) {
  const [session,refetchSession] = useContext(AuthContext)  
  const [formData, setFormData] = useState({});

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
      const response = await axios.post(`${cors.domain}/room/signin`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        withCredentials: true,
      });
      if (response.data.message === "OK") {
        setLoadingClass('hide')
        localStorage.setItem('auth',JSON.stringify({bool:true,role:"Scanner"}))
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
      !JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role !== "Scanner" ? (
      <div className="sign-in">
        <div className="form-wrapper">
          <div className="form-title">
            <span>QR Scanner</span>
          </div>
          <form className="form-form">
          <span className="error-message warn" ref={invalidLoginRef}>Invalid username or password</span>
            <div className="input-wrapper">
              <label className="" htmlFor="email">
               Username
            </label>
              <input
                type="text"
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
            </div>
            <div className="btn-wrapper">
              <button
                type="button"
                onClick={sendFormData}
                className="btn blue-bg default-clr"
              >
                Sign In
            </button>
            </div>
          </form>
        </div>
      </div>
      ):(<Redirect to="/org/Scanner"></Redirect>)
    );
  }
export default ScannerLogin;
