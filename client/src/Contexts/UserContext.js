import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'
import axios from 'axios'
import cors from '../cors'
export const UserContext = createContext();

export const UserProvider = (props) => {

    const [isLoading,setLoading] = useState(true);
    const [session, fetchSession] = useContext(AuthContext);
    const [user, setUser] = useState({
        name: "NULL",
        qrCode: "NULL",
        fullAddress:" "
    });
   
    useEffect(() => {
        let isMount = true;
        async function fetchUserData() {
            const { data } = await axios.post(`${cors.domain}/user`, {}, { withCredentials: true });
            localStorage.setItem('userId',JSON.stringify({id:data.id}))
            if(isMount){
          
            setUser(data);
            }
        }
        
        fetchUserData();
        setLoading(false);
       
        return ()=>{
            isMount = false;
        }
    }, [session])


    return (
        <UserContext.Provider value={[user, setUser]}>
            {
                !isLoading ? (props.children):<></>
            }
        </UserContext.Provider>
    );
};

export default UserContext;