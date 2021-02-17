import React,{createContext, useState}from 'react';



export const ReportsNavigationContext = createContext()
export const ReportsNavigationProvider = (props) => {

    const [reportsNavState, setReportsNavState] = useState(false); // false if close
    return (
       <ReportsNavigationContext.Provider value={[reportsNavState, setReportsNavState]}>
           {props.children}
       </ReportsNavigationContext.Provider>
    );
};

