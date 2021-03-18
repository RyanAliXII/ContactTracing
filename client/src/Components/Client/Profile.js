import React, { useEffect, useContext, useState, useRef } from 'react';
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import {Redirect} from 'react-router-dom'
import { BiEdit } from 'react-icons/bi'
import { UserContext } from '../../Contexts/UserContext'
import { AuthContext } from '../../Contexts/AuthContext'
import axios from 'axios'
import {ProfileNavStateContext} from '../../Contexts/ProfileNavState'
import DefaultProfile from '../../Assets/images/user.svg'
import cors from '../../cors'

function showValid(inputs, messageTextRef) {
    const VALID = {
        OUTLINE: '2px solid #6BD382',
        DISPLAY: "NONE"
    }
    if (Array.isArray(inputs)) { //check if element is an array
        inputs.forEach(input => {
            input.style.outline = VALID.OUTLINE //MAKE EVERY <input> OUTLINE GREEN
        });
    }
    else {
        inputs.target.style.outline = VALID.OUTLINE
    }
    messageTextRef.current.style.display = VALID.DISPLAY // REMOVE ERROR MESSAGE
}

function showInvalid(inputs, messageTextRef) {
    const INVALID = {
        OUTLINE: '2px solid #db5248',
        DISPLAY: "inline"
    }
    if (Array.isArray(inputs)) {
        inputs.forEach(input => {
            input.style.outline = INVALID.OUTLINE //MAKE EVERY <input> OUTLINE RED
        });
    }
    else {
        inputs.target.style.outline = INVALID.OUTLINE
    }
    messageTextRef.current.style.display = INVALID.DISPLAY // DISPLAY ERROR MESSAGE
}
function Profile({setLoadingClass}) {

    const [user, setUser] = useContext(UserContext)
    const [session, fetchSession] = useContext(AuthContext)
    const [generalInfoModal, setGeneralInfoModal] = useState("hide max profile-modal");
    const [mobileInfoModal, setMobileInfoModal] = useState("hide max profile-modal modal-height")
    const [passwordInfoModal, setPasswordInfoModal] = useState("hide max profile-modal modal-height")
    const [profileNavState,setProfileNavState] = useContext(ProfileNavStateContext)
    const fileInputForm = useRef();



   async function fileInputListener(event){
      
     try{   
            setLoadingClass('loading-wrapper')
            let formData = new FormData();
            formData.append("profile",event.target.files[0]);
            if(event.target.files[0] != null || event.target.files != undefined){
                console.log("UPLOADING");
               const {data} = await axios.put(`${cors.domain}/client/profile/${user.id}`,formData,{    
                    headers:{
                        'content-type':'multipart/form-data'
                    },
                    withCredentials:true
                },);
                if(data === "OK"){
                    fetchSession(prevState => prevState + 1);
                }
             
            }
        }
            catch (error) {
                console.log(error)
            }
            finally{
                setLoadingClass('hide')
            }
              
    }

    if(!profileNavState){
        return <Redirect to="/dashboard"></Redirect>
    }
    return (
        JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role === "Client" ? (
        <div className="profile-wrapper">
         
            <div className="travel-logs profile">
                <div className="title-wrapper">
                    <span className="title-text">Profile</span>

                    <span className="back-btn blue-clr" onClick={()=>{setProfileNavState(false)}}><IoArrowBackCircleSharp></IoArrowBackCircleSharp></span>
                </div>
                <div className="user-details">

                    
                <div className="profile-picture">

                    <div className="profile-area">
                        <ProfilePicture user={user}></ProfilePicture>
                    </div>
                    <div className="upload-profile-picture">
                        <form ref={fileInputForm} encType="multipart/form-data" method="PUT">
                            <input type="file" id="profile-upload" name="profile" accept="image/png,image/jpeg" className="hide"  onChange={fileInputListener}>
                            </input>
                            <label htmlFor="profile-upload" className="profile-area-label">Update picture</label>
                        </form>
                    </div>
                    <div className="profile-area-name">
                        <span>{user.name}</span>
                    </div>
                
                </div>
                    <div className="general-info ex-bg">
                        <div>
                            <label>General</label>
                            <span className="big-text">{user.name}</span>
                            <div>
                                <span className="inline smol-text">{user.province + ", "}</span>
                                <span className="inline smol-text">{user.city}</span>
                            </div>
                            <span className="inline smol-text">{user.fullAddress}</span>
                        </div>
                        <div className="edit-wrapper">
                            <span className="inline " onClick={() => { setGeneralInfoModal('show max profile-modal') }}><BiEdit></BiEdit></span>
                        </div>
                    </div>
                    <div className="important-info ex-bg">
                        <div className="info-wrapper">
                            <label>Mobile #</label>
                            <span className="important big-text">
                                {user.mobileNumber}
                            </span>
                        </div>
                        <div className="edit-wrapper">
                            <span className="inline " onClick={() => {
                                setMobileInfoModal('show max profile-modal modal-height')
                            }}><BiEdit></BiEdit></span>
                        </div>
                    </div>
                    <div className="important-info ex-bg">
                        <div className="info-wrapper">
                            <label>Password</label>
                            <span className="important big-text">
                                Change Password
                            </span>
                        </div>
                        <div className="edit-wrapper">
                            <span className="inline" onClick={() => {
                                setPasswordInfoModal('show max profile-modal modal-height')
                            }}><BiEdit></BiEdit></span>
                        </div>
                    </div>
                </div>

            </div>

            <GeneralInfoModal Class={generalInfoModal} user={user} fetchSession={fetchSession} setGeneralInfoModal={setGeneralInfoModal}></GeneralInfoModal>
            <MobilePhoneModal user={user} fetchSession={fetchSession} mobileInfoModalClass={mobileInfoModal} setMobileInfoModal={setMobileInfoModal}></MobilePhoneModal>
            <PasswordModal user={user} Class={passwordInfoModal} setPasswordInfoModal={setPasswordInfoModal}></PasswordModal>
        </div>):(<Redirect to="/"/>)
    );
}


