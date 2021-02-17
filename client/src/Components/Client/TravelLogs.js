import React, { useEffect, useState, useContext} from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import {UserContext} from '../../Contexts/UserContext'
import {LogsNavigationContext} from '../../Contexts/LogsNavigationContext'
import {AuthContext} from '../../Contexts/AuthContext'
import {IoArrowBackCircleSharp} from 'react-icons/io5'
function TravelLogs() {

    const [user,setUser] = useContext(UserContext)
    const [session,fetchSession] = useContext(AuthContext)
    const [logsNavState,setLogsNavState] = useContext(LogsNavigationContext)
    const [lastReported,setLastReported] = useState({});
    const [travelLogs,setTravelLogs] = useState([])

    useEffect(()=>{
        let isMount = true;
        async function fetchTravelLogs(){
          
            try{
            const {data} = await axios.post('http://localhost:5000/client/fetchlogs',JSON.parse(localStorage.getItem('userId')));
            if(isMount){
            setTravelLogs(data);
            }

            }catch (error) {
                console.log(error)
            }
        }
        fetchTravelLogs();
        return ()=>{
            isMount = false;
        }
    },[lastReported])

    if(!logsNavState){
        return <Redirect to="/dashboard"/>
    }
        return (
           JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role === "Client" ? (
           <>
           <div className="back-buttons">
                
            </div>
            <div className="travel-logs">
                <div className="title-wrapper">
                    <span className="title-text">Travel Logs</span>
                    <span className="back-btn" onClick={()=>{setLogsNavState(false)}}><IoArrowBackCircleSharp></IoArrowBackCircleSharp></span>
                </div>
                <div className="travel-logs-wrapper">
                    <ul className="travel-log-lists">
                    { 
                        travelLogs.map((log,index)=>{
                            return <TravelLogList log={log} setLastReported={setLastReported} user={user} key={index}></TravelLogList>
                        })
                         
                    }      
                    
                    </ul>
                </div>
            </div>
            </>
         ): (<Redirect to="/"></Redirect>)
        );
    
}
function TravelLogList({ log,user,setLastReported}) {

    const [logState,setLogState] = useState({});
    const [reportModalClass, setReportModalClass] = useState('report-modal bg1 hide');

    useEffect(() => {
        if(JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role === "Client"){
            setLogState(log);
        }
    },[])
    async function sendReport(){
        const report = {
            id:user.id,
            name:user.name,
            logId:log.id,
            location:log.location,
            time:`${log.day}, ${log.time}, ${log.month}`
        }
        const {data} = await axios.post('http://localhost:5000/client/report',report)
        console.log(data);
        
        setLastReported(report);
    }
    return (
        !log.isReported ? (
        <li className="travel-log-list bg1">
           <span className="location">{log.location}</span>
           <span className="time">{`${log.day}, ${log.time}, ${log.month}`}</span>
           <span className="not-me warn-bg default-clr" onClick={()=>{setReportModalClass('report-modal bg1')}}>Report</span>
           <div className={reportModalClass}>
               <div className="report-modal-header warn-bg">
                   <span className="default-clr">Confirmation</span>
               </div>
               <div className="report-prompt">
           <span className="report-message">Are you sure, you want to report this is activity?</span>
           <div>
           <span className="confirm modal-btn warn" onClick={sendReport}>Confirm</span>
           <span className="cancel modal-btn  ok-text" onClick={()=>{setReportModalClass('report-modal bg1 hide')}}>Cancel</span>
           </div>
           </div>
        </div>
        </li>
    
        ) : (
            <li className="travel-log-list bg1">
            <span className="location">{log.location}</span>
            <span className="time">{`${log.day}, ${log.time}, ${log.month}`}</span>
            <span className="warn">Report had been sent.</span>
         </li>
        )
    )
}
export default TravelLogs;