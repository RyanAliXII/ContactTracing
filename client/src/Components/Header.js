import React,{useContext} from 'react';
import '../Assets/header.css'
import {BiLogOut} from 'react-icons/bi'
import axios from 'axios';
import {AuthContext} from '../Contexts/AuthContext'


function Header(props) {

    const [session,fetchSession] = useContext(AuthContext);

    async function logout(){
        const {data} = await axios.post('http://localhost:5000/logout',{},{withCredentials:true});
        localStorage.setItem('auth',JSON.stringify({bool:false,role:"NONE"}));
        localStorage.removeItem('userId');
        fetchSession(prevState=> prevState + 1);
        console.log(data);
    }

    return (
        <header>   
               <div className="logout">
                    <span className="default-clr" onClick={logout}><BiLogOut></BiLogOut></span>
                   </div> 
        </header>
    );
}

export default Header;