import React,{useEffect} from 'react';
import {Redirect} from 'react-router-dom'
function Dashboard({isClientLoggedIn,getToken}) {

    useEffect(async()=>{
        console.log("GET")
        const val = await getToken();
        console.log(val);
    },[isClientLoggedIn])

    if(!isClientLoggedIn){
        return <Redirect to='/signin'/>
    }
    else{

    return (
        <div>
            
        </div>
    );
    
    }
}

export default Dashboard;