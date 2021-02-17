import React,{createContext, useState}from 'react';



export const LogsNavigationContext = createContext()
export const LogsNavigationProvider = (props) => {

    const [logsNavState, setlogsNavState] = useState(false); // false if close
    return (
       <LogsNavigationContext.Provider value={[logsNavState, setlogsNavState]}>
           {props.children}
       </LogsNavigationContext.Provider>
    );
};

export default LogsNavigationContext;