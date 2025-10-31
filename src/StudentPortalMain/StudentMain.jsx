import React, { useState, useEffect, useRef } from "react";
import './studentmain.css/studentmain.css';
import ProfileEnlistment from "./ProfileEnlistment";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StudentDashboard from "./StudentDashboard";
import StudentAnnouncement from "./StudentAnnouncement";

export default function StudentMain() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [activeSection, setActiveSection] = useState("welcome");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const confirmLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to logout?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("acceptedStudent");
                localStorage.removeItem("activeSession");
                setStudent(null);
                setIsOpen(false);
                navigate("/login");
            }
        });
    };

    const onChangePassword = () => {
        setShowPasswordModal(true);
        setIsOpen(false);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirmPassword) {
            Swal.fire("Warning", "Please fill in all fields.", "warning");
            return;
        }
        if (newPassword !== confirmPassword) {
            Swal.fire("Error", "New passwords do not match!", "error");
            return;
        }
        Swal.fire("Success", "Password changed successfully!", "success");
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    useEffect(() => {
        const storedStudent = localStorage.getItem("acceptedStudent");
        if (storedStudent) {
            try {
                const parsed = JSON.parse(storedStudent);
                setStudent(parsed);
            } catch {
                localStorage.removeItem("acceptedStudent");
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading && !student) {
            navigate("/login");
        }
    }, [loading, student, navigate]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setSidebarVisible(window.innerWidth >= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOverlayClick = () => {
        if (isMobile && sidebarVisible) setSidebarVisible(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'activeSession' && e.newValue === null) {
                navigate("/login");
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [navigate]);

    useEffect(() => {
        let timeout; const resetTimer = () => {
            clearTimeout(timeout); const expiry = Date.now() + 10 * 60 * 1000;
            localStorage.setItem("sessionExpiry", expiry);
            timeout = setTimeout(() => {
                localStorage.removeItem("acceptedStudent");
                localStorage.removeItem("activeSession");
                localStorage.setItem("autoLogout", "true");
                window.location.href = "/login";
            }, 10 * 60 * 1000);
        };
        const events = ["mousemove", "keydown", "click"];
        events.forEach(evt => window.addEventListener(evt, resetTimer)); resetTimer();
        return () => { clearTimeout(timeout); events.forEach(evt => window.removeEventListener(evt, resetTimer)); };
    }, [navigate]);

    const formatFullName = () => {
        if (!student) return "Student";
        if (student.fullName) return student.fullName;

        const { firstname = "", middlename = "", lastname = "", extension = "" } = student;
        const middleInitial = middlename.trim() ? middlename.trim().charAt(0).toUpperCase() + "." : "";
        return `${lastname} ${firstname} ${middleInitial} ${extension}`.trim();
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-content">
                    <img src="./img/loading.gif" alt="Loading..." />
                    <p>Loading... Please Wait</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stud-page-layout">
            {isMobile && sidebarVisible && <div className="sidebar-overlay show" onClick={handleOverlayClick}></div>}
            <div className="studmain-navbar">
                {isMobile && (
                    <i
                        className="fa-solid fa-bars stud-menu-toggle"
                        onClick={() => setSidebarVisible(!sidebarVisible)}
                    ></i>
                )}
                <div
                    className="navbar-user"
                    ref={dropdownRef}
                    onMouseEnter={() => !isMobile && setIsOpen(true)}
                    onMouseLeave={() => !isMobile && setIsOpen(false)}
                    onClick={() => isMobile && setIsOpen(prev => !prev)}
                    style={{ position: "relative", cursor: "pointer" }}
                >
                    <i className="fa-solid fa-user-circle"></i>
                    <span className="studentname">{student ? formatFullName() : "Student"}</span>
                    <i className="fa-solid fa-caret-down dropdown-icon"></i>
                    {isOpen && (
                        <div className="user-dropdown">
                            <button className="dropdown-item" onClick={onChangePassword}>
                                Change Password
                            </button>
                            <button className="dropdown-item" onClick={confirmLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="password-modal">
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordSubmit}>
                            {/* Old Password */}
                            <label>Old Password</label>
                            <div className="password-field">
                                <input
                                    type={showOldPass ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Enter old password"
                                />
                                <i
                                    className={`fa-solid ${showOldPass ? "fa-eye-slash" : "fa-eye"}`}
                                    onClick={() => setShowOldPass(!showOldPass)}
                                ></i>
                            </div>

                            {/* New Password */}
                            <label>New Password</label>
                            <div className="password-field">
                                <input
                                    type={showNewPass ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                                <i
                                    className={`fa-solid ${showNewPass ? "fa-eye-slash" : "fa-eye"}`}
                                    onClick={() => setShowNewPass(!showNewPass)}
                                ></i>
                            </div>

                            {/* Confirm Password */}
                            <label>Confirm New Password</label>
                            <div className="password-field">
                                <input
                                    type={showConfirmPass ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                                <i
                                    className={`fa-solid ${showConfirmPass ? "fa-eye-slash" : "fa-eye"}`}
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                ></i>
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Save</button>
                            </div>
                        </form>

                        {/* ❌ Close Button */}
                        <i
                            className="fa-solid fa-xmark close-modal"
                            onClick={() => setShowPasswordModal(false)}
                        ></i>
                    </div>
                </div>
            )}


            <div className={`stud-sidebar university-style ${sidebarVisible ? "show" : "hide"}`}>
                <div className="stud-sidebar-header">
                    <img src="./img/knshdlogo.png" alt="Logo" draggable="false" />
                    <h2>Kolehiyo Ng Subic</h2>
                    <p>Student Information System</p>
                    <hr className="sidehr" />
                </div>
                <ul className="stud-sidebar-menu">
                    <li onClick={() => setActiveSection("welcome")}>
                        <i className="fa-solid fa-house"></i> Dashboard
                    </li>
                    <li onClick={() => setActiveSection("profile")}>
                        <i className="fa-solid fa-id-card"></i> Profile/Enlistment
                    </li>
                    <li onClick={() => setActiveSection("schedule")}>
                        <i className="fa-solid fa-calendar-alt"></i> Schedule
                    </li>
                    <li onClick={() => setActiveSection("upload")}>
                        <i className="fa-solid fa-upload"></i> E-Form
                    </li>
                    <li onClick={() => setActiveSection("summary")}>
                        <i className="fa-solid fa-graduation-cap"></i> Summary of Grades
                    </li>
                    <li onClick={() => setActiveSection("evaluation")}>
                        <i className="fa-solid fa-file-alt"></i> Academic Evaluation
                    </li>
                    <li onClick={() => setActiveSection("term-grades")}>
                        <i className="fa-solid fa-chart-line"></i> Term Grades
                    </li>
                    <li onClick={() => setActiveSection("faculty-eval")}>
                        <i className="fa-solid fa-chalkboard-teacher"></i> Faculty Evaluation
                    </li>
                    <li onClick={() => setActiveSection("announcements")}>
                        <i className="fa-solid fa-bullhorn"></i> Announcements
                    </li>
                </ul>
            </div>
            <div className="stud-main">
                <div className="stud-content">
                    {activeSection === "welcome" && <StudentDashboard student={student} />}
                    {activeSection === "profile" && <ProfileEnlistment student={student} />}
                    {activeSection === "announcements" && <StudentAnnouncement student={student} />}
                </div>
            </div>
        </div>
    );
}
