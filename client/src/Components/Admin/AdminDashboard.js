import React, { useState, useRef, useEffect,useContext } from 'react';
import HeroImg from '../../Assets/images/social_distance.svg'
import {Redirect} from 'react-router-dom'
import {AuthContext} from '../../Contexts/AuthContext'
import {ReportsNavigationContext} from '../../Contexts/ReportNavigationContext'
import {LogsNavigationContext} from '../../Contexts/LogsNavigationContext'
import axios from 'axios'
import cors from '../../cors'

function AdminDashboard({setLoadingClass}) {


    const [roomFormClass, setRoomFormClass] = useState('form-wrapper fixed-pos default-bg hide')
    const [scannerFormClass, setScannerFormClass] = useState('form-wrapper fixed-pos default-bg hide')
    const [session,fetchSession] = useContext(AuthContext);
    const [reportsNavState,setReportsNavState] = useContext(ReportsNavigationContext);
    const [logsNavState,setLogsNavState] = useContext(LogsNavigationContext)
    const [roomFormData, setRoomFormData] = useState('');
    const [scannerFormData, setScannerFormData] = useState({});


    const [rooms, setRooms] = useState([]);
    const [lastAddedRoom, setLastAddedRoom] = useState('');

    const dashboardRef = useRef()

    function openCreateRoomForm() {
        setRoomFormClass('form-wrapper fixed-pos default-bg')
        addOpacity()
    }
    function closeCreateRoomForm() {
        setRoomFormClass('form-wrapper fixed-pos default-bg hide')
        removeOpacity()
    }
    function openScannerForm() {
        setScannerFormClass('form-wrapper fixed-pos default-bg add-height')
        addOpacity()
    }
    function closeScannerForm() {
        setScannerFormClass('form-wrapper fixed-pos default-bg hide add-height')
        removeOpacity()
    }
    function addOpacity() {
        dashboardRef.current.style.opacity = '0.2';
    }
    function removeOpacity() {
        dashboardRef.current.style.opacity = '1';
    }
    function handleOrgFormData(event) {
        setRoomFormData(event.target.value);

    }
    function handleScannerFormData(event) {
        const { name, value } = event.target;
        setScannerFormData(prevState => ({
            ...prevState, [name]: value
        }));
       
    }
    async function createRoom(event){
        event.preventDefault();
        setLoadingClass('loading-wrapper')
        const {data}  = await  axios.post(`${cors.domain}/room/createroom`,{room:roomFormData})
        if(data === "OK"){
            setLastAddedRoom(roomFormData);
            closeCreateRoomForm()  
            
        }

        setLoadingClass('hide')
        

    }
    useEffect(() => {
        let isMount = true;
        async function fetchRooms(){
            const {data} = await axios.get(`${cors.domain}/room/fetchrooms`)
            if(isMount){
            setRooms(data);
            }
        }
        fetchRooms();
        return ()=>{
            isMount = false;
        }
    },[lastAddedRoom])

    async function createScannerAccount(event){
        event.preventDefault();
        const {data} = await axios.post(`${cors.domain}/room/signup`,scannerFormData);
        closeScannerForm();
          
    }
    useEffect(() => {
    },[session])

    if(reportsNavState){
        return <Redirect to='/admin/reports'/>
    }
    if(logsNavState){
        return <Redirect to='/admin/logs'/>
    }
   
    return (
        JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role === "Admin"  ? (
        <>
            <div className="dashboard" ref={dashboardRef}>
                <div className="hero">
                    <div className="hero-text">
                        <span className="text">Welcome <br /> Admin</span>
                    </div>
                    <div className="hero-image">
                        <img src={HeroImg} alt="social_distance"></img>
                    </div>
                </div>
                <div className="db-menu">
                    <div className="menu-selection bg1" onClick={()=>{setReportsNavState(true)}}>
                        <span>View Reports</span>
                    </div>
                    <div className="menu-selection bg1" onClick={()=>{setLogsNavState(true)}}>
                        <span>View Logs</span>
                    </div>
                    <div className="menu-selection bg1" onClick={openCreateRoomForm}>
                        <span>Add Room</span>
                    </div>
                    <div className="menu-selection bg1" onClick={openScannerForm}>
                        <span>Scanner Account</span>
                    </div>
                </div>

            </div>
            <div className={roomFormClass}>
                <div className="form-title org-form-title">
                    <span>Create Room</span></div>
                <form className="form-form org-form" onSubmit={createRoom}>
                    <div className="input-wrapper org-input-wrapper">
                        <label className="" htmlFor="org">Room Name</label>
                        <input type="name"
                            className="input signin-input bg1"
                            name="room"
                            onChange={handleOrgFormData}
                            required></input>
                    </div>
                    <div className="btn-wrapper org-btn-wrapper">

                        <button type="submit"
                            className="btn blue-bg default-clr"
                            >Create</button>

                        <button type="button"
                            className="btn bg1"
                            onClick={closeCreateRoomForm}>Cancel</button>
                    </div>

                </form>
            </div>
            <div className={scannerFormClass}>
                <div className="form-title org-form-title">
                    <span>Create Scanner Account</span></div>
                <form className="form-form org-form" onSubmit={createScannerAccount}>
                    <div className="input-wrapper org-input-wrapper">
                        <label className="" htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="input signin-input bg1"
                            name="username"
                            onChange={handleScannerFormData}
                            required></input>
                    </div>
                    <div className="input-wrapper org-input-wrapper">
                        <label className="" htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="input signin-input bg1"
                            name="password"
                            onChange={handleScannerFormData}
                            required></input>
                    </div>
                    <div className="input-wrapper org-input-wrapper">
                        <label className="" htmlFor="org">Room</label>
                        <select className="bg1"
                            name="room"
                            onChange={handleScannerFormData}
                            required
                            >
                            <option value="">Select Organization</option>
                            {
                                rooms.map(room => {
                                    return <option value={room.room} key={room._id}>{room.room}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="btn-wrapper org-btn-wrapper">
                        <button type="submit" className="btn blue-bg default-clr">Create</button>
                        <button type="button"
                            className="btn bg1"
                            onClick={closeScannerForm}>Cancel</button>
                    </div>

                </form>
            </div>
        </>
        ) : (<Redirect to="/"></Redirect>)
    );
}

export default AdminDashboard;