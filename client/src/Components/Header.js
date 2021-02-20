import React,{useContext} from 'react';
import '../Assets/header.css'
import {BiLogOut} from 'react-icons/bi'
import axios from 'axios';
import {AuthContext} from '../Contexts/AuthContext'
import cors from '../cors'

function Header(props) {

    const [session,fetchSession] = useContext(AuthContext);

    async function logout(){
        const {data} = await axios.post(`${cors.domain}/logout`,{},{withCredentials:true});
        localStorage.setItem('auth',JSON.stringify({bool:false,role:"NONE"}));
        localStorage.removeItem('userId');
        fetchSession(prevState=> prevState + 1);
    }

    return (
        <header className="nav-header blue-bg">   
               <div className="logout">
                    <span className="default-clr" onClick={logout}><BiLogOut></BiLogOut></span>
                   </div> 
        </header>
    );
}

export default Header;