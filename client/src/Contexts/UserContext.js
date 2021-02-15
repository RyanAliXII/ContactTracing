import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'
import axios from 'axios'

export const UserContext = createContext();

export const UserProvider = (props) => {

    const [isLoading,setLoading] = useState(true);
    const [session, fetchSession] = useContext(AuthContext);
    const [user, setUser] = useState({
        name: "NULL",
        qrCode: "NULL"
    });
   
    useEffect(() => {

        async function fetchUserData() {
            const { data } = await axios.post('http://localhost:5000/user', {}, { withCredentials: true });
            localStorage.setItem('userId',JSON.stringify({id:data.id}))
            setUser(data);
        }
        fetchUserData();
        setLoading(false);
        console.log("Session Checked")
    }, [session])


    return (
        <UserContext.Provider value={[user, setUser]}>
            {!isLoading && props.children}
        </UserContext.Provider>
    );
};

export default UserContext;