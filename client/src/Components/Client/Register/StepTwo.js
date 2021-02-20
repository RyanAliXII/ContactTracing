import React, { useEffect, useState, useRef, } from 'react';
import axios from 'axios';
import cors from  '../../../cors'

function StepTwo({ handleFormData, formData, incrementSteps, showValid, showInvalid }) {

    const invalidMobileNumberErrorRef = useRef(); //span error message
    const mobileNumberTakenRef = useRef();// span error message
    const [isValidMobileNumber, setValidMobileNumber] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([])

    useEffect(() => {
        //fetch provinces and fill <Select> with <option> of provinces
        async function getProvinces() {
            const data = await axios.get(`${cors.domain}/philippines/provinces`)
            return data;
        }
        getProvinces().then(response => {
            setProvinces(response.data);
        })
    }, [])

    function getCitiesByProvince(event) {
        //if province is selected fill <Select> with <option> of cities
        let provinceName = event.target.value;
        async function getCities() {
            const response = await axios.get(`${cors.domain}/philippines/provinces/cities/${provinceName}`)
            setCities(response.data)
            handleFormData(event)
        }
        getCities();
    }

    async function validateMobileNumber(event) {
        let mobileNumber = event.target.value;
        let mobileRegexPattern = "^(09|\\+639)\\d{9}$"
        showValid(event, mobileNumberTakenRef)

        if (mobileNumber.match(mobileRegexPattern)) {
            showValid(event, invalidMobileNumberErrorRef)
            setValidMobileNumber(true);
            const response = await axios.post(`${cors.domain}/validateMobileNumberIfTaken`, { mobileNumber: mobileNumber })
            if (response.data) {
                showInvalid(event, mobileNumberTakenRef)
            }

        }
        else {
            showInvalid(event, invalidMobileNumberErrorRef)
            setValidMobileNumber(false)
            if (event.target.value.length > 11) {
                let concatenatedMobileNumber = event.target.value.substring(0, 11);
                event.target.value = concatenatedMobileNumber;
                setValidMobileNumber(true)
                showInvalid(event, invalidMobileNumberErrorRef);
            }

        }
    }

    async function proceedToStepThree(event) {
        event.preventDefault();
        if (isValidMobileNumber
            && isNotEmpty(formData.fullname)
            && isNotEmpty(formData.province)
            && isNotEmpty(formData.city)
            && isNotEmpty(formData.fullAddress)
        ) {
            const {data} = await axios.post(`${cors.domain}/createVerification`, { mobileNumber: formData.mobileNumber });
            console.log(data)
            incrementSteps()
        }
    }
    function isNotEmpty(someVar) {
        return someVar.length > 0 ? true : false;
    }

    return (
        <div>
            <div className="sign-up form-height">
                <ol className="steps">
                    <li className="stepOne">1. Account</li>
                    <li className="stepTwo blue-bg default-clr active">2. Information</li>
                    <li className="stepThree">3. Confirmation</li>
                </ol>
                <div className="form-wrapper">
                    <div className="form-title">
                        <span>Setup Personal Information</span></div>
                    <form className="form-form">
                        <div className="input-wrapper">
                            <label className="" htmlFor="email">Fullname</label>
                            <input type="name" onChange={handleFormData} className="input signin-input bg1" name="fullname" required></input>
                        </div>
                        <div className="input-wrapper">
                            <label className="" htmlFor="email">Mobile number</label>
                            <input type="number" className="input bg1" onInput={validateMobileNumber} onChange={handleFormData} name="mobileNumber" placeholder="09XX XXX XXXX"></input>
                            <span className="error-message" ref={mobileNumberTakenRef}>Mobile Number already taken</span>
                            <span className="error-message" ref={invalidMobileNumberErrorRef}>Invalid mobile number</span>
                        </div>
                        <div className="divider"></div>
                        <div className="input-wrapper">
                            <label className="" htmlFor="email">Province</label>
                            <select className="bg1" onChange={getCitiesByProvince} name="province">
                                <option value="">Select Province</option>
                                {
                                    provinces.map(province => {
                                        return <option value={province.name} key={province.key}>{province.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="input-wrapper">
                            <label className="" htmlFor="email">City</label>
                            <select className="bg1" onChange={handleFormData} name="city">
                                <option value="">Select City</option>
                                {
                                    cities.map((city, key) => {
                                        return <option value={city.name + " City"} key={key}>{city.name + " City"}</option>
                                    }
                                    )
                                }
                            </select>
                        </div>
                        <div className="input-wrapper">
                            <label className="" htmlFor="email">Detailed address</label>
                            <textarea className="bg1" onChange={handleFormData} name="fullAddress"></textarea>
                        </div>
                        <div className="btn-wrapper">
                            <button type="submit" className="btn blue-bg default-clr" onClick={proceedToStepThree}>Next</button>
                        </div>
                        <div className="btn-wrapper">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StepTwo;