import React, { useState } from "react";
import "../Assets/form.css";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";


function Login({isClientLoggedIn,setSession,setToken}) {
  
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
      const response = await axios.post("http://localhost:5000/signin", formData, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        withCredentials: true,
      });
      if (response.data.message == "OK") {
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

  if (isClientLoggedIn) {
   return <Redirect to="/dashboard"></Redirect>
  }
  else {
    return (
      <div className="sign-in">
        <div className="form-wrapper">
          <div className="form-title">
            <span>Sign In</span>
          </div>
          <form className="form-form">
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

export default Login;
