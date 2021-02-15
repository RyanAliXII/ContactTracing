import React, { useState, useRef, useEffect } from 'react';
import HeroImg from '../../Assets/images/social_distance.svg'
import {Redirect} from 'react-router-dom'
import axios from 'axios'


function AdminDashboard() {


    const [roomFormClass, setRoomFormClass] = useState('form-wrapper fixed-pos default-bg hide')
    const [scannerFormClass, setScannerFormClass] = useState('form-wrapper fixed-pos default-bg hide')


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
        console.log(scannerFormData)
    }
   
    async function createRoom(){
        const {data}  = await  axios.post('http://localhost:5000/room/createroom',{room:roomFormData})
        setLastAddedRoom(roomFormData);
        closeCreateRoomForm()

    }
    useEffect(() => {

        async function fetchRooms(){
            const {data} = await axios.get('http://localhost:5000/room/fetchrooms')
            setRooms(data);
        }
        fetchRooms();
    },[lastAddedRoom])

    async function createScannerAccount(event){
        event.preventDefault();
        const {data} = await axios.post('http://localhost:5000/room/signup',scannerFormData);
        console.log(data)     
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
                    <div className="menu-selection bg1">
                        <span>View Users</span>
                    </div>
                    <div className="menu-selection bg1">
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
                <form className="form-form org-form">
                    <div className="input-wrapper org-input-wrapper">
                        <label className="" htmlFor="org">Room Name</label>
                        <input type="name"
                            className="input signin-input bg1"
                            name="room"
                            onChange={handleOrgFormData}
                            required></input>
                    </div>
                    <div className="btn-wrapper org-btn-wrapper">

                        <button type="button"
                            className="btn bl-bg default-clr"
                            onClick={createRoom}>Create</button>

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
                            onChange={handleScannerFormData}>
                            <option value="">Select Organization</option>
                            {
                                rooms.map(room => {
                                    return <option value={room.room} key={room._id}>{room.room}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="btn-wrapper org-btn-wrapper">
                        <button type="submit" className="btn bl-bg default-clr">Create</button>
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