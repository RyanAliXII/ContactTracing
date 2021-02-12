import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";


function AdminLogin({isAdminLoggedIn,setSession,setToken}) {
  
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
      console.log(response)
      if (response.data.message === "OK") {
        setToken(response.data.token);
        setSession()
      }
      else {
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (isAdminLoggedIn) {
   return <Redirect to="/scanner"></Redirect>
  }
  else {
    return (
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
    );
  }
}

export default AdminLogin;
