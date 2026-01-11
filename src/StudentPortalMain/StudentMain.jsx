import React, { useState, useEffect, useRef } from "react";
import "./studentmain.css/studentmain.css";
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

    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const confirmLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
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

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }

        if (newPassword.length < 8) {
            Swal.fire("Error", "Password must be at least 8 characters", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire("Error", "New password and confirm password do not match", "error");
            return;
        }

        try {
            const studentData = JSON.parse(localStorage.getItem("acceptedStudent"));
            const studentId = studentData._id || studentData.id;

            const res = await fetch(
                `http://localhost:2025/api/acceptedstudents/${studentId}/change-password`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        oldPassword: oldPassword.trim(),
                        newPassword: newPassword.trim()
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                Swal.fire("Error", data.message, "error");
                return;
            }

            Swal.fire("Success", "Password updated successfully", "success");
            setShowPasswordModal(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            Swal.fire("Error", "Server connection failed", "error");
        }
    };

    useEffect(() => {
        const init = () => {
            const storedStudent = localStorage.getItem("acceptedStudent");
            if (!storedStudent) {
                navigate("/login");
                return;
            }
            setStudent(JSON.parse(storedStudent));
            setTimeout(() => {
                setLoading(false);
            }, 600);
        };
        init();
    }, [navigate]);

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
            if (e.key === "activeSession" && e.newValue === null) {
                navigate("/login");
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [navigate]);

    useEffect(() => {
        let timeout;
        const resetTimer = () => {
            clearTimeout(timeout);
            const expiry = Date.now() + 10 * 60 * 1000;
            localStorage.setItem("sessionExpiry", expiry);
            timeout = setTimeout(() => {
                localStorage.removeItem("acceptedStudent");
                localStorage.removeItem("activeSession");
                localStorage.setItem("autoLogout", "true");
                window.location.href = "/login";
            }, 10 * 60 * 1000);
        };
        const events = ["mousemove", "keydown", "click"];
        events.forEach((evt) => window.addEventListener(evt, resetTimer));
        resetTimer();
        return () => {
            clearTimeout(timeout);
            events.forEach((evt) => window.removeEventListener(evt, resetTimer));
        };
    }, [navigate]);

    const formatFullName = () => {
        if (!student) return "Student";
        if (student.fullName) {
            const parts = student.fullName.trim().split(" ");
            if (parts.length >= 3) {
                const first = parts[0];
                const middle = parts[1];
                const last = parts[2];
                return `${capitalize(first)} ${middle.charAt(0).toUpperCase()}. ${capitalize(last)}`;
            }
            return capitalizeWords(student.fullName);
        }
        const firstname = student.firstname || student.firstName || "";
        const middlename = student.middlename || student.middleName || "";
        const lastname = student.lastname || student.lastName || "";
        const extension = student.extension || "";
        const formattedFirst = capitalize(firstname.trim());
        const formattedLast = capitalize(lastname.trim());
        const middleInitial = middlename.trim()
            ? `${middlename.trim().charAt(0).toUpperCase()}.`
            : "";
        return `${formattedFirst} ${middleInitial} ${formattedLast} ${extension}`.trim();
    };

    const capitalize = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    const capitalizeWords = (str) =>
        str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <>
            {loading ? (
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <p>Loading... Please Wait</p>
                </div>
            ) : (
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

                        <div
                            className="navbar-user"
                            ref={dropdownRef}
                            onMouseEnter={() => !isMobile && setIsOpen(true)}
                            onMouseLeave={() => !isMobile && setIsOpen(false)}
                            onClick={() => isMobile && setIsOpen((prev) => !prev)}
                            style={{ position: "relative", cursor: "pointer" }}
                        >
                            <i className="fa-solid fa-user-circle"></i>
                            <span className="studentname">
                                {student ? formatFullName() : "Student"}
                            </span>
                            <i className="fa-solid fa-caret-down dropdown-icon"></i>
                            {isOpen && (
                                <div className="user-dropdown">
                                    <button className="dropdown-item" onClick={onChangePassword}>
                                        <i className="fa-solid fa-key" style={{ marginRight: "8px" }}></i>
                                        Change Password
                                    </button>
                                    <button className="dropdown-item" onClick={confirmLogout}>
                                        <i
                                            className="fa-solid fa-right-from-bracket"
                                            style={{ marginRight: "8px" }}
                                        ></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {showPasswordModal && (
                        <div className="unique-modal-overlay">
                            <div className="unique-password-modal">
                                <span
                                    className="close-modal-btn"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    &times;
                                </span>

                                <h2 className="unique-modal-title">
                                    <i className="fa-solid fa-key" style={{ marginRight: "8px" }}></i>
                                    Change Password
                                </h2>

                                <p className="unique-modal-description">
                                    All fields are required. Password must be at least eight (8)
                                    characters or more
                                </p>

                                <label className="unique-modal-label">Old Password</label>
                                <div className="unique-password-field">
                                    <input
                                        type={showOldPass ? "text" : "password"}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Enter old password"
                                    />
                                    <i
                                        className={`fa-solid ${showOldPass ? "fa-eye-slash" : "fa-eye"
                                            }`}
                                        onMouseDown={() => setShowOldPass(true)}
                                        onMouseUp={() => setShowOldPass(false)}
                                        onMouseLeave={() => setShowOldPass(false)}
                                    ></i>
                                </div>

                                <label className="unique-modal-label">New Password</label>
                                <div className="unique-password-field">
                                    <input
                                        type={showNewPass ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                    <i
                                        className={`fa-solid ${showNewPass ? "fa-eye-slash" : "fa-eye"
                                            }`}
                                        onMouseDown={() => setShowNewPass(true)}
                                        onMouseUp={() => setShowNewPass(false)}
                                        onMouseLeave={() => setShowNewPass(false)}
                                    ></i>
                                </div>

                                <label className="unique-modal-label">Confirm New Password</label>
                                <div className="unique-password-field">
                                    <input
                                        type={showNewPass ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                    <i
                                        className={`fa-solid ${showNewPass ? "fa-eye-slash" : "fa-eye"
                                            }`}
                                        onMouseDown={() => setShowNewPass(true)}
                                        onMouseUp={() => setShowNewPass(false)}
                                        onMouseLeave={() => setShowNewPass(false)}
                                    ></i>
                                </div>

                                <div className="unique-modal-actions">
                                    <button
                                        type="submit"
                                        className="unique-save-btn"
                                        onClick={handlePasswordSubmit}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        className={`stud-sidebar university-style ${sidebarVisible ? "show" : "hide"
                            }`}
                    >
                        <div className="stud-sidebar-header">
                            <img src="./img/knshdlogo.png" alt="Logo" draggable="false" />
                            <h2>Kolehiyo Ng Subic</h2>
                            <p>Student Information System</p>
                            <hr className="sidehr" />
                        </div>
                        <ul className="stud-sidebar-menu">
                            <li onClick={() => setActiveSection("welcome")}>
                                <i className="fa-solid fa-house"></i> Student Dashboard
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
                            {activeSection === "welcome" && (
                                <StudentDashboard student={student} />
                            )}
                            {activeSection === "profile" && (
                                <ProfileEnlistment student={student} />
                            )}
                            {activeSection === "announcements" && (
                                <StudentAnnouncement student={student} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
