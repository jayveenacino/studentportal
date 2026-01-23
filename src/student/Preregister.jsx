import React, { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import useAdmin from "../Admin/useAdmin";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Welcome from './Welcome';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Upload from "./Upload";
import Announcement from "./Announcement";

export default function Preregister() {
    const { user, setUser } = useAdmin()
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("welcome");
    const [userEmail, setUserEmail] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        document.title = "Kolehiyo Ng Subic - Student Admission";
    }, []);


    //LOADING EFFECT
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, [])

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || Object.keys(user).length === 0) {
            navigate('/signup', { replace: true });
        }
    }, []);

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        setUser({});
        navigate('/signup');
    };

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

    //CHANGE PASSWORD
    const [forgot, setForgot] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const hideModal = () => {
        setForgot(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleChangePassword = async () => {

        let isValid = true;
        if (!currentPassword) {
            document.getElementById("currentPassword").style.border = "1px solid red";
            isValid = false;
        } else {
            document.getElementById("currentPassword").style.border = "";
        }

        if (!newPassword) {
            document.getElementById("newPassword").style.border = "1px solid red";
            isValid = false;
        } else {
            document.getElementById("newPassword").style.border = "";
        }

        if (!confirmPassword) {
            document.getElementById("confirmPassword").style.border = "1px solid red";
            isValid = false;
        } else {
            document.getElementById("confirmPassword").style.border = "";
        }

        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all the fields.',
            });
            return;
        }

        if (currentPassword === newPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your new password cannot be the same as the current password.',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'New password and confirm password do not match.',
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:2025/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: 'Your password has been updated successfully.',
                }).then(() => {
                    window.location.reload();
                });
                setForgot(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text: 'Please try again later.',
            });
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const email = localStorage.getItem("userEmail");
            if (!email) return;

            try {
                const res = await axios.get(import.meta.env.VITE_API_URL + "/getuser", {
                    params: { email }
                });

                if (res.data && res.data.student) {
                    setUser(res.data.student);
                    setUserEmail(res.data.student.email);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);


    return (
        <div className="body">
            {loading ? (
                <div className="loading-screen">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="adcontainer">
                    <div className="prenav">
                        <img className="adlogo" src="./img/knshdlogo.png" alt="Logo" draggable="false" style={{ pointerEvents: "none", userSelect: "none", height: "45px" }} />
                        <div className="prenav-text" draggable="false" style={{ pointerEvents: "none", userSelect: "none" }} >
                            <h1>Kolehiyo Ng Subic</h1>
                            <p>Student Admission Portal v.1</p>
                        </div>
                        <div className="dropdown">
                            <button className="dropbtn">
                                <i className="fa-solid fa-user" style={{ fontSize: "12px" }}></i>

                                <span className="username">
                                    {user?.firstname || ""} {user.middlename ? user.middlename.charAt(0) + ". " : ""} {user?.lastname || ""} {user?.extension || ""}
                                </span>

                                <span className="arrow">
                                    <i className="fa-solid fa-caret-down" style={{ fontSize: "15px" }}></i>
                                </span>
                            </button>

                            <div className="dropdown-content">
                                <a className="userdropname" href="#">{user?.firstname || ""} {user.middlename ? user.middlename.charAt(0) + ". " : ""} {user?.lastname || ""} {user?.extension || ""}</a>
                                <a href="#" onClick={() => setForgot(true)}><i className="fa-solid fa-key"></i> Change Password</a>
                                <a href="#" onClick={handleLogoutClick}><i className="fa-solid fa-right-from-bracket"></i> Logout</a>
                            </div>
                        </div>
                        <i className="fa-solid fa-bars menu-icon" onClick={() => setSidebarVisible(!sidebarVisible)}></i>

                        {forgot && (
                            <div className="preforgot">
                                <div className="forgotbg">
                                    <h2 style={{ color: "#303030" }}>Change Password</h2>
                                    <p style={{ color: "#303030" }}>
                                        To change your password, please enter your current password followed by your new password.
                                    </p>
                                    <hr />

                                    <input
                                        className="preforgot-input"
                                        id="currentPassword"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        placeholder="Current Password*"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <i
                                        className={`fa-solid fa-eye${showCurrentPassword ? '' : '-slash'}`}
                                        onMouseDown={() => setShowCurrentPassword(true)}
                                        onMouseUp={() => setShowCurrentPassword(false)}
                                        onMouseLeave={() => setShowCurrentPassword(false)}
                                        style={{
                                            cursor: 'pointer',
                                            position: 'absolute',
                                            right: '37px',
                                            top: '37.4%',
                                            transform: 'translateY(-50%)',
                                        }}
                                    ></i>
                                    <input
                                        className="preforgot-input"
                                        id="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="New Password*"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <i
                                        className={`fa-solid fa-eye${showNewPassword ? '' : '-slash'}`}
                                        onMouseDown={() => setShowNewPassword(true)}
                                        onMouseUp={() => setShowNewPassword(false)}
                                        onMouseLeave={() => setShowNewPassword(false)}

                                        style={{
                                            cursor: 'pointer',
                                            position: 'absolute',
                                            right: '37px',
                                            top: '52.4%',
                                            transform: 'translateY(-50%)',
                                        }}
                                    ></i>
                                    <input
                                        className="preforgot-input"
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm Password*"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <i
                                        className={`fa-solid fa-eye${showConfirmPassword ? '' : '-slash'}`}
                                        onMouseDown={() => setShowConfirmPassword(true)}
                                        onMouseUp={() => setShowConfirmPassword(false)}
                                        onMouseLeave={() => setShowConfirmPassword(false)}
                                        style={{
                                            cursor: 'pointer',
                                            position: 'absolute',
                                            right: '37px',
                                            top: '67.4%',
                                            transform: 'translateY(-50%)',
                                        }}
                                    ></i>
                                    <div className="button-container">
                                        <button style={{ border: "none" }} onClick={hideModal}>Cancel</button>
                                        <button
                                            style={{ border: "1px solid #006666", background: "#006666", color: "white" }}
                                            onClick={handleChangePassword}
                                        >
                                            Update Password
                                        </button>
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
                        {activeSection === "welcome" &&
                            <Welcome />
                        }

                        {activeSection === "dashboard" && (
                            <Dashboard />
                        )}

                        {activeSection === "profile" && (
                            <Profile />
                        )}

                        {activeSection === "upload" && (
                            <Upload />
                        )}

                        {activeSection === "announcement" && (
                            <Announcement />
                        )}
                    </div>
                </div>
            )
            }

        </div >


    );
}
