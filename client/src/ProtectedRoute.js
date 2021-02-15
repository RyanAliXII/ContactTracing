import React from 'react';
import {Route,Redirect} from 'react-router-dom'

function ProtectedRoute({validateAuth,component:Component,...rest}) {
    return (
            <Route 
                {...rest}
                render = {((props)=>{
                    if(validateAuth){
                        return <Component></Component>
                    }
                    else{
                        return <Redirect to={{pathname:"/signin",state:{from:props.location}}}></Redirect>
                    }
                })}
            />
                 
    );
}

export default ProtectedRoute;