import React,{useState, createContext} from 'react';

export const ProfileNavStateContext = createContext();
export const ProfileNavStateProvider = (props) => {
    const [profileNavState,setProfileNavState] = useState(false);

    return (
        <ProfileNavStateContext.Provider value={[profileNavState,setProfileNavState]}>
            {props.children}
        </ProfileNavStateContext.Provider>
    );
};

