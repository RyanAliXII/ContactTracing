import React, { useEffect, useState,useContext} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom'
import {IoArrowBackCircleSharp} from 'react-icons/io5'
import {LogsNavigationContext} from '../../Contexts/LogsNavigationContext'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import cors from '../../cors'
function Logs({setLoadingClass}) {
    const [travelLogs,setTravelLogs] = useState([])
    const [logsNavState,setLogsNavState] = useContext(LogsNavigationContext)
    const [rooms,setRooms] = useState([])
    const [dateFilter,setDateFilter] = useState(new Date());
    const [selectedRoom,setSelectedRoom] = useState('');

        useEffect(()=>{
           
            let isMount = true;
            async function fetchAllLogs(){
                setLoadingClass('loading-wrapper')
                try{
                const {data} = await axios.post(`${cors.domain}/admin/logs`,{})
                setLoadingClass('hide')
                if(isMount){
                setTravelLogs(data)
                }
                }catch(error){
                    console.log(error)
                }
            }
            async function fetchRooms(){
                const {data} = await axios.get(`${cors.domain}/room/fetchrooms`)
                if(isMount){
                setRooms(data);
                }
            }
            fetchAllLogs();
            fetchRooms();

            return ()=>{
                isMount = false;
            }
        },[])
        
        useEffect(() => {
            async function fetchFilteredLogs(){
                const {data} = await axios.post(`${cors.domain}/admin/logs/${dateFilter}/${selectedRoom}`,{});
                if(data.length > 0){
                setTravelLogs(data)
                }
    
            }
            if(selectedRoom.length > 0){
                fetchFilteredLogs();
            }
           

        },[selectedRoom])
   
    

        if(!logsNavState){
            return <Redirect to="/admin/dashboard"></Redirect>
        }
        
    return (
        <>
        <div className="back-buttons">
             
         </div>
         <div className="travel-logs">
             <div className="title-wrapper">
                 <span className="title-text">Student Logs</span>
                 <span className="back-btn"  onClick={()=>{setLogsNavState(false)}}><IoArrowBackCircleSharp></IoArrowBackCircleSharp></span>
             </div>
           <div className="filters">
               <label>Filters</label>
             <DatePicker   
             selected={dateFilter}  
             onChange={date =>{
                    console.log(date);
                 setDateFilter(date);
             }
            } 
            className="date-picker bg1"
             />
                   <div className="input-wrapper">
                            <select className="bg1" name="Room" 
                            onChange={(room)=>{setSelectedRoom(room.target.value)}}
                            >
                            <option>Select room</option>
                            {
                                rooms.map(room => {
                                    return <option value={room.room} key={room._id}>{room.room}</option>
                                })
                            }
                            </select>
                        </div>
             </div>
             <div className="all-reports">
                 <ul className="travel-log-lists admin-logs">
                 { 
                     travelLogs.map((log,index)=>{
                         return <TravelLogList log={log}  key={index}></TravelLogList>
                     })
                      
                 }      
                 </ul>
             </div>
         </div>
         </>
    );
}



function TravelLogList({ log,user,setLastReported}) {

    return (
        <li className="admin-logs-list">
            <details className="admin-log-list"> 
            <summary className="report-summary">{log.name}</summary>
            <span className="summary-text time ok-text">{"User ID : " + log.userId}</span><br/>
            <span className="summary-text time ok-text">{"Contact #: " + log.mobileNumber}</span><br/>
           <span className="summary-text time ok-text">{`${log.day}, ${log.time}, ${log.month} - ${log.location}`}</span>
           </details>
        </li>
    
        
    )
}
export default Logs;