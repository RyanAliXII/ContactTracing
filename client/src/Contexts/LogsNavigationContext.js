import React,{createContext, useState}from 'react';



export const LogsNavigationContext = createContext()
export const LogsNavigationProvider = (props) => {

    const [logsNavState, setlogsNavState] = useState(false); // false if close

    function openLogs(){
        setlogsNavState(true);
    }

    function closeLogs(){
        setlogsNavState(false);
    }

    return (
       <LogsNavigationContext.Provider value={[logsNavState, setlogsNavState]}>
           {props.children}
       </LogsNavigationContext.Provider>
    );
};

export default LogsNavigationContext;