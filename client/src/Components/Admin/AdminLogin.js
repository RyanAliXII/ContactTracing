import React, { useState,useContext } from "react";
import { Redirect } from "react-router-dom";
import {AuthContext} from '../../Contexts/AuthContext'
import axios from "axios";


function AdminLogin() {
  
  const [session,reFetchSession] = useContext(AuthContext)
  const [formData, setFormData] = useState({});
  function handleFormData(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  async function sendFormData() {
    try {
       
      const response = await axios.post("http://localhost:5000/admin/signin", formData, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        withCredentials: true,
      });
      if (response.data.message === "OK") {
        localStorage.setItem('auth',JSON.stringify({bool:true,role:"Admin"}))
        reFetchSession(prevState => prevState + 1);
      }
      else {
        console.log(response.data)
      }
    } catch (error) {
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
                className="btn ok default-clr"
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
