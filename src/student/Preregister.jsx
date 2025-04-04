import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";

export default function Preregister() {
    const { user, setUser } = useAdmin()
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [activeSection, setActiveSection] = useState("welcome");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [forgot, setForgot] = useState(false);
    const [profilepfp, setProfilepfp] = useState(false);
    const [fillsection, setFillsection] = useState("data");
    const [fillSection, setFillSection] = useState("personal");

    const [isDisabled, setIsDisabled] = useState(true);

    const handleDisabilityChange = (event) => {
        setIsDisabled(event.target.value === "No");
    };
    //LOADING EFFECT

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, [])


    //LOGOUT LOCATION

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        setUser({});
        setTimeout(() => window.location.replace("/signup"), 500);
    };

    //LOGOUT CONST

    const handleLogoutClick = (event) => {
        event.stopPropagation();
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#808080",
            confirmButtonText: "Yes, Log me out",
            cancelButtonText: "Cancel",
            width: '500px',
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout(event);
            }
        });
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

    //REAGION 
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [barangay, setBarangay] = useState('');

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

    // Handle Region Change
    const handleRegionChange = async (e) => {
        const selectedRegion = e.target.value;
        setRegion(selectedRegion);
        setProvince(''); // Reset the province, city, and barangay when the region changes
        setCity('');
        setBarangay('');
        setProvincesData([]); // Reset provinces data
        setCitiesData([]); // Reset cities data
        setBarangaysData([]); // Reset barangays data

        console.log('Region selected:', selectedRegion);

        if (selectedRegion) {
            try {
                // Fetch provinces using the region's psgc_id
                const response = await axios.get(`https://psgc.rootscratch.com/province?id=${selectedRegion}`);
                console.log("Fetched Provinces:", response.data); // Log the response
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

    // Handle Province Change
    const handleProvinceChange = async (e) => {
        const selectedProvince = e.target.value;
        setProvince(selectedProvince);
        setCity('');
        setBarangay('');
        setCitiesData([]); // Reset cities data
        setBarangaysData([]); // Reset barangays data

        console.log('Province selected:', selectedProvince);

        if (selectedProvince) {
            try {
                // Fetch cities using the province's psgc_id
                const response = await axios.get(`https://psgc.rootscratch.com/municipal-city?id=${selectedProvince}`);
                console.log("Fetched Cities:", response.data); // Log the response
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

    // Handle City Change
    const handleCityChange = async (e) => {
        const selectedCity = e.target.value;
        setCity(selectedCity);
        setBarangay('');
        setBarangaysData([]); // Reset barangays data

        console.log('City selected:', selectedCity);

        if (selectedCity) {
            try {
                // Fetch barangays using the city's psgc_id
                const response = await axios.get(`https://psgc.rootscratch.com/barangay?id=${selectedCity}`);
                console.log("Fetched Barangays:", response.data); // Log the response
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

    // Handle Barangay Change
    const handleBarangayChange = (e) => {
        setBarangay(e.target.value);
        console.log('Barangay selected:', e.target.value);
    };



    return (
        <div className="body">
            {loading ? (
                <div className="loading-screen">
                    <div className="loading-content">
                        <img src="./img/loading.gif" alt="" />
                        <p>Loading... Please Wait</p>
                    </div>
                </div>
            ) : (
                <div className="adcontainer">
                    <div className="prenav">
                        <img className="adlogo" src="./img/knshdlogo.png" style={{ height: "45px" }} alt="Logo" />
                        <div className="prenav-text">
                            <h1>Kolehiyo Ng Subic</h1>
                            <p>Student Admission Portal v.0.3</p>
                        </div>
                        <div className="dropdown">
                            <button className="dropbtn">
                                <i className="fa-solid fa-user" style={{ fontSize: "12px" }}></i>
                                {user?.firstname || ""} {user?.middlename || ""} {user?.lastname || ""} <span className="arrow">▼</span>
                            </button>
                            <div className="dropdown-content">
                                <a href="#" onClick={() => setForgot(true)}><i className="fa-solid fa-key"></i> Change Password</a>
                                <a href="#" onClick={handleLogoutClick}><i className="fa-solid fa-right-from-bracket"></i> Logout</a>
                            </div>
                        </div>
                        <i className="fa-solid fa-bars menu-icon" onClick={() => setSidebarVisible(!sidebarVisible)}></i>

                        {forgot && (
                            <div className="preforgot">
                                <div className="forgotbg">
                                    <h2 style={{ color: "#303030" }}>Change Password</h2>
                                    <p style={{ color: "#303030" }}>To change your password, please enter your current password followed by your new password.</p>
                                    <hr />
                                    <input type="password" placeholder="Current Password*" />
                                    <input type="password" placeholder="New Password*" />
                                    <input type="password" placeholder="Confirm Password*" />
                                    <div className="button-container">
                                        <button style={{ border: "none" }} onClick={() => setForgot(false)}>Cancel</button>
                                        <button style={{ border: "1px solid #006666", background: "#006666", color: "white" }}>Update Password</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                    <div className={`preside ${sidebarVisible ? 'show' : 'hide'}`}>
                        <ul>
                            <li><a href="#" onClick={() => setActiveSection("welcome")}><i className="fa-solid fa-hand"></i> Welcome</a></li>
                            <li><a href="#" onClick={() => setActiveSection("dashboard")}><i className="fa-solid fa-table-columns"></i> Dashboard</a></li>
                            <li><a href="#" onClick={() => setActiveSection("profile")}><i className="fa-solid fa-user"></i> Profile</a></li>
                            <li><a href="#" onClick={() => setActiveSection("upload")}><i className="fa-solid fa-upload"></i> Uploads</a></li>
                            <li><a href="#" onClick={() => setActiveSection("announcement")}><i className="fa-solid fa-triangle-exclamation"></i> Announcement</a></li>
                        </ul>
                    </div>

                    <div className={`premain ${sidebarVisible ? '' : 'expanded'}`} style={{ display: 'block' }}>
                        {activeSection === "welcome" && (
                            <div>
                                <div className="premaintab">
                                    <div className="prenavtab">
                                        <h2>Kolehiyo Ng Subic Student Admission Portal</h2>
                                        <p>Welcome, {user?.firstname || ""} {user?.middlename || ""} {user?.lastname || ""}</p>
                                    </div>
                                    <img src="public/img/knshdlogo.png" alt="Illustration" />
                                </div>
                                <div className="premainad">
                                    <div className="addatails">
                                        <h2>Welcome to the Kolehiyo Ng Subic Admission Portal</h2>
                                        <hr />
                                        <p>Thank you for choosing Kolehiyo Ng Subic as your educational destination. We're excited to guide you through the admission process!</p>
                                        <p>Here, you can submit your application, track your progress, and receive important updates regarding your interview and admission status</p>
                                        <p style={{ fontWeight: "bold" }}>To get Started :</p>
                                        <p> • Complete your application form with accurate details.</p>
                                        <p> • Make sure to upload the required documents. Please take note that <strong>uploading of false documents and/or blank or incorrect documents is strictly prohibited</strong>  and will be subject to the <strong>immediate deletion of your account</strong> </p>
                                        <p> • Keep track of important deadlines and communications through the <strong>Dashboard section</strong>  of this portal.</p>
                                        <p> • You have 10 working days upon registration to accomplish all of the required documents otherwise your account will be moved to the archived list. </p>
                                        <p>If you have any questions or need assistance, our Admission Team is here to help! Feel free to reach out to us at
                                            <br />
                                            <strong style={{ fontSize: "14px", color: "darkgreen" }}>@kolehiyongsubic01@gmail.com</strong>
                                        </p>
                                        <p>
                                            We look forward to welcoming you to the Kolehiyo ng Subic family and wish you the best luck with your application
                                        </p>
                                    </div>
                                    <div className="admissionsum">
                                        <h2>Admission Applicant Summary</h2>
                                        <hr />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === "dashboard" && (
                            <div>
                                <div className="premaintab">
                                    <div className="prenavtab">
                                        <h2>Dashboard</h2>
                                        <p>View metrics and other information</p>
                                    </div>
                                    <img src="public/img/knshdlogo.png" alt="Illustration" />
                                </div>
                                <div className="predash">
                                    <div className="predashtab">
                                        <h2>Admission Status</h2>
                                        <hr />
                                        <table className="status-table" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th colSpan="2" style={{ width: '50%' }}>Choices</th>
                                                    <th style={{ width: '50%' }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>First Choice:</td>
                                                    <td style={{ width: "35%" }}></td>
                                                    <td>Profiling not yet done</td>
                                                </tr>
                                                <tr>
                                                    <td>Second Choice:</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="predashtab">

                                        <table className="status-table" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th colSpan="1" style={{ width: '10%' }}>Admission Status</th>
                                                    <th style={{ width: '50%' }}>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: "center" }}><strong>Not Specified</strong></td>
                                                    <td>You have not yet selected your program choices</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: "center" }}><strong>1st Choice</strong></td>
                                                    <td>Currently being reviewed in the program you specified as your first choice</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: "center" }}><strong>2nd Choice</strong></td>
                                                    <td>Currently being reviewed in the program you specified as your second choice</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: "center" }}><strong>Waiting List</strong></td>
                                                    <td>One or both of your KNSAT entrance exam scores are below the threshold required for automatic evaluation. After all automatic evaluations for review are finished, the evaluation of applicants on the waiting list will begin.</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: "center" }}><strong>NOT Accepted</strong></td>
                                                    <td>Somehow you've been denied admission in your chosen programs. Most common reason is that you have failed to pass the minimum requirement of the program.</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: "center" }}><strong>Confirmed</strong></td>
                                                    <td>You have confirmed admission in the program</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: "center" }}><strong>Declined</strong></td>
                                                    <td>You have declined admission in the program</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === "profile" && (
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
                                            <p className="change-text">Click/tap to change image</p>
                                        </div>

                                        {profilepfp && (
                                            <div className="preforgot">
                                                <div className="forgotbg">
                                                    <h2 style={{ color: "#303030" }}>Upload your 2x2 Picture</h2>
                                                    <p style={{ color: "red", fontSize: "12px" }}>
                                                        Upload your 2x2 picture with WHITE background. For seamless uploading, it is recommended that the file size should be 2MB (70KB) or less. Valid formats are .png, .jpg/jpeg.
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
                                            <thead>
                                                <tr>
                                                    <th colSpan="1" style={{ width: '10%', background: "grey" }}></th>
                                                    <th style={{ width: '50%', background: "grey" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ fontSize: "13px" }}><strong>Registration Number</strong></td>
                                                    <td style={{ fontSize: "13px" }}>{user?.studentNumber || ""}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ fontSize: "13px" }}><strong>Fullname</strong></td>
                                                    <td style={{ fontSize: "13px" }}>{user?.firstname || ""} {user?.middlename || ""} {user?.lastname || ""}</td>
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
                                                    <td style={{ fontSize: "13px" }}>{user?.phone || ""}</td>
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
                                                    <strong style={{ fontStyle: "italic", textDecoration: "underline", color: "green" }}> @kolehiyongsubic01@gmail.com</strong> .
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
                                                                type="text"
                                                                className="persofom-input"
                                                                placeholder="Enter mobile number"
                                                                value={user?.phone || ""}
                                                                readOnly
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
                                                            <div className="persofom-input">{user?.middlename || ""}</div>
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
                                                            <select className="persofom-input">
                                                                <option>None</option>
                                                                <option>Jr.</option>
                                                                <option>Sr.</option>
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
                                                            <input className="persofom-input" type="text" />
                                                        </div>
                                                    </div>
                                                    <div className="persofom-group ext" style={{ width: "10%" }}>
                                                        <label>Civil Satus</label>
                                                        <select className="persofom-input">
                                                            <option>Single</option>
                                                            <option>Married</option>
                                                            <option>Windowed</option>
                                                            <option>Seperated</option>
                                                        </select>
                                                    </div>
                                                    <div className="persofom-group ext" style={{ width: "10%" }}>
                                                        <label>Sex at Birth</label>
                                                        <select className="persofom-input">
                                                            <option>Male</option>
                                                            <option>Female</option>
                                                        </select>
                                                    </div>
                                                    <div className="persofom-group ext" style={{ width: "20%" }}>
                                                        <label>Sexual Orientation*</label>
                                                        <select className="persofom-input">
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
                                                        <select className="persofom-input">
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
                                                        <select className="persofom-input">
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
                                                            <input className="persofom-input" type="text" />
                                                        </div>
                                                    </div>
                                                    <div className="smalltitle">
                                                        <h2 style={{ fontSize: "12px" }}>Current Address</h2>
                                                    </div>
                                                    <div className="persofom-group ext" style={{ width: "20%", marginTop: "-15px" }}>
                                                        <label>Region*</label>
                                                        <select
                                                            className="persofom-input"
                                                            value={region}
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
                                                            value={province}
                                                            onChange={handleProvinceChange}
                                                            disabled={!region} // Disable until region is selected
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
                                                            value={city}
                                                            onChange={handleCityChange}
                                                            disabled={!province}
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
                                                            value={barangay}
                                                            onChange={handleBarangayChange}
                                                            disabled={!city}
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

                                                <hr />
                                                <div className="smalltitle">
                                                    <h2 style={{ fontSize: "12px" }}>Personal Disability Information</h2>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                                    {/* First row: Disability Selection & Category */}
                                                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                                        {/* Disability Selection */}
                                                        <div className="persofom-group ext" style={{ width: "25%" }}>
                                                            <label style={{ fontSize: "11px", color: "orange" }}>Disability person?</label>
                                                            <select className="persofom-input" onChange={handleDisabilityChange}>
                                                                <option value="No">No</option>
                                                                <option value="Yes">Yes</option>
                                                            </select>
                                                        </div>

                                                        {/* Disability Category */}
                                                        <div className="persofom-group ext" style={{ width: "85%" }}>
                                                            <label style={{ fontSize: "11px" }}>Disability Category</label>
                                                            <select className="persofom-input" disabled={isDisabled}>
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
                                                                placeholder="Describe your disability here..."
                                                                disabled={isDisabled}
                                                                style={{ width: "100%", minHeight: "50px", resize: "vertical", fontSize: "11px" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr style={{ background: "darkgrey" }} />
                                                <div className="unibtn">
                                                    <button onClick={(e) => { e.stopPropagation(); setFillsection("personal"); }}>
                                                        <i className="fa-solid fa-forward-step"></i> Save and Proceed to Next Step
                                                    </button>
                                                </div>
                                                <hr style={{ background: "darkgrey" }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}

                        {activeSection === "upload" && (
                            <div>
                                <div className="premaintab">
                                    <div className="prenavtab">
                                        <h2>Uploads</h2>
                                        <p>View/Change uploaded documents</p>
                                    </div>
                                    <img src="public/img/knshdlogo.png" alt="Illustration" />
                                </div>
                            </div>
                        )}

                        {activeSection === "announcement" && (
                            <div>
                                <div className="premaintab">
                                    <div className="prenavtab">
                                        <h2>Bulletin</h2>
                                        <p>Visual bulletin boards, reminders, and posted announcements</p>
                                    </div>
                                    <img src="public/img/knshdlogo.png" alt="Illustration" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )
            }

        </div >


    );
}
