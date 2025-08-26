import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Enrollees from "./Enrollees";
import Adminuser from "./Adminuser";
import Courses from "./Courses";
import Departments from "./Departments";
import StudentList from "./StudentList";
import BackupRestore from "./BackupRestore";

function Dashboard() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [activeSection, setActiveSection] = useState("dashboard");
    const navigate = useNavigate();
    const [createad, setCreatead] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        const fetchEnrolleesCount = async () => {
            try {
                const res = await axios.get("http://localhost:2025/api/enrollees");
                setNotifCount(res.data.length); 
            } catch (err) {
                console.error("Failed to fetch enrollees count:", err);
            }
        };

        fetchEnrolleesCount();

        const interval = setInterval(fetchEnrolleesCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = (event) => {
        event.preventDefault();
        console.log("Logging out...");

        localStorage.clear();
        sessionStorage.clear();

        setTimeout(() => {
            window.location.replace("/adminlogin");
        }, 500);
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
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                content: 'custom-content',
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout(event);
            }
        });
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, [])

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
                    <div className="adnav">
                        <img className="adlogo" src="./img/knshdlogo.png" style={{ height: "45px" }} alt="Logo" />
                        <div className="adnav-text">
                            <h1>Kolehiyo Ng Subic</h1>
                            <p>Management Information Systems Unit</p>
                        </div>
                        <div className="dropdown">
                            <button className="dropbtn">
                                <i className="fa-solid fa-user" style={{ fontSize: "12px" }}></i> Admin <span className="arrow">▼</span>
                            </button>
                            <div className="dropdown-content">
                                <a href="#"><i className="fa-solid fa-user"></i> Profile</a>
                                <a href="#"><i className="fa-solid fa-key"></i> Change Password</a>
                                <a href="#" onClick={handleLogoutClick}>
                                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                                </a>
                            </div>
                        </div>
                        <i className="fa-solid fa-bars menu-icon" onClick={() => setSidebarVisible(!sidebarVisible)}></i>
                    </div>

                    <div className={`adside ${sidebarVisible ? 'show' : 'hide'}`}>
                        <ul>
                            <li><a href="#" onClick={() => setActiveSection("dashboard")}> <i className="fa-solid fa-house"></i> Dashboard</a></li>
                            <ul>
                                <li>
                                    <a
                                        href="#"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        <i className="fa-solid fa-calendar"></i> Enrollees <i className="fa-solid fa-caret-down" style={{ marginLeft: "5px" }}></i>
                                    </a>
                                    {dropdownOpen && (
                                        <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
                                            <li>
                                                <a href="#" onClick={() => setActiveSection("enrollees")}>Pre Registered</a>
                                            </li>
                                            <li>
                                                <a href="#" onClick={() => setActiveSection("accepted")}>Enrollees</a>
                                            </li>
                                            <li>
                                                <a href="#" onClick={() => setActiveSection("pending")}>Pending Approval</a>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </ul>
                            <li><a href="#"> <i className="fa-solid fa-book"></i> Subjects</a></li>
                            <li><a href="#" onClick={() => setActiveSection("departments")}><i className="fa-solid fa-building"></i> Department</a></li>
                            <li><a href="#" onClick={() => setActiveSection("courses")}> <i className="fa-solid fa-calendar"> </i> Courses</a></li>
                            <li><a href="#"> <i className="fa-solid fa-graduation-cap"></i> Schedule</a></li>
                            <li><a href="#" onClick={() => setActiveSection("studentlist")}> <i className="fa-solid fa-users"></i> Students</a></li>
                            <li><a href="#"> <i className="fa-solid fa-users"></i> Instructor</a></li>
                            <li><a href="#"> <i className="fa-solid fa-gear"></i> Set Semester</a></li>
                            <li><a href="#"> <i className="fa-solid fa-credit-card"></i> Classroom Utilization</a></li>
                            <li><a href="#"> <i className="fa-solid fa-file"></i> Report</a></li>
                            <li><a href="#" onClick={() => setActiveSection("user")}> <i className="fa-solid fa-user"></i> User</a></li>
                            <li><a href="#" onClick={() => setActiveSection("backuprestore")}> <i className="fa-solid fa-users"></i> Backup and Restore</a></li>
                        </ul>
                    </div>

                    {/* Main Content Area */}
                    <div className={`admain ${sidebarVisible ? '' : 'expanded'}`} style={{ display: 'block' }}>
                        {activeSection === "dashboard" && (
                            <div>

                            </div>
                        )}

                        {activeSection === "enrollees" && (
                            <div className="">
                                <Enrollees />
                            </div>
                        )}

                        {activeSection === "departments" && (
                            <div className="">
                                <Departments />
                            </div>
                        )}

                        {activeSection === "courses" && (
                            <div className="">
                                <Courses />
                            </div>
                        )}

                        {activeSection === "studentlist" && (
                            <div className="">
                                <StudentList />
                            </div>
                        )}

                        {activeSection === "user" && (
                            <div className="">
                                <Adminuser />
                            </div>
                        )}

                        {activeSection === "backuprestore" && (
                            <div className="">
                                <BackupRestore />
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
