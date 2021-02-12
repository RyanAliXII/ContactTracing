import { useState, useEffect } from 'react'
import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Client/Register/Register';
import Dashboard from './Components/Client/Dashboard';
import Scanner from './Components/Scanner/ScannerDashboard'
import ScannerLogin from './Components/Scanner/ScannerLogin'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AdminLogin from './Components/Admin/AdminLogin'
import axios from 'axios'
import './Assets/app.css'
import './Assets/dashboard.css'

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";


function App() {

  const [isClientLoggedIn, setLoggedIn] = useState(false);
  const [isScannerUserLoggedIn, setScannerLoggedIn] = useState(false);
  const [isAdminLoggedIn,setAdminLoggedIn] = useState(false);

  const [session, fetchSession] = useState(1);
  const [accessToken, setAccessToken] = useState('');

  function setToken(token) {
    setAccessToken(token);
  }

  async function getToken() {

    if (isClientLoggedIn) {
      if (accessToken.length === 0) {
        const { data } = await axios.post("http://localhost:5000/fetchtoken", {}, { withCredentials: true })
        setAccessToken(data)
        return accessToken;
      }
      else {
        return accessToken;
      }
    }
    return " "
  }

  useEffect(() => {
    async function checkSession(){
    const { data } = await axios.get('http://localhost:5000/auth', { withCredentials: true });
      console.log(data)
      if(data.role === "Client"){
        setLoggedIn(data.auth)
      }else if(data.role === "Scanner"){
        setScannerLoggedIn(data.auth);
      }
    }
    checkSession()
  }, [session])

  function setSession() {
    fetchSession(prevState => prevState + 1);
  }
  

  return (
    <>
      <Header></Header>
      <Router>
     <Route path="/" exact={true} component={Home}></Route>
      <Route path="/signin"><Login setSession={setSession} setToken={setToken} isClientLoggedIn={isClientLoggedIn}  isScannerUserLoggedIn={isScannerUserLoggedIn} ></Login></Route>
       <Route path="/signup"><Register></Register></Route>
       <Route path="/dashboard"><Dashboard getToken={getToken}  isClientLoggedIn={isClientLoggedIn} /></Route>
       <Route path="/scanner"><Scanner getToken={getToken} isScannerUserLoggedIn={isScannerUserLoggedIn}></Scanner></Route>
       <Route path="/org" exact><ScannerLogin getToken={getToken} setToken={setToken} setSession={setSession} isScannerUserLoggedIn={isScannerUserLoggedIn}></ScannerLogin></Route>
      <Route path="/admin" exact><AdminLogin getToken={getToken} setToken={setToken} setSession={setSession} isAdminLoggedIn={isAdminLoggedIn}></AdminLogin></Route>
      <Route path="/admin/dashboard"><AdminDashboard></AdminDashboard></Route>
      </Router>
    </>
  );
}

export default App;
