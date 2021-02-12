import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import QRCode from 'qrcode.react'
import axios from 'axios'
import HeroImg from '../../Assets/images/social_distance.svg'
function Dashboard({ isClientLoggedIn, getToken }) {

    const [user, setUser] = useState({
        name:"Ryan Ali",
        qrCode:"SOMETHING"
    });
    useEffect(() => {
        async function fetchClientData(){
            if (isClientLoggedIn) {
                const { data } = await axios.post('http://localhost:5000/user', {}, { withCredentials: true })
                setUser(data)
            }
          
        }
        
        fetchClientData();
    }, [isClientLoggedIn])

    if (!isClientLoggedIn) {
       return <Redirect to='/signin' />
    }
    else
    {

        return (
            <div className="dashboard">
                <div className="hero">
                    <div className="hero-text">
                        <span className="text">Welcome <br/> {user.name}</span>
                    </div>
                    <div className="hero-image">
                        <img src={HeroImg}></img>
                    </div>
                </div>
                <div className="db-menu">
                    <div className="menu-selection bg1">
                        <span>My Profile</span>
                    </div>
                    <div className="menu-selection bg1"><span>Travel logs</span></div>
                </div>
                <div className="qr">
                    <span className="title">Scan Here</span>
                    <div className="qr-code">
                    <QRCode value={user.qrCode} size={190}/>
                    </div>
                 <div className="desc-wrapper"> <span className="desc-text">You can screenshot the QR code if you are going out without internet connection. Just make sure you won’t share it with others.</span></div>  
                 <div className="generate"><button type="button" className="generate-btn bl-bg default-clr btn">Generate New QR Code</button></div>  
                </div>
                <div className="create-org">
                    
                </div>
            </div>
        );

    }
}

export default Dashboard;