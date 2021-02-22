import React, { useState,useContext,useRef} from "react";
import { Redirect } from "react-router-dom";
import {AuthContext} from '../../Contexts/AuthContext'
import axios from "axios";
import cors from "../../cors"

function AdminLogin({setLoadingClass}) {
  
  const [session,reFetchSession] = useContext(AuthContext)
  const [formData, setFormData] = useState({});
  const invalidLoginRef = useRef()
  function handleFormData(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  async function sendFormData() {
    try {
      setLoadingClass('loading-wrapper');
      const response = await axios.post(`${cors.domain}/admin/signin`, formData, {
        headers: {
          "Content-Type": "application/json"
          //"Access-Control-Allow-Origin": "http://localhost:3000",
        },
        withCredentials: true,
      });
      if (response.data.message === "OK") {
        localStorage.setItem('auth',JSON.stringify({bool:true,role:"Admin"}))
        reFetchSession(prevState => prevState + 1);
        setLoadingClass('hide')
      }
      else {
        invalidLoginRef.current.style.display = "inline"
        setLoadingClass('hide')
      }
    } catch (error) {
      setLoadingClass('hide')
      console.log(error)
    }
  }

    return (
      !JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role !== "Admin" ? (
      <div className="sign-in">
        <div className="form-wrapper">
          <div className="form-title">
            <span>Administrator</span>
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
      ):(<Redirect to="/admin/dashboard"></Redirect>)
    );
  }


export default AdminLogin;
