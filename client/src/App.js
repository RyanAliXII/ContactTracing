
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Client/Register/Register';
import Dashboard from './Components/Client/Dashboard';
import Scanner from './Components/Scanner/ScannerDashboard'
import ScannerLogin from './Components/Scanner/ScannerLogin'
import AdminDashboard from './Components/Admin/AdminDashboard'
import AdminLogin from './Components/Admin/AdminLogin'
import TravelLogs from './Components/Client/TravelLogs'
import './Assets/app.css'
import './Assets/dashboard.css'
import {AuthProvider} from './Contexts/AuthContext'
import {UserProvider} from './Contexts/UserContext'
import {LogsNavigationProvider} from './Contexts/LogsNavigationContext'
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
        <Route path="/signin">
          <Login ></Login>
        </Route>

        <Switch>
          
        <Route path="/dashboard/logs">
          <TravelLogs >
          </TravelLogs>
        </Route>

        <Route path="/dashboard" >
          <Dashboard></Dashboard>
        </Route>

        </Switch>
       
        
        </LogsNavigationProvider>

        <Route path="/org/scanner">
          <Scanner >
          </Scanner>
        </Route>
        <Route path="/org" exact>
          <ScannerLogin >
          </ScannerLogin>
        </Route>

        <Route path="/admin" exact>
          <AdminLogin>
          </AdminLogin></Route>
        <Route path="/admin/dashboard">
          <AdminDashboard >
          </AdminDashboard></Route>
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
