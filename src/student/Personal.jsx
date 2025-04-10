import React, { useState, useEffect, use } from "react";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";
import Swal from "sweetalert2";


export default function Personal() {

    const handleDisabilityChange = (e) => {
        const value = e.target.value;
        if (value === "No") {
            setDisabilityDetails(" ");
            setDisabilityCategory("None");
        }

        setIsDisabled(value === "No");

        updateUserDetails({ email: user.email, disabilityDetails: " ", disabilityCategory: "None" });
    };

    const updateUserDetails = (updatedDetails) => {
        console.log("Sending update to backend:", updatedDetails);

        fetch('/api/updateUserDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDetails),
        })
            .then(response => response.json())
            .then(data => {
                console.log('User details updated:', data);
            })
            .catch(error => {
                console.error('Error updating user details:', error);
            });
    };

    const [isDisabled, setIsDisabled] = useState(true);

    const [fillSection, setFillSection] = useState("personal");
    const { user, setUser } = useAdmin()

    const [regionsData, setRegionsData] = useState([]);
    const [provincesData, setProvincesData] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const [barangaysData, setBarangaysData] = useState([]);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get('https://psgc.rootscratch.com/region');
                console.log("Fetched Regions:", response.data);
                if (response.data && Array.isArray(response.data)) {
                    setRegionsData(response.data);
                } else {
                    console.error('Regions data is not an array or missing:', response.data);
                }
            } catch (error) {
                console.error('Error fetching regions data:', error);
            }
        };
        fetchRegions();
    }, []);

    const handleRegionChange = async (e) => {
        const selectedRegion = e.target.value;
        setRegion(selectedRegion);
        setProvince('');
        setCity('');
        setBarangay('');
        setProvincesData([]);
        setCitiesData([]);
        setBarangaysData([]);

        console.log('Region selected:', selectedRegion);

        if (selectedRegion) {
            try {

                const response = await axios.get(`https://psgc.rootscratch.com/province?id=${selectedRegion}`);
                console.log("Fetched Provinces:", response.data);
                if (response.data && Array.isArray(response.data)) {
                    setProvincesData(response.data);
                } else {
                    console.error('Provinces data is not an array or missing:', response.data);
                }
            } catch (error) {
                console.error('Error fetching provinces data:', error);
            }
        }
    };

    const handleProvinceChange = async (e) => {
        const selectedProvince = e.target.value;
        setProvince(selectedProvince);
        setCity('');
        setBarangay('');
        setCitiesData([]);
        setBarangaysData([]);

        console.log('Province selected:', selectedProvince);

        if (selectedProvince) {
            try {

                const response = await axios.get(`https://psgc.rootscratch.com/municipal-city?id=${selectedProvince}`);
                console.log("Fetched Cities:", response.data);
                if (response.data && Array.isArray(response.data)) {
                    setCitiesData(response.data);
                } else {
                    console.error('Cities data is not an array or missing:', response.data);
                }
            } catch (error) {
                console.error('Error fetching cities data:', error);
            }
        }
    };

    const handleCityChange = async (e) => {
        const selectedCity = e.target.value;
        setCity(selectedCity);
        setBarangay('');
        setBarangaysData([]);

        console.log('City selected:', selectedCity);

        if (selectedCity) {
            try {
                const response = await axios.get(`https://psgc.rootscratch.com/barangay?id=${selectedCity}`);
                console.log("Fetched Barangays:", response.data);
                if (response.data && Array.isArray(response.data)) {
                    setBarangaysData(response.data);
                } else {
                    console.error('Barangays data is not an array or missing:', response.data);
                }
            } catch (error) {
                console.error('Error fetching barangays data:', error);
            }
        }
    };

    const handleBarangayChange = (e) => {
        setBarangay(e.target.value);
        console.log('Barangay selected:', e.target.value);
    };

    //FILLUP FORM
    const [phone, setPhone] = useState(user?.phone || "");
    const [middlename, setMiddlename] = useState(user?.middlename || "");
    const [extension, setExtension] = useState(user?.extension || "");
    const [birthplace, setBirthplace] = useState(user?.birthplace || "");
    const [civil, setCivil] = useState(user?.civil || "");
    const [sex, setSex] = useState(user?.sex || "");
    const [orientation, setOrientation] = useState(user?.orientation || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [citizenship, setCitizenship] = useState(user?.citizenship || "");
    const [religion, setReligion] = useState(user?.religion || "");
    const [region, setRegion] = useState(user?.region || "");
    const [province, setProvince] = useState(user?.province || "");
    const [city, setCity] = useState(user?.city || "");
    const [barangay, setBarangay] = useState(user?.barangay || "");
    const [disability, setDisability] = useState(user?.disability || "");
    const [disabilityCategory, setDisabilityCategory] = useState(user?.disabilityCategory || "");
    const [disabilityDetails, setDisabilityDetails] = useState(user?.disabilityDetails || "");

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.email) return;

            try {
                const response = await axios.get(`http://localhost:2025/get-profile?email=${user.email}`);
                const profileData = response.data;

                setPhone(profileData.phone || "");
                setMiddlename(profileData.middlename || "");
                setExtension(profileData.extension || "");
                setBirthplace(profileData.birthplace || "");
                setCivil(profileData.civil || "");
                setSex(profileData.sex || "");
                setOrientation(profileData.orientation || "");
                setGender(profileData.gender || "");
                setCitizenship(profileData.citizenship || "");
                setReligion(profileData.religion || "");
                setRegion(profileData.region || "");
                setProvince(profileData.province || "");
                setCity(profileData.city || "");
                setBarangay(profileData.barangay || "");
                setDisability(profileData.disability || "");
                setDisabilityCategory(profileData.disabilityCategory || "");
                setDisabilityDetails(profileData.disabilityDetails || "");
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [user.email]);

    const [formErrors, setFormErrors] = useState({
        birthplace: false,
        civil: false,
        sex: false,
        orientation: false,
        gender: false,
        citizenship: false,
        religion: false,
        region: false,
        province: false,
        city: false,
        barangay: false
    });

    const validateForm = () => {
        const errors = {};
        if (!birthplace) errors.birthplace = true;
        if (!civil) errors.civil = true;
        if (!sex) errors.sex = true;
        if (!orientation) errors.orientation = true;
        if (!gender) errors.gender = true;
        if (!citizenship) errors.citizenship = true;
        if (!religion) errors.religion = true;
        if (!region) errors.region = true;
        if (!province) errors.province = true;
        if (!city) errors.city = true;
        if (!barangay) errors.barangay = true;

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const isValid = validateForm();
        if (!isValid) {
            const missingFields = Object.keys(formErrors).filter(field => formErrors[field]);
            Swal.fire({
                title: 'Please fill up the following fields:',
                html: `<ul>${missingFields.map(field => `<li>${field}</li>`).join('')}</ul>`,
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (!user || !user.email) {
            alert("No user found!");
            return;
        }

        const updatedFields = {};
        if (phone) updatedFields.phone = phone;
        if (birthplace) updatedFields.birthplace = birthplace;
        if (civil) updatedFields.civil = civil;
        if (sex) updatedFields.sex = sex;
        if (orientation) updatedFields.orientation = orientation;
        if (gender) updatedFields.gender = gender;
        if (citizenship) updatedFields.citizenship = citizenship;
        if (religion) updatedFields.religion = religion;
        if (region) updatedFields.region = region;
        if (province) updatedFields.province = province;
        if (city) updatedFields.city = city;
        if (barangay) updatedFields.barangay = barangay;

        if (Object.keys(updatedFields).length === 0) {
            alert("No changes detected, but your profile will still be saved.");
        }

        try {
            const response = await axios.put("http://localhost:2025/update-profile", {
                email: user.email,
                ...updatedFields,
            });

            alert("Profile updated successfully!");
            console.log("Response:", response.data);


        } catch (error) {
            console.error("Error while updating profile:", error);
            if (error.response) {
                alert(`Backend error: ${error.response.data.error}`);
            } else {
                alert("Something went wrong!");
            }
        }
    };

    return (
        <div className={`persofom-container ${fillSection === "personal" ? "show" : ""}`}>
            <div className="persofom-grid">
                <div className="persofom-group email-phone-container">
                    <div className="persofom-group" style={{ marginRight: "15px" }} >
                        <label>Personal Email Address*</label>
                        <div className="persofom-input" style={{ color: "lightgrey" }}>{user?.email || ""}</div>
                    </div>
                    <div className="persofom-group" style={{ width: "60px" }}>
                        <label>Mobile Number*</label>
                        <input
                            type="text"
                            className="persofom-input"
                            value={user?.phone || extension || ''}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
                <div className="persofom-group name-container">
                    {/* First Name */}
                    <div className="persofom-group name">
                        <label>First Name*</label>
                        <div className="persofom-input-container">
                            <div className="persofom-input">{user?.firstname || ""}</div>
                            <i className="lock-icon fa fa-lock" title="This field is locked"></i>
                        </div>
                    </div>

                    {/* Middle Name */}
                    <div className="persofom-group name">
                        <label>Middle Name</label>
                        <input
                            className="persofom-input"
                            type="text"
                            value={middlename}
                            onChange={(e) => setMiddlename(e.target.value)}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="persofom-group name">
                        <label>Last Name*</label>
                        <div className="persofom-input-container">
                            <div className="persofom-input">{user?.lastname || ""}</div>
                            <i className="lock-icon fa fa-lock" title="This field is locked"></i>
                        </div>
                    </div>

                    {/* Extension Name */}
                    <div className="persofom-group ext">
                        <label>Ext Name</label>
                        <select
                            className="persofom-input"
                            value={extension || user?.extension || ''}
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                setExtension(selectedValue);
                                if (selectedValue === '') {
                                    setExtension('');
                                }
                            }}
                        >
                            <option value="" disabled hidden>Extension</option>
                            <option value=" ">None</option>
                            <option value="Sr">Sr</option>
                            <option value="Jr">Jr</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                            <option value="V">V</option>
                        </select>
                    </div>
                </div>
                <form onSubmit={handleUpdateProfile} className="persofom-grid">
                    <div className="persofom-group name" style={{ width: "10%", marginRight: "15px" }}>
                        <label>Birthdate*</label>
                        <div className="persofom-input-container">
                            <div className="persofom-input">{user?.birthdate || ""}</div>
                            <i className="lock-icon fa fa-lock" title="This field is locked"></i>
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: "15    %", marginRight: "12px" }}>
                        <label>Birth place*</label>
                        <div className="persofom-input-container">
                            <input
                                className={`persofom-input ${formErrors.birthplace ? 'error' : ''}`}
                                type="text"
                                value={birthplace}
                                onChange={(e) => setBirthplace(e.target.value)}
                                style={{ borderColor: formErrors.birthplace ? 'red' : '', fontSize: "15px" }}
                            />
                        </div>
                    </div>
                    <div className="persofom-group ext" style={{ width: "10%" }}>
                        <label>Civil Status</label>
                        <select
                            className={`persofom-input ${formErrors.civil ? 'error' : ''}`}
                            value={civil || user?.civil || ''}
                            onChange={(e) => setCivil(e.target.value)}
                        >
                            <option value="" disabled hidden>Select One</option>
                            <option>Single</option>
                            <option>Married</option>
                            <option>Widowed</option>
                            <option>Separated</option>
                        </select>
                    </div>

                    <div className="persofom-group ext" style={{ width: "10%" }}>
                        <label>Sex at Birth</label>
                        <select
                            className={`persofom-input ${formErrors.sex ? 'error' : ''}`}
                            value={sex || user?.sex || ''}
                            onChange={(e) => setSex(e.target.value)}
                        >
                            <option value="" disabled hidden>Select One</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div className="persofom-group ext" style={{ width: "20%" }}>
                        <label>Sexual Orientation*</label>
                        <select
                            className={`persofom-input ${formErrors.orientation ? 'error' : ''}`}
                            value={orientation || user?.orientation || ''}
                            onChange={(e) => setOrientation(e.target.value)}
                        >
                            <option value="" disabled hidden>Select One</option>
                            <option>Decline to Answer</option>
                            <option>Straight</option>
                            <option>Lesbian</option>
                            <option>Gay</option>
                            <option>Bisexual</option>
                            <option>Queer</option>
                            <option>Something Else</option>
                        </select>
                    </div>
                    <div className="persofom-group ext" style={{ width: "16%" }}>
                        <label>Gender Identity*</label>
                        <select
                            className={`persofom-input ${formErrors.gender ? 'error' : ''}`}
                            value={gender || user?.gender || ''}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="" disabled hidden>Select One</option>
                            <option>Male/Man</option>
                            <option>Female/Woman</option>
                            <option>Transmale/Transman</option>
                            <option>Transfemale/Transwomen</option>
                            <option>Something else</option>
                            <option>Decline to Answer</option>
                        </select>
                    </div>
                    <div className="persofom-group ext" style={{ width: "14%" }}>
                        <label>Citizenship*</label>
                        <select
                            className={`persofom-input ${formErrors.citizenship ? 'error' : ''}`}
                            value={citizenship || user?.citizenship || ''}
                            onChange={(e) => setCitizenship(e.target.value)}
                        >
                            <option value="" disabled hidden>Select Citizenship</option>
                            <option>Filipino</option>
                            <option>American</option>
                            <option>Chinese</option>
                            <option>Indian</option>
                            <option>Japanese </option>
                            <option>Korean</option>
                            <option>Others</option>
                        </select>
                    </div>
                    <div className="persofom-group name" style={{ width: "15%", marginRight: "12px" }}>
                        <label>Religion *</label>
                        <div className="persofom-input-container">
                            <input
                                className={`persofom-input ${formErrors.religion ? 'error' : ''}`}
                                value={religion}
                                onChange={(e) => setReligion(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="smalltitle">
                        <h2 style={{ fontSize: "12px", color: "green" }}>Current Address</h2>
                    </div>
                    <div className="persofom-group ext" style={{ width: "20%", marginTop: "-15px" }}>
                        <label>Region*</label>
                        <select
                            className={`persofom-input ${formErrors.region ? 'error' : ''}`}
                            value={region || user?.region || ''}
                            onChange={handleRegionChange}
                        >
                            <option value="">Select Region</option>
                            {regionsData.length > 0 ? (
                                regionsData.map(region => (
                                    <option key={region.psgc_id} value={region.psgc_id}>
                                        {region.name}
                                    </option>
                                ))
                            ) : (
                                <option>No regions available</option>
                            )}
                        </select>
                    </div>

                    {/* Province Dropdown */}
                    <div className="persofom-group ext" style={{ width: "20%", marginTop: "-15px" }}>
                        <label>Province*</label>
                        <select
                            className={`persofom-input ${formErrors.province ? 'error' : ''}`}
                            value={province || user?.province || ''}
                            onChange={handleProvinceChange}
                        >
                            <option value="">Select Province</option>
                            {provincesData.length > 0 ? (
                                provincesData.map(province => (
                                    <option key={province.psgc_id} value={province.psgc_id}>
                                        {province.name}
                                    </option>
                                ))
                            ) : (
                                <option>No provinces available</option>
                            )}
                        </select>
                    </div>

                    {/* City Dropdown */}
                    <div className="persofom-group ext" style={{ width: "20%", marginTop: "-15px" }}>
                        <label>City/Municipality*</label>
                        <select
                            className={`persofom-input ${formErrors.city ? 'error' : ''}`}
                            value={city || user?.city || ''}
                            onChange={handleCityChange}
                        >
                            <option value="">Select City</option>
                            {citiesData.length > 0 ? (
                                citiesData.map(city => (
                                    <option key={city.psgc_id} value={city.psgc_id}>
                                        {city.name}
                                    </option>
                                ))
                            ) : (
                                <option>No cities available</option>
                            )}
                        </select>
                    </div>

                    {/* Barangay Dropdown */}
                    <div className="persofom-group ext" style={{ width: "20%", marginTop: "-15px" }}>
                        <label>Barangay*</label>
                        <select
                            className={`persofom-input ${formErrors.barangay ? 'error' : ''}`}
                            value={barangay || user?.barangay || ''}
                            onChange={handleBarangayChange}
                        >
                            {barangaysData.length > 0 ? (
                                barangaysData.map(barangay => (
                                    <option key={barangay.psgc_id} value={barangay.psgc_id}>
                                        {barangay.name}
                                    </option>
                                ))
                            ) : (
                                <option>No barangays available</option>
                            )}
                        </select>
                    </div>
                </form>
            </div>

            <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
            <div className="smalltitle">
                <h2 style={{ fontSize: "12px", color: "green" }}>Personal Disability Information</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <div className="persofom-group ext" style={{ width: "25%" }}>
                        <label style={{ fontSize: "11px", color: "orange" }}>Disability person?</label>
                        <select
                            className="persofom-input"
                            onChange={(e) => handleDisabilityChange(e)}
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    <div className="persofom-group ext" style={{ width: "85%" }}>
                        <label style={{ fontSize: "11px" }}>Disability Category</label>
                        <select
                            className="persofom-input"
                            disabled={isDisabled}
                            value={disabilityCategory || user?.disabilityCategory || ''}
                            onChange={(e) => setDisabilityCategory(e.target.value)}
                        >
                            <option value="" disabled hidden>Select One</option>
                            <option>None</option>
                            <option>Physical Disability</option>
                            <option>Visual Disability</option>
                            <option>Deaf/Hard of Hearing</option>
                            <option>Learning Disability</option>
                            <option>Intellectual Disability</option>
                            <option>Psychosocial Disability</option>
                            <option>Mental Disability</option>
                            <option>Speech Impairment</option>
                            <option>Cancer</option>
                            <option>Rare Disease</option>
                        </select>
                    </div>
                </div>
                <div className="persofom-group name" style={{ width: "100%" }}>
                    <label style={{ fontSize: "11px" }}>Disability Details*</label>
                    <div className="persofom-input-container">
                        <textarea
                            className="persofom-input"
                            value={disabilityDetails || ''}
                            onChange={(e) => setDisabilityDetails(e.target.value)}
                            placeholder="Describe your disability here..."
                            disabled={isDisabled}
                            style={{ width: "100%", minHeight: "50px", resize: "vertical", fontSize: "11px" }}
                        />
                    </div>
                </div>
            </div>

            <div className="unibtn" style={{marginTop:"20px"}}>
                <button type="submit" onClick={handleUpdateProfile}>
                    <i className="fa-solid fa-download"></i> Save
                </button>
                
            </div>
        </div>
    )
}
