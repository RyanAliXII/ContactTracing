import Header  from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import MainRegistrationForm from './Components/Client/Register/Register';
import './Assets/app.css'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";



function App() {
  return (
    <>
   <Header></Header>
  <Router>
    <Route component={Home} path="/" exact={true}></Route>
    <Route component={Login}  path="/Signin"></Route>
    <Route component={MainRegistrationForm} path="/Signup"></Route>
  </Router>
    </>
  );
}

export default App;
