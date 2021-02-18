import React, { useEffect, useContext, useState, useReducer } from 'react';
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import { BiEdit } from 'react-icons/bi'
import { UserContext } from '../../Contexts/UserContext'
import { AuthContext } from '../../Contexts/AuthContext'
import axios from 'axios'
import session from 'express-session';

function Profile(props) {

    const [user, setUser] = useContext(UserContext)
    const [session, fetchSession] = useContext(AuthContext)
    const [generalInfoModal, setGeneralInfoModal] = useState("hide max profile-modal");
    
    useEffect(()=>{
        console.log(user)
    },[user])

    return (
        <div>
            <div className="back-buttons">

            </div>
            <div className="travel-logs">
                <div className="title-wrapper">
                    <span className="title-text">Profile</span>
                    <span className="back-btn"><IoArrowBackCircleSharp></IoArrowBackCircleSharp></span>
                </div>
                <div className="user-details">
                    <div className="general-info bg1">
                        <div>
                            <label>General</label>
                            <span>{user.name}</span>
                            <div>
                                <span className="inline">{user.province + ", "}</span>
                                <span className="inline">{user.city}</span>
                            </div>
                            <span>{user.fullAddress}</span>
                        </div>
                        <div className="edit-wrapper">
                            <span className="inline " onClick={()=>{setGeneralInfoModal('show max profile-modal')}}><BiEdit></BiEdit></span>
                        </div>
                    </div>
                    <div className="important-info bg1">
                        <div className="info-wrapper">
                            <label>Mobile #</label>
                            <span className="important">
                                {user.mobileNumber}
                            </span>
                        </div>
                        <div className="edit-wrapper">
                            <span className="inline "><BiEdit></BiEdit></span>
                        </div>
                    </div>
                    <div className="important-info bg1">
                        <div className="info-wrapper">
                            <label>Email</label>
                            <span className="important">
                                {user.email}
                            </span>
                        </div>
                        <div className="edit-wrapper">
                            <span className="inline "><BiEdit></BiEdit></span>
                        </div>
                    </div>
                </div>
                <div className="travel-logs-wrapper">


                </div>
            </div>
            <GeneralInfoModal Class={generalInfoModal} user={user} fetchSession={fetchSession} setGeneralInfoModal={setGeneralInfoModal}></GeneralInfoModal>
        </div>
    );
}


function GeneralInfoModal({ Class, setGeneralInfoModal,fetchSession,session}) {
    const [formData, setFormData] = useState(JSON.parse(localStorage.getItem('userId')));
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([])
    
    function handleFormData(data) {
      
        const { name, value } = data.target;
        setFormData(prevState => ({ ...prevState, [name]: value }))
        
    }
    async function submitUpdate(e){
        e.preventDefault()
        const {data}= await axios.patch('http://localhost:5000/client/updategeneral',formData,{withCredentials:true});
        hide();
        fetchSession(prevState => prevState + 1)
    }
    function hide(){
        setGeneralInfoModal('hide max profile-modal')
    }
    useEffect(() => {
        
        async function getProvinces() {
            const data = await axios.get('http://localhost:5000/philippines/provinces')
            return data;
        }
        getProvinces().then(response => {
            setProvinces(response.data);
        })
    }, [])

    async function getCitiesByProvince(event) {

        let provinceName = event.target.value;
        async function getCities() {
            const response = await axios.get(`http://localhost:5000/philippines/provinces/cities/${provinceName}`)
            setCities(response.data)
            handleFormData(event)
        }
        getCities();

    }
    return (

        <div className={Class}>
            <div className="form-title org-form-title">
                <span>Edit General Info</span></div>
            <form className="form-form org-form" onSubmit={submitUpdate}>
                <div className="input-wrapper org-input-wrapper">
                    <label className="" htmlFor="name">Fullname</label>
                    <input
                        type="name"
                        className="input signin-input bg1"
                        name="fullname"
                        onChange={handleFormData}
                        required></input>
                </div>

                <div className="input-wrapper org-input-wrapper">
                    <label className="" htmlFor="Province">Province</label>
                    <select className="bg1"
                        name="province"
                        onChange={getCitiesByProvince}
                        required
                    >
                        <option value="">Select Province</option>
                        {
                            provinces.map(province => {
                                return <option value={province.name} key={province.key}>{province.name}</option>
                            })
                        }

                    </select>
                </div>
                <div className="input-wrapper org-input-wrapper">
                    <label className="" htmlFor="Province">City</label>
                    <select className="bg1"
                        name="city"
                        onChange={handleFormData}
                        required
                        >
                        <option value="">Select City</option>
                        {
                            cities.map((city, key) => {
                                return <option value={city.name + " City"} key={key}>{city.name + " City"}</option>
                            }
                            )
                        }
                    </select>
                </div>
                <div className="input-wrapper org-input-wrapper">
                    <label className="" htmlFor="email">Detailed address</label>
                    <textarea className="bg1" onChange={handleFormData} name="fullAddress"></textarea>
                </div>
                <div className="btn-wrapper org-btn-wrapper">
                    <button type="submit" className="btn bl-bg default-clr btn-font-size">Save</button>
                    <button type="button"
                        onClick={hide}
                        className="btn bg1 btn-font-size"
                    >Cancel</button>
                </div>

            </form>
        </div>

    )


}

function MobilePhoneModal() {

}
function EmailModal() {

}
function PasswordModal(){
    
}
export default Profile;