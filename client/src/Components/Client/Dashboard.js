import React, { useEffect, useState,useContext} from 'react';
import { Redirect } from 'react-router-dom'
import QRCode from 'qrcode.react'
import axios from 'axios'
import HeroImg from '../../Assets/images/social_distance.svg'
import {UserContext} from '../../Contexts/UserContext'
import {AuthContext} from '../../Contexts/AuthContext'
import {LogsNavigationContext} from '../../Contexts/LogsNavigationContext'
import {ProfileNavStateContext} from '../../Contexts/ProfileNavState'

function Dashboard({setLoadingClass}) {

    const [user,setUser] = useContext(UserContext)
    const [session,fetchSession] = useContext(AuthContext)
    const [logsNavState,setLogsNavState] = useContext(LogsNavigationContext)
    const [profileNavState,setProfileNavState] = useContext(ProfileNavStateContext)

        async function generateQrCode(){
            setLoadingClass('loading-wrapper')
            try{
            const {data} = await axios.post('http://localhost:5000/client/generateQR',{id:user.id},{withCredentials: true})
            setLoadingClass('hide')
            if(data === "OK"){
                fetchSession(prevState => prevState + 1);
            } 

            }catch(error){
                console.log(error);
            }
        }   


        if(logsNavState){
            return <Redirect to="/dashboard/logs"></Redirect>
        }
        if(profileNavState){
            return <Redirect to="/dashboard/profile"></Redirect>
        }

        return (
          JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role === "Client" ? (
            <div className="dashboard">
                <div className="hero">
                    <div className="hero-text">
                        <span className="text">Welcome <br/>{user.name}</span>
                    </div>
                    <div className="hero-image">
                        <img src={HeroImg} alt="social_distance"></img>
                    </div>
                </div>
                <div className="db-menu">
                    <div className="menu-selection bg1" onClick={()=>{setLogsNavState(true)}}><span>View Travel logs</span></div>
                    <div className="menu-selection bg1" onClick={()=>{setProfileNavState(true)}}><span>My Profile</span></div>
                </div>
                <div className="qr">
                    <span className="title">Scan Here</span>
                    <div className="qr-code">
                    <QRCode value={user.qrCode} size={190}/>
                    </div>
                 <div className="desc-wrapper"> <span className="desc-text">You can screenshot the QR code if you are going out without internet connection. Just make sure you won’t share it with others.</span></div>  
                 <div className="generate"><button type="button" onClick={generateQrCode} className="generate-btn bl-bg default-clr btn" >Generate New QR Code</button></div>  
                </div>
                <div className="create-org">
                    
                </div>
                
              
            </div>
          ) : (<Redirect to='/'></Redirect>)
        );

    
}

export default Dashboard;