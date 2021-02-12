import React, { useState, useRef, useEffect } from 'react';
import HeroImg from '../../Assets/images/social_distance.svg'
import {Redirect} from 'react-router-dom'
import axios from 'axios'


function AdminDashboard({isAdminLoggedIn}) {


    const [orgFormClass, setOrgFormClass] = useState('form-wrapper fixed-pos default-bg hide')
    const [scannerFormClass, setScannerFormClass] = useState('form-wrapper fixed-pos default-bg hide')


    const [orgFormData, setOrgFormData] = useState('');
    const [scannerFormData, setScannerFormData] = useState({});

    const [orgs, setOrgs] = useState([]);
    const [lastAddedOrg, setLastAddedOrg] = useState('');

    const dashboardRef = useRef()

    function openCreateOrgForm() {
        setOrgFormClass('form-wrapper fixed-pos default-bg')
        addOpacity()
    }
    function closeCreateOrgForm() {
        setOrgFormClass('form-wrapper fixed-pos default-bg hide')
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
        setOrgFormData(event.target.value);

    }
    function handleScannerFormData(event) {
        const { name, value } = event.target;
        setScannerFormData(prevState => ({
            ...prevState, [name]: value
        }));
        console.log(scannerFormData)
    }
   
    
    useEffect(() => {
        let unmounted = false;
        async function fetchOrgs() {
            const { data } = await axios.get('http://localhost:5000/org/fetchorgs'); 
        if(!unmounted) {
            setOrgs(data);
        }
        
        }
        fetchOrgs();
       return ()=>{
           unmounted = true;
       }
    }, [lastAddedOrg])

    async function createScannerAccount(event) {
        event.preventDefault();
        const response = await axios.post('http://localhost:5000/org/signup', scannerFormData, { withCredentials: true })
        console.log(response)

    }

    async function createOrg() {
        const { data } = await axios.post("http://localhost:5000/org/createorg", { org: orgFormData }, { withCredentials: true });

        if (data === "OK") {
            console.log(data);
            setLastAddedOrg(orgFormData);
        }
        else {

        }
    }
    if(!isAdminLoggedIn){
      return  <Redirect to="/admin"/>
    }
    else{
    return (
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
                    <div className="menu-selection bg1" onClick={openCreateOrgForm}>
                        <span>Create Organization</span>
                    </div>
                    <div className="menu-selection bg1" onClick={openScannerForm}>
                        <span>Scanner Account</span>
                    </div>
                </div>

            </div>
            <div className={orgFormClass}>
                <div className="form-title org-form-title">
                    <span>Create Organization</span></div>
                <form className="form-form org-form">
                    <div className="input-wrapper org-input-wrapper">
                        <label className="" htmlFor="org">Organization Name</label>
                        <input type="name"
                            className="input signin-input bg1"
                            name="org"
                            onChange={handleOrgFormData}
                            required></input>
                    </div>
                    <div className="btn-wrapper org-btn-wrapper">

                        <button type="button"
                            className="btn bl-bg default-clr"
                            onClick={createOrg}>Create</button>

                        <button type="button"
                            className="btn bg1"
                            onClick={closeCreateOrgForm}>Cancel</button>
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
                        <label className="" htmlFor="org">Organization</label>
                        <select className="bg1"
                            name="org"
                            onChange={handleScannerFormData}>
                            <option value="">Select Organization</option>
                            {
                                orgs.map(org => {
                                    return <option value={org.org} key={org._id}>{org.org}</option>
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
    );
}
}

export default AdminDashboard;