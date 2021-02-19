
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
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";


function App() {



  return (
    <>

      <Router>
     
        <Route path="/" exact={true} component={Home}></Route>

        <AuthProvider>
          <UserProvider>
        <LogsNavigationProvider>
        <ProfileNavStateProvider>
        <Route path="/signin">
          <Login ></Login>
        </Route>

        <Switch>
          
        <Route path="/dashboard/logs">
          <TravelLogs >
          </TravelLogs>
        </Route>
      <Route path="/dashboard/profile">
        <Profile></Profile>
      </Route>
        <Route path="/dashboard" >
          <Header></Header>
          <Dashboard></Dashboard>
        </Route>

        </Switch>
       
        </ProfileNavStateProvider>
        </LogsNavigationProvider>

        <Route path="/org/scanner">
          <Header></Header>
          <Scanner >
          </Scanner>
        </Route>
        <Route path="/org" exact>
          <ScannerLogin >
          </ScannerLogin>
        </Route>

   
      <Route path="/admin" exact>
          <AdminLogin>
          </AdminLogin>
          </Route>
      <ReportsNavigationProvider>
      <LogsNavigationProvider>   
      <Route path="/admin/reports">
            <Reports></Reports>
          </Route>
      <Route path="/admin/dashboard">
          <Header></Header>
          <AdminDashboard>
          </AdminDashboard>
          </Route>
      <Route path="/admin/logs">
          <Logs></Logs>
        </Route>  
        </LogsNavigationProvider>  
       </ReportsNavigationProvider>
         
    
      
     
          </UserProvider>
        </AuthProvider>

        <Route path="/signup">
          <Register></Register>
        </Route>
      </Router>
    </>
  );
}

export default App;