function GeneralInfoModal({ Class, setGeneralInfoModal, fetchSession, user }) {
    const [formData, setFormData] = useState(JSON.parse(localStorage.getItem('userId')));
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([])

    const citySelectBox = useRef();



    function handleFormData(data) {

        const { name, value } = data.target;
        setFormData(prevState => ({ ...prevState, [name]: value }))

    }
    async function submitUpdate(e) {
        e.preventDefault()
        const { data } = await axios.patch(`${cors.domain}/client/updategeneral`, formData, { withCredentials: true });
        hide();
        fetchSession(prevState => prevState + 1)
    }
    function hide() {
        setGeneralInfoModal('hide max profile-modal')
    }
    useEffect(() => {

        async function getProvinces() {
            const data = await axios.get(`${cors.domain}/philippines/provinces`)
            return data;
        }
        getProvinces().then(response => {
            setProvinces(response.data);
        })
    }, [])

    async function getCitiesByProvince(event) {

        let provinceName = event.target.value;
        async function getCities() {
            const response = await axios.get(`${cors.domain}/philippines/provinces/cities/${provinceName}`)
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
                        ref={citySelectBox}
                        name="city"
                        onChange={handleFormData}
                        required
                    >

                        {
                            cities.map((city, key) => {
                                return <option value={city.name + " City"} key={key}>{city.name + " City"}</option>
                            }
                            )
                        }
                    </select>
                </div>
                <div className="input-wrapper org-input-wrapper">
                    <label className="" htmlFor="address">Detailed address</label>
                    <textarea className="bg1" onChange={handleFormData}
                        name="fullAddress" required></textarea>
                </div>
                <div className="btn-wrapper org-btn-wrapper">
                    <button type="submit" className="btn blue-bg default-clr btn-font-size">Save</button>
                    <button type="button"
                        onClick={hide}
                        className="btn bg1 btn-font-size"
                    >Cancel</button>
                </div>

            </form>
        </div>

    )


}

function MobilePhoneModal({ user, fetchSession, setMobileInfoModal, mobileInfoModalClass }) {

    const [steps, setStep] = useState(1);
    const [isValidMobileNumber, setValidMobileNumber] = useState(false);
    const [newMobileNumber, setNewMobileNumber] = useState();
    const [code, setCode] = useState();
    const invalidMobileNumberErrorRef = useRef();
    const invalidCodeErrorRef = useRef();
    const codeTextBox = useRef();

    function hide() {
        setMobileInfoModal('show max profile-modal modal-height');
    }
    async function validateMobileNumber(event) {

        let mobileNumber = event.target.value;
        let mobileRegexPattern = "^(09|\\+639)\\d{9}$"
        if (mobileNumber.match(mobileRegexPattern)) {
            setValidMobileNumber(true);
            showValid(event, invalidMobileNumberErrorRef)
            const response = await axios.post(`${cors.domain}/validateMobileNumberIfTaken`, { mobileNumber: mobileNumber })
            if (response.data) {
                showInvalid(event, invalidMobileNumberErrorRef)
            }

        }
        else {

            setValidMobileNumber(false)
            showInvalid(event, invalidMobileNumberErrorRef)
            if (event.target.value.length > 11) {
                let concatenatedMobileNumber = event.target.value.substring(0, 11);
                event.target.value = concatenatedMobileNumber;

            }

        }
    }

    function handleMobileNumber(event) {
        setNewMobileNumber(event.target.value);
    }
    function handleCode(event) {
        setCode(event.target.value)
    }


    async function submitNewMobileNumber() {

        if (isValidMobileNumber) {
           
            const { data } = await axios.post(`${cors.domain}/createVerification`, { mobileNumber: newMobileNumber });
           
            setStep(prevState => prevState + 1)

        }

    }
    function showInvalid_LOCAL(inputs, messageTextRef) {
        const INVALID = {
            OUTLINE: '2px solid #db5248',
            DISPLAY: "inline"
        }
        if (Array.isArray(inputs)) {
            inputs.forEach(input => {
                input.style.outline = INVALID.OUTLINE //MAKE EVERY ELEMENT OUTLINE RED
            });
        }
        else {
            inputs.style.outline = INVALID.OUTLINE
        }
        messageTextRef.current.style.display = INVALID.DISPLAY // DISPLAY ERROR MESSAGE
    }
    async function submitCode(event) {
        event.preventDefault()
        axios.post(`${cors.domain}/verify`, { code: code, mobileNumber: newMobileNumber }).then(async (resp) => {
            if (resp.data === "VERIFIED") {
                const { data } = await axios.put(`${cors.domain}/client/newmobile`, { id: user.id, mobileNumber: newMobileNumber }, { withCredentials: true })
                fetchSession(prevState => prevState + 1)
                hide()
            }
            else {
                showInvalid_LOCAL(codeTextBox.current, invalidCodeErrorRef);
            }
        });

    }
    function validateLengthOfCode(event) {
        let enteredCode = event.target;
        if (enteredCode.value.length > 6) {
            enteredCode.value = enteredCode.value.substring(0, 6);
        }
    }
    function hide() {
        setMobileInfoModal('hide max profile-modal modal-height');
    }

    return (
        steps === 1 ? (
            <div className={mobileInfoModalClass}>
                <div className="form-title org-form-title">
                    <span>New Mobile Number</span></div>
                <form className="form-form org-form">
                    <div className="input-wrapper org-input-wrapper">
                        <label className="" htmlFor="name">Enter New Mobile Number</label>
                        <span className="error-message" ref={invalidMobileNumberErrorRef}>Invalid mobile number</span>
                        <input
                            type="number"
                            className="input signin-input bg1"
                            name="mobileNumber"
                            onChange={handleMobileNumber}
                            onInput={validateMobileNumber}
                            required></input>
                    </div>

                    <div className="btn-wrapper org-btn-wrapper">
                        <button type="button"
                            className="btn blue-bg default-clr btn-font-size"
                            onClick={submitNewMobileNumber}
                        >Next</button>
                        <button type="button"
                            className="btn bg1 btn-font-size"
                            onClick={hide}
                        >Cancel</button>
                    </div>

                </form>
            </div>) : (

                <div className={mobileInfoModalClass}>
                    <div className="form-title org-form-title">
                        <span>Confirmation</span></div>
                    <form className="form-form org-form" onSubmit={submitCode}>
                        <div className="input-wrapper org-input-wrapper">
                            <span className="error-message" ref={invalidCodeErrorRef}>Invalid code</span>
                            <label className="" htmlFor="name">Enter 6 - Digit Code</label>
                            <input
                                type="number"
                                className="input signin-input bg1"
                                name="mobileNumber"
                                ref={codeTextBox}
                                onChange={handleCode}
                                onInput={validateLengthOfCode}
                                required></input>
                        </div>

                        <div className="btn-wrapper org-btn-wrapper">
                            <button type="submit" className="btn blue-bg default-clr btn-font-size">Confirm</button>
                            <button type="button"
                                className="btn bg1 btn-font-size"
                                onClick={hide}
                            >Cancel</button>
                        </div>

                    </form>
                </div>

            )

    )
}

function PasswordModal({ Class, setPasswordInfoModal, user }) {

    const [isValidPasswords, setValidPasswords] = useState({
        isOldPasswordCorrect: false,
        isNewPasswordValid: false
    });
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();


    const passwordIsWeakRef = useRef()
    const passwordNotSameRef = useRef();
    const incorrectOldPasswordRef = useRef();

    function hide() {
        setPasswordInfoModal('hide max profile-modal modal-height')
    }

    function validatePasswordLength(event) {
        const password = event.target.value;
        if (password.length >= 8) {
            showValid(event, passwordIsWeakRef);
            setValidPasswords(prevState => ({ ...prevState, isNewPasswordValid: true }))
        } else {
            showInvalid(event, passwordIsWeakRef);
            setValidPasswords(prevState => ({ ...prevState, isNewPasswordValid: false }))
        }
    }
    const newPasswordInputRef = useRef(); //password input, input element
    function validateIfPasswordsAreSame(event) {
        const confirmPasswordInput = event.target;
        let arrayOfPasswordInput = [confirmPasswordInput, newPasswordInputRef.current];

        if (newPasswordInputRef.current.value === confirmPasswordInput.value) {
            showValid(arrayOfPasswordInput, passwordNotSameRef);
            setValidPasswords(prevState => ({ ...prevState, isNewPasswordValid: true }))

        } else {
            showInvalid(arrayOfPasswordInput, passwordNotSameRef);
            setValidPasswords(prevState => ({ ...prevState, isNewPasswordValid: false }))
        }
    }

    async function CheckPasswordIsCorrect(event) {
        const { data } = await axios.post(`${cors.domain}/client/password`, { id: user.id, password: oldPassword })
        if (data === "OK") {
            setValidPasswords(prevState => ({ ...prevState, isOldPasswordCorrect: true }))
            showValid(event, incorrectOldPasswordRef)
        }
        else {
            setValidPasswords(prevState => ({ ...prevState, isOldPasswordCorrect: false }))
            showInvalid(event, incorrectOldPasswordRef)
        }
    }

    async function submitNewPassword(e) {
        e.preventDefault();
        if (isValidPasswords.isNewPasswordValid && isValidPasswords.isOldPasswordCorrect) {
            const { data } = await axios.post(`${cors.domain}/client/savepassword`, { id: user.id, password: newPassword })
            if(data === "OK") {
                hide();
            }
        }
    }

    return (
        
        <div className={Class}>
            <div className="form-title org-form-title">
                <span>Change Password</span></div>
            <form className="form-form org-form" onSubmit={submitNewPassword}>
                <div className="input-wrapper org-input-wrapper">
                    <span className="error-message" ref={incorrectOldPasswordRef}>Incorrect Password.</span>
                    <label className="" htmlFor="name">Old Password</label>
                    <input
                        type="password"
                        className="input signin-input bg1"
                        onChange={(e) => { setOldPassword(e.target.value) }}
                        onBlur={CheckPasswordIsCorrect}
                        name="old"
                        required></input>
                </div>
                <div className="input-wrapper org-input-wrapper">
                    <span className="error-message" ref={passwordIsWeakRef}>Password must be atleast 8 characters or longer.</span>
                    <span className="error-message" ref={passwordNotSameRef}>Passwords are not the same.</span>
                    <label className="" htmlFor="name">New Password</label>
                    <input
                        type="password"
                        className="input signin-input bg1"
                        name="newPassword"
                        onChange={(e) => { setNewPassword(e.target.value) }}
                        ref={newPasswordInputRef}
                        onInput={validatePasswordLength}
                        required></input>
                </div>
                <div className="input-wrapper org-input-wrapper">

                    <label className="" htmlFor="name">Confirm New Password</label>
                    <input
                        type="password"
                        className="input signin-input bg1"
                        name="confirmPass"
                        onInput={validateIfPasswordsAreSame}
                        required></input>
                </div>
                <div className="btn-wrapper org-btn-wrapper">
                    <button type="submit" className="btn blue-bg default-clr btn-font-size">Save</button>
                    <button type="button"
                        onClick={hide}
                        className="btn bg1 btn-font-size"
                    >Cancel</button>
                </div>

            </form>
        </div>
    )
}

function ProfilePicture({user}){
    if('id' in user.profilePicture){
       return  <img alt="profile-picture" src={user.profilePicture.url}></img>
    }
   else{
    return  <img alt="profile-picture" src={DefaultProfile}></img>
   }


}

export default Profile;