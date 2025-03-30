import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Preregister() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [activeSection, setActiveSection] = useState("dashboard");
    const navigate = useNavigate();
    const [createad, setCreatead] = useState(false);
    const [enrollees, setEnrollees] = useState([]);
    const [students, setStudents] = useState({ firstname: "", middlename: "", lastname: "" });

    useEffect(() => {
        axios.get("http://localhost:2025/students") 
            .then(response => {
                console.log("Fetched user data:", response.data);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setStudents(response.data[0]);
                } else {
                    console.error("User data is empty or not in expected format");
                }
            })
            .catch(error => {
                console.error("Error fetching students:", error);
                Swal.fire("Error", "Failed to fetch student data. Please try again later.", "error"); 
            });
    }, []);

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => window.location.replace("/signup"), 500);
    };

    const handleLogoutClick = (event) => {
        event.stopPropagation();
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "No, Stay",
            width: '500px',
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout(event);
            }
        });
    };

    return (
        <div className="body">
            <div className="adcontainer">
                <div className="adnav">
                    <img className="adlogo" src="./img/knshdlogo.png" style={{ height: "45px" }} alt="Logo" />
                    <div className="adnav-text">
                        <h1>Kolehiyo Ng Subic</h1>
                        <p>Student Admission Portal</p>
                    </div>
                    <div className="dropdown">
                        <button className="dropbtn">
                            <i className="fa-solid fa-user" style={{ fontSize: "12px" }}></i>
                            {students?.firstname || ""} {students?.middlename || ""} {students?.lastname || ""} <span className="arrow">▼</span> {/* ✅ Fixed Undefined Student Data */}
                        </button>
                        <div className="dropdown-content">
                            <a href="#"><i className="fa-solid fa-user"></i> Profile</a>
                            <a href="#"><i className="fa-solid fa-key"></i> Change Password</a>
                            <a href="#" onClick={handleLogoutClick}><i className="fa-solid fa-right-from-bracket"></i> Logout</a>
                        </div>
                    </div>
                    <i className="fa-solid fa-bars menu-icon" onClick={() => setSidebarVisible(!sidebarVisible)}></i>
                </div>
                <div className={`adside ${sidebarVisible ? 'show' : 'hide'}`}>
                    <ul>
                        <li><a href="#" onClick={() => setActiveSection("dashboard")}><i className="fa-solid fa-hand"></i> Welcome</a></li>
                        <li><a href="#" onClick={() => setActiveSection("enrollees")}><i className="fa-solid fa-table-columns"></i> Dashboard</a></li>
                        <li><a href="#"><i className="fa-solid fa-user"></i> Profile</a></li>
                        <li><a href="#"><i className="fa-solid fa-upload"></i> Uploads</a></li>
                        <li><a href="#"><i className="fa-solid fa-triangle-exclamation"></i> Announcement</a></li>
                    </ul>
                </div>
                <div className={`admain ${sidebarVisible ? '' : 'expanded'}`} style={{ display: 'block' }}>
                    {activeSection === "dashboard" && (
                        <div>
                            <h2>Welcome to Student Admission Portal</h2>
                            <p>Thank you for choosing Kolehiyo Ng Subic as your educational destination.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
