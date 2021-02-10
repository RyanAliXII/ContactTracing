import { useState, useEffect } from 'react'
import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Client/Register/Register';
import Dashboard from './Components/Client/Dashboard';
import axios from 'axios'
import './Assets/app.css'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";


function App() {


  const [accessToken, setAccessToken] = useState('');
  const [isClientLoggedIn, setLoggedIn] = useState(false);
  const [session, fetchSession] = useState(1);

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

  useEffect(async () => {
    const { data } = await axios.get('http://localhost:5000/auth', { withCredentials: true });
    setLoggedIn(data)
  }, [session])

  function setSession() {
    fetchSession(prevState => prevState + 1);
  }

  return (
    <>
      <Header></Header>
      <Router>
        <Route component={Home} path="/" exact={true}></Route>
        <Route path="/signin"><Login setSession={setSession} setToken={setToken} isClientLoggedIn={isClientLoggedIn} /></Route>
        <Route><Dashboard getToken={getToken} isClientLoggedIn={isClientLoggedIn} /></Route>
        <Route component={Register} path="/signup"></Route>
      </Router>
    </>
  );
}

export default App;
