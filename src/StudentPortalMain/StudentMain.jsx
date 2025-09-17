import React, { useState, useEffect } from "react";
import './studentmain.css/studentmain.css';

export default function Preregister() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [activeSection, setActiveSection] = useState("welcome");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) setSidebarVisible(false);
            else setSidebarVisible(true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleOverlayClick = () => {
        if (isMobile && sidebarVisible) setSidebarVisible(false);
    };

    return (
        <div className="stud-page-layout">
            {isMobile && sidebarVisible && (
                <div className="sidebar-overlay show" onClick={handleOverlayClick}></div>
            )}

            <div className="studmain-navbar">
                {isMobile && (
                    <i
                        className="fa-solid fa-bars stud-menu-toggle"
                        onClick={() => setSidebarVisible(!sidebarVisible)}
                    ></i>
                )}
                <div className="navbar-user stud-navbar-right">
                    <i className="fa-solid fa-user-circle"></i>
                    <span className="studentname"></span>
                    <i className="fa-solid fa-caret-down dropdown-icon"></i>
                </div>
            </div>

            <div className={`stud-sidebar university-style ${sidebarVisible ? 'show' : 'hide'}`}>
                <div className="stud-sidebar-header">
                    <img src="./img/knshdlogo.png" alt="Logo" draggable="false" />
                    <h2>Kolehiyo Ng Subic</h2>
                    <p>Student Information System</p>
                    <hr className="sidehr" />
                </div>
                <ul className="stud-sidebar-menu">
                    <li onClick={() => setActiveSection("welcome")}><i className="fa-solid fa-house"></i> Dashboard</li>
                    <li onClick={() => setActiveSection("dashboard")}><i className="fa-solid fa-id-card"></i> Profile/Enlistment</li>
                    <li onClick={() => setActiveSection("profile")}><i className="fa-solid fa-calendar-alt"></i> Schedule</li>
                    <li onClick={() => setActiveSection("upload")}><i className="fa-solid fa-upload"></i> E-Form</li>
                    <li onClick={() => setActiveSection("summary")}><i className="fa-solid fa-graduation-cap"></i> Summary of Grades</li>
                    <li onClick={() => setActiveSection("evaluation")}><i className="fa-solid fa-file-alt"></i> Academic Evaluation</li>
                    <li onClick={() => setActiveSection("term-grades")}><i className="fa-solid fa-chart-line"></i> Term Grades</li>
                    <li onClick={() => setActiveSection("faculty-eval")}><i className="fa-solid fa-chalkboard-teacher"></i> Faculty Evaluation</li>
                    <li onClick={() => setActiveSection("announcements")}><i className="fa-solid fa-bullhorn"></i> Announcements</li>
                </ul>
            </div>

            <div className="stud-main">
                <div className="stud-content">
                    {activeSection === "welcome" && <div><h1>Dashboard Content</h1><p>This is the dashboard section.</p></div>}
                    {activeSection === "dashboard" && <div><h1>Profile/Enlistment</h1><p>This is the profile/enlistment section.</p></div>}
                    {activeSection === "profile" && <div><h1>Schedule</h1><p>This is the schedule section.</p></div>}
                    {activeSection === "upload" && <div><h1>E-Form</h1><p>This is the upload section.</p></div>}
                    {activeSection === "announcement" && <div><h1>Announcements</h1><p>This is the announcements section.</p></div>}
                </div>
            </div>
        </div>
    );
}
