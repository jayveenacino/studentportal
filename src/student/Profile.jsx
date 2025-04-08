import React, { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import { useNavigate, Route } from "react-router-dom";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Profile() {

    const { user, setUser } = useAdmin()
    const [profilepfp, setProfilepfp] = useState(false);
    const [fillsection, setFillsection] = useState("data");
    const [fillSection, setFillSection] = useState("personal");
    const [isDisabled, setIsDisabled] = useState(true);


    const handleDisabilityChange = (event) => {
        setIsDisabled(event.target.value === "No");
    };



    //IMAGE  CONST
    const [image, setImage] = useState(null);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            Swal.fire({
                title: 'Error!',
                text: 'No file selected!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!image) {
            Swal.fire({
                title: 'Error!',
                text: 'Image is missing! Please select an image.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (!user.email) {
            Swal.fire({
                title: 'Error!',
                text: 'Email is missing! Please log in.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:2025/upload", {
                email: user.email,
                image
            });

            setUser(prev => ({ ...prev, image: response.data.student.image }));
            setProfilepfp(false);

            Swal.fire({
                title: 'Success!',
                text: 'Image uploaded successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error("Upload error:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || "Failed to upload image.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const email = localStorage.getItem("userEmail");
            if (!email) return;

            try {
                const res = await axios.get("http://localhost:2025/getuser", {
                    params: { email }
                });

                if (res.data && res.data.student) {
                    setUser(res.data.student);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    //REAGION PROVINCE CITY BARANGAY
    const [regionsData, setRegionsData] = useState([]);
    const [provincesData, setProvincesData] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const [barangaysData, setBarangaysData] = useState([]);

    // Fetch regions data from the PSGC API
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get('https://psgc.rootscratch.com/region');
                console.log("Fetched Regions:", response.data); // Log the response
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
    const [disability, setDisability] = useState(user?.disability || "No");
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
                setDisability(profileData.disability || "No");
                setDisabilityCategory(profileData.disabilityCategory || "");
                setDisabilityDetails(profileData.disabilityDetails || "");
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [user.email]);

    const handleUpdateProfile = async () => {
        if (!user || !user.email) {
            alert("No user found!");
            return;
        }

        const updatedFields = {};


        if (phone) updatedFields.phone = phone;
        if (middlename) updatedFields.middlename = middlename;
        if (extension) updatedFields.extension = extension;
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
        if (disability) updatedFields.disability = disability;
        if (disabilityCategory) updatedFields.disabilityCategory = disabilityCategory;
        if (disabilityDetails) updatedFields.disabilityDetails = disabilityDetails;
        if (Object.keys(updatedFields).length === 0) {
            alert("No changes detected.");
            return;
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
        <div>
            <div className="premaintab">
                <div className="prenavtab">
                    <h2>Profile</h2>
                    <p>View / Edit personal information</p>
                </div>
                <img src="public/img/knshdlogo.png" alt="Illustration" />
            </div>
            <div className="preprofile">
                <div className="preprofiledetails">
                    <div className="profile-image">
                        <img onClick={() => setProfilepfp(true)} src={user.image || "/img/prof.jpg"} alt="Profile" />
                        <p className="change-text" style={{ fontSize: "10px" }}>Click/tap to change image</p>
                    </div>
                    {profilepfp && (
                        <div className="preforgot">
                            <div className="forgotbg">
                                <h2 style={{ color: "#303030" }}>Upload your 2x2 Picture</h2>
                                <p style={{ color: "red", fontSize: "12px" }}>
                                    Upload your 2x2 picture with WHITE background. For seamless uploading, it is recommended that the file size should be 2MB (20800KB) or less. Valid formats are .png, .jpg/jpeg.
                                </p>
                                <hr />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                    {image && (
                                        <div style={{
                                            width: '150px',
                                            height: '150px',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>

                                <div className="button-container" style={{ marginTop: '20px' }}>
                                    <button style={{ border: "none" }} onClick={() => setProfilepfp(false)}>Cancel</button>
                                    <button
                                        onClick={handleUpload}
                                        style={{
                                            border: "1px solid #006666",
                                            background: "#006666",
                                            color: "white",
                                            padding: '10px 20px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="status-table" style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: "13px", width: '20%' }}><strong>Registration Number</strong></td>
                                <td style={{ fontSize: "13px" }}>{user?._id || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}><strong>Fullname</strong></td>
                                <td style={{ fontSize: "13px", textTransform: "uppercase" }}> {user?.lastname || ""}, {user?.firstname || ""}, {user?.middlename || ""} {user?.extension || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}><strong>College/Program</strong></td>
                                <td style={{ fontSize: "13px" }}>/</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}><strong>Email Address</strong></td>
                                <td style={{ fontSize: "13px" }}>{user?.email || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}><strong>Contact Number</strong></td>
                                <td style={{ fontSize: "13px" }}>+63 {user?.phone || ""}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="fulldetails">
                {/* Data Privacy Section */}
                <div className={`datafill ${fillsection === "data" ? "active" : ""}`} onClick={() => setFillsection("data")}>
                    <div className={`fillhead ${fillsection === "data" ? "active" : ""}`}>
                        <span className="step-icon">{fillsection === "data" ? <i className="fa-solid fa-lock"></i> : "1"}</span>
                        <h2 style={{ fontSize: "12px" }}>DATA PRIVACY STATEMENT</h2>
                    </div>

                    {fillsection === "data" && (
                        <div style={{ border: "none", background: "none", boxShadow: "none" }} className={`fillfield ${fillsection === "data" ? "show" : ""}`}>
                            <p style={{ fontSize: "14px" }}>I have read the Kolehiyo Ng Subic General Privacy Notice at
                                <Link to="notice" target='_blank'><strong style={{ fontStyle: "italic", textDecoration: "underline", color: "green" }}>  @kolehiyongsubic01@gmail.com</strong> .  </Link>

                                By clicking the "Accept and Continue" button, I recognize the authority of the Kolehiyo Ng Subic
                                to process my personal and sensitive personal information, pursuant to the Kolehiyo Ng Subic General
                                Privacy Notice and applicable laws, and agree to the collection and use of information in accordance
                                with the policy stated.</p>
                            <hr style={{ background: "darkgrey" }} />
                            <div className="unibtn">
                                <button onClick={(e) => { e.stopPropagation(); setFillsection("personal"); }}>
                                    <i className="fa-solid fa-forward-step"></i> Accept and Continue
                                </button>
                            </div>
                            <hr style={{ background: "darkgrey" }} />
                        </div>
                    )}
                </div>

                {/* Personal Information Section */}
                <div className={`datafill ${fillsection === "personal" ? "active" : ""}`} onClick={() => setFillsection("personal")}>
                    <div className={`fillhead ${fillsection === "personal" ? "active" : ""}`}>
                        <span className="step-icon">{fillsection === "personal" ? <i className="fa-solid fa-pen"></i> : "2"}</span>
                        <h2 style={{ fontSize: "12px" }}>PERSONAL INFORMATION</h2>
                    </div>
                    {fillsection === "personal" && (
                        <div className={`persofom-container ${fillSection === "personal" ? "show" : ""}`}>
                            <div className="persofom-grid">
                                {/* Email and Phone Number on the same line */}
                                <div className="persofom-group email-phone-container">
                                    <div className="persofom-group" style={{ marginRight: "15px" }} >
                                        <label>Personal Email Address*</label>
                                        <div className="persofom-input" style={{ color: "lightgrey" }}>{user?.email || ""}</div>
                                    </div>
                                    <div className="persofom-group" style={{ width: "60px" }}>
                                        <label>Mobile Number*</label>
                                        <input
                                            type="number"
                                            className="persofom-input"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* First Name, Middle Name, Last Name, and Extension */}
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
                                            className="persofom-input"
                                            type="text"
                                            value={birthplace}
                                            onChange={(e) => setBirthplace(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="persofom-group ext" style={{ width: "10%" }}>
                                    <label>Civil Status</label>
                                    <select
                                        className="persofom-input"
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
                                    <select className="persofom-input"
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
                                        className="persofom-input"
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
                                        <option>Horse</option>
                                    </select>
                                </div>
                                <div className="persofom-group ext" style={{ width: "16%" }}>
                                    <label>Gender Identity*</label>
                                    <select
                                        className="persofom-input"
                                        value={gender || user?.gender || ''}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="" disabled hidden>Select One</option>
                                        <option>Male/Man</option>
                                        <option>Female/Woman</option>
                                        <option>Transmale/Transman</option>
                                        <option>Transfemale/Transwomen</option>
                                        <option>Something else</option>
                                        <option>Decline to Answer   </option>
                                        <option>Baliw</option>
                                    </select>
                                </div>
                                <div className="persofom-group ext" style={{ width: "14%" }}>
                                    <label>Citizenship*</label>
                                    <select
                                        className="persofom-input"
                                        value={citizenship || user?.citizenship || ''}
                                        onChange={(e) => setCitizenship(e.target.value)}
                                    >
                                        <option value="" disabled hidden>Select Citizenship</option>
                                        <option>Filipino</option>
                                        <option>American</option>
                                        <option>Chinese</option>
                                        <option>Gernman Sheperd</option>
                                        <option>Indian</option>
                                        <option>Japanese </option>
                                        <option>Korean</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div className="persofom-group name" style={{ width: "15%", marginRight: "12px" }}>
                                    <label>Religion *</label>
                                    <div className="persofom-input-container">
                                        <input className="persofom-input" type="text"
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
                                        className="persofom-input"
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
                                        className="persofom-input"
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
                                        className="persofom-input"
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
                                        className="persofom-input"
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
                            </div>

                            <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
                            <div className="smalltitle">
                                <h2 style={{ fontSize: "12px", color: "green" }}>Personal Disability Information</h2>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {/* First row: Disability Selection & Category */}
                                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                    {/* Disability Selection */}
                                    <div className="persofom-group ext" style={{ width: "25%" }}>
                                        <label style={{ fontSize: "11px", color: "orange" }}>
                                            Disability person?
                                        </label>
                                        <select
                                            className="persofom-input"
                                            value={disability || user?.disability || ''}
                                            onChange={handleDisabilityChange}
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>


                                    {/* Disability Category */}
                                    <div className="persofom-group ext" style={{ width: "85%" }}>
                                        <label style={{ fontSize: "11px" }}>Disability Category</label>
                                        <select className="persofom-input" disabled={isDisabled}
                                            value={disabilityCategory || user?.disabilityCategory || ''}
                                            onChange={(e) => setDisabilityCategory(e.target.value)}
                                        >
                                            <option value="" disabled hidden>Select One</option>
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

                                {/* Second row: Disability Details */}
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
                            <hr style={{ background: "darkgrey" }} />
                            <div className="unibtn">
                                <button onClick={handleUpdateProfile}>
                                    <i className="fa-solid fa-forward-step"></i> Save and Proceed to Next Step
                                </button>
                            </div>
                            <hr style={{ background: "darkgrey" }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
