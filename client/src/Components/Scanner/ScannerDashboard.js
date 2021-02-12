import React, { useState, useEffect,useRef } from 'react';
import QrReader from 'react-qr-scanner';
import { Redirect } from 'react-router-dom'
import axios from 'axios';




function ScannerDashboard({ isScannerUserLoggedIn, getToken }) {
    const [findScan, setScan] = useState(false)
    const [user, setUser] = useState({
        org: "NONE"
    });
    function handleError() {
        console.log("ERROR")
    }
    function handleHandleScan(result) {
        if (result !== null && findScan === false) {
            let qrCode = result.text;
            setScan(true);
            sendData(qrCode);
        }
    }
    const scannerMessageRef = useRef();
    async function sendData(qrCode) {
        const {data} = await axios.post('http://localhost:5000/org/createlog', { qrCode: qrCode,location:user.org})
        if(data === "OK"){
            scannerMessageRef.current.innerText= "QR CODE SUCCESSFULLY SCANNED"
            setTimeout(()=>{
                setScan(false);
                scannerMessageRef.current.innerText= "Ready to Scan Again"
            },3000)
        }
    }
    
    useEffect(() => {
      
        let unmount = false;
        async function fetchUserData() {
            try{
            const { data } = await axios.post('http://localhost:5000/user', {}, { withCredentials: true })
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
    }, [isScannerUserLoggedIn]);


    if (!isScannerUserLoggedIn) {
        return <Redirect to="/org"></Redirect>
    } else {
        return (

            <div>
                <div className="scanner-info">
                    <span className="org">{user.org}</span><br></br>
                    <span className="username">{user.username}</span>
                </div>
                <div className="scanner-wrapper">
                    <span ref={scannerMessageRef}>Ready to Scan</span>
                    <QrReader
                        onScan={handleHandleScan}
                        onError={handleError}
                        className="scanner"
                    ></QrReader>
                    <div className=""></div>
                </div>
            </div>
        );
    }
}

export default ScannerDashboard;