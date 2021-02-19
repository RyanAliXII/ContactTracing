import React,{ useState,createContext,useEffect}from 'react';
import axios from 'axios'


export const AuthContext = createContext()


export const AuthProvider = (props) => {

    const [isLoading,setLoading] = useState(true)
    const [session,refetchSession] = useState(1);
    useEffect(() => {
        async function validateAuth(){
            const {data} = await axios.get('http://localhost:5000/Auth',{withCredentials:true});
            localStorage.setItem('auth',JSON.stringify(data))
        }
        validateAuth()
        setLoading(false)
       
    },[session])
    
    return (
            <AuthContext.Provider value={[session,refetchSession]}>
                {
                    !isLoading ? props.children : <></>
                }
            </AuthContext.Provider>
    );
};

