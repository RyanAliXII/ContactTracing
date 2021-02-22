
import {useState} from 'react'
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Client/Register/Register';
import Dashboard from './Components/Client/Dashboard';
import Scanner from './Components/Scanner/ScannerDashboard'
import ScannerLogin from './Components/Scanner/ScannerLogin'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AdminLogin from './Components/Admin/AdminLogin'
import TravelLogs from './Components/Client/TravelLogs'
import Header from './Components/Header'
import Reports from './Components/Admin/Reports'
import Profile from './Components/Client/Profile'
import './Assets/app.css'
import './Assets/dashboard.css'
import {AuthProvider} from './Contexts/AuthContext'
import {UserProvider} from './Contexts/UserContext'
import {LogsNavigationProvider} from './Contexts/LogsNavigationContext'
import {ReportsNavigationProvider} from './Contexts/ReportNavigationContext'
import {ProfileNavStateProvider} from './Contexts/ProfileNavState'
import Logs from './Components/Admin/Logs'
import Loading from './Components/Loading'

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";


function App() {
  if(localStorage.getItem('auth') === null){
    console.log("FIRST RUN");
    localStorage.setItem('auth',JSON.stringify({bool:false, role:"none"}))
    localStorage.setItem('userId',JSON.stringify({id:''}))
  }
  const [loadingClass,setLoadingClass] = useState('hide')
  return (
    <>

      <Router>
      <Loading Class={loadingClass}></Loading>
     <Switch>

        <AuthProvider>
          <UserProvider>
        <LogsNavigationProvider>
        <ProfileNavStateProvider>
        
        <Switch>
        <Route path="/signin">
          <Login setLoadingClass = {setLoadingClass}></Login>
        </Route>
     <Route path="/signup">
          <Register setLoadingClass = {setLoadingClass}></Register>
        </Route>
      <Route path="/" exact component={Home}></Route>

        </Switch>


        <Switch>
          
        <Route path="/dashboard/logs">
          <TravelLogs setLoadingClass = {setLoadingClass}>
          </TravelLogs>
        </Route>
      <Route path="/dashboard/profile">
        <Profile setLoadingClass = {setLoadingClass}></Profile>
      </Route>
        <Route path="/dashboard" >
          <Header></Header>
          <Dashboard setLoadingClass={setLoadingClass}></Dashboard>
        </Route>

        </Switch>
       
        </ProfileNavStateProvider>
        </LogsNavigationProvider>
    <Switch>
        <Route path="/org/scanner">
          <Header></Header>
          <Scanner setLoadingClass = {setLoadingClass}>
          </Scanner>
        </Route>
        <Route path="/org" >
          <ScannerLogin setLoadingClass={setLoadingClass}>
          </ScannerLogin>
        </Route>
      </Switch>
    <Switch>
      
      <ReportsNavigationProvider>
      <LogsNavigationProvider>   

      <Route path="/admin/reports">
            <Reports setLoadingClass={setLoadingClass}></Reports>
          </Route>

      <Route path="/admin/dashboard">
          <Header></Header>
          <AdminDashboard setLoadingClass={setLoadingClass}>
          </AdminDashboard>
          </Route>

      <Route path="/admin/logs" >
          <Logs setLoadingClass={setLoadingClass}></Logs>
        </Route>  

        <Route path="/admin">
          <AdminLogin setLoadingClass = {setLoadingClass}>
          </AdminLogin>
          </Route>

        </LogsNavigationProvider>  
       </ReportsNavigationProvider>
       </Switch>
          </UserProvider>
        </AuthProvider>
        
  </Switch>

      </Router>

    </>
  );
}

export default App;
