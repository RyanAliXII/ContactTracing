import React from 'react';
import QrReader from 'react-qr-scanner';
import {Redirect} from 'react-router-dom'



function ScannerDashboard({isScannerUserLoggedIn,getToken}) {

    function handleError(){

    }
    function handleHandleScan(result){
    }

    if(!isScannerUserLoggedIn){
      return  <Redirect to="/signin"></Redirect>
    }
    else{
    return (
        <div>
            <QrReader
            onScan={handleHandleScan}
            onError={handleError}
            ></QrReader>
        </div>
    );
    }
}

export default ScannerDashboard;