import React, { useState, useEffect,useRef,useContext} from 'react';
import QrReader from 'react-qr-reader';

import { Redirect } from 'react-router-dom'
import  {AuthContext} from '../../Contexts/AuthContext'
import axios from 'axios';
import cors from '../../cors'



function ScannerDashboard({  }) {
    const [findScan, setScan] = useState(false)
    const [session,fetchSession] = useContext(AuthContext)
    const [facingMode,setFacingMode] = useState('environment')

    const [user, setUser] = useState({
        room: "NONE"
    });
    function handleError(error) {
        console.log(error)
    }
    function handleHandleScan(result) {
        if (result !== null && findScan === false) {
            setScan(true);
            sendData(result);
        }
    }
    const scannerMessageRef = useRef();
    async function sendData(qrCode) {
        const {data} = await axios.post(`${cors.domain}/room/createlog`, { qrCode: qrCode,location:user.room})
        if(data === "OK"){
            scannerMessageRef.current.innerText= "QR CODE SUCCESSFULLY SCANNED"
            setTimeout(()=>{
                if(window.location.pathname === '/org/Scanner'){
                    setScan(false);
                    scannerMessageRef.current.innerText= "Ready to Scan Again"
                }
                
            },3000)
        }
    }
    function handleFacingMode(event){
      setFacingMode(event.target.value)
    }
    useEffect(() => {
      
        let unmount = false;
        async function fetchUserData() {
            try{
            const { data } = await axios.post(`${cors.domain}/user`, {}, { withCredentials: true })
            if (!unmount) setUser(data)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchUserData()
        return () => {
            unmount = true
        }
    }, [session]);



        return (
            JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role === "Scanner"  ? (
            <div className="scanner-db">
                <div className="scanner-info">
                    <span className="org">{user.room}</span><br></br>
                    <span className="username">{user.username}</span>
                </div>
                <div className="scanner-wrapper">
                    <span ref={scannerMessageRef}>Ready to Scan</span>
                    <QrReader
                        onScan={handleHandleScan}
                        facingmode={facingMode}
                        onError={handleError}
                        className="scanner"
                        
                    ></QrReader>
                    <div className=""></div>
                </div>
                <div className="select-wrapper">
                <div className="input-wrapper">
                    <select className="bg1" onChange={handleFacingMode}>
                        <option onChange={handleFacingMode}>Select Facing Mode</option>
                        <option value="environment">Front</option>
                        <option value="user">Rear</option>
                    </select>
                </div>
                </div>
            </div>
            ): (<Redirect to="/"></Redirect>)
        );
}

export default ScannerDashboard;