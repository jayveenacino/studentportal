import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
    const [reset, setReset] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const activeSession = localStorage.getItem('activeSession');
        if (activeSession) {
            const student = JSON.parse(localStorage.getItem('acceptedStudent'));
            if (student) {
                navigate("/studentmain");
            }
        }
    }, [navigate]);

    useEffect(() => {
        document.title = "Kolehiyo Ng Subic - Student Portal Login";
    }, []);

    useEffect(() => {
        if (localStorage.getItem("autoLogout") === "true") {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "info",
                title: "Auto Logout",
                text: "You were logged out due to 3 minutes of inactivity. Please re-login.",
                timer: 4000,
                showConfirmButton: false
            });
            localStorage.removeItem("autoLogout");
        }

        const expiry = localStorage.getItem("sessionExpiry");
        if (expiry && Date.now() > Number(expiry)) {
            localStorage.removeItem("acceptedStudent");
            localStorage.removeItem("activeSession");

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Session Expired",
                text: "Your session has expired. Please login again.",
                timer: 4500,
                showConfirmButton: false
            });
        }

        const activeSession = localStorage.getItem("activeSession");
        if (activeSession) {
            const student = JSON.parse(localStorage.getItem("acceptedStudent"));
            if (student) {
                navigate("/studentmain");
            }
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (showModal) return;

        try {
            Swal.fire({
                title: "Logging in...",
                text: "Please wait",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await fetch("http://localhost:2025/api/acceptedstudents/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentNumber, portalPassword: password }),
            });

            const data = await res.json();
            Swal.close();

            if (!res.ok) {
                return Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Login Failed",
                    text: data.message,
                    timer: 3000,
                    showConfirmButton: false,
                });
            }

            localStorage.setItem("acceptedStudent", JSON.stringify(data.student));
            localStorage.setItem("activeSession", "true");

            const identifier = data.student.domainEmail || data.student.studentNumber;
            try {
                const res2 = await fetch(`http://localhost:2025/api/student/original/${identifier}`);
                if (res2.ok) {
                    const studentRecord = await res2.json();
                    localStorage.setItem("originalStudent", JSON.stringify(studentRecord));
                }
            } catch (err) {
                console.error("Error fetching original student record:", err);
            }

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Login Successful!",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => navigate("/studentmain"));
        } catch (err) {
            Swal.close();
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Error",
                text: "Something went wrong",
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'activeSession' && e.newValue === null) {
                navigate("/login");
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [navigate]);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden", position: "relative" }}>
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <div
                        className="modal-container"
                        style={{
                            position: "relative",
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            maxWidth: "40%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            overflowX: "hidden",
                            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                        }}
                    >
                        <img
                            src="/img/classs-shed.png"
                            alt="Class Shed"
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                        <i
                            onClick={() => setShowModal(false)}
                            className="fa-solid fa-xmark"
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "red",
                                color: "#fff",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                fontSize: "18px",
                                zIndex: 10000,
                            }}
                        ></i>
                    </div>
                </div>
            )}

            <div className="container" style={{ flex: 1, pointerEvents: showModal ? "none" : "auto" }}>
                <div className="login-section">
                    <div className="login-box">
                        <div className="logo-container">
                            <img
                                src="/img/knshdlogo.png"
                                alt="Kolehiyo Ng Subic"
                                className="maiinlogo"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowModal(true)}  
                            />
                        </div>

                        <h2 className="title" style={{ fontSize: "15px" }}>KOLEHIYO NG SUBIC</h2>
                        <p className="subtitle" style={{ fontSize: "10px" }}>STUDENT PORTAL</p>
                        <p className="subtitle" style={{ fontSize: "10px", marginTop: "-20px", color: "darkgreen", fontWeight: "bold" }}>STUDENT ENROLLMENT SYSTEM v0.1</p>
                        <hr />
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Student Number / Domain Email"
                                className="input"
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                                required
                            />
                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="input"
                                    required
                                    style={{ paddingRight: "7px" }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <i
                                    className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "35%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#666",
                                        fontSize: "16px"
                                    }}
                                ></i>
                            </div>
                            <div className="button-group1">
                                <button type="submit" className="login-button1">Login</button>
                            </div>
                            <p onClick={() => setReset(true)} className="forgot-password" style={{ fontSize: "11px" }}>
                                Forgot Password?
                            </p>
                        </form>
                        <hr />
                        <p style={{ fontSize: "10px", textAlign: "center" }}>
                            By clicking the login button, you recognize the authority of Kolehiyo ng Subic to process your personal and sensitive information,
                            pursuant to the <Link to="notice" target='_blank' style={{ color: "green" }}>Kolehiyo ng Subic General Privacy Notice</Link> and applicable laws.
                        </p>
                    </div>
                </div>
                {reset &&
                    <div className="reset">
                        <div className="resetbg" style={{ position: "relative", padding: "20px" }}>
                            <h1 style={{ display: "inline-block", margin: 0 }}>
                                <i className="fa-solid fa-globe"></i> Instruction
                            </h1>
                            <a href="#" style={{ position: "absolute", top: "10px", right: "10px" }}>
                                <i
                                    onClick={() => setReset(false)}
                                    style={{ fontSize: "20px", color: "black", cursor: "pointer" }}
                                    className="fa-solid fa-xmark">
                                </i>
                            </a>
                            <hr />
                            <p style={{ fontSize: "12px" }}>
                                For password reset requests and other reports for both KNS Systems and Google Workspace accounts, kindly send an email to
                                [webadmin@kns.edu.ph] using your domain email account or your registered alternate email account (personal) with the following format:
                            </p>
                            <div style={{ marginLeft: "20px" }}>
                                <p style={{ fontSize: "10px", color: "orange" }}>
                                    Subject: Password RESET Request for [SPAcc/KNSLAMP/Google Account]
                                </p>
                                <p style={{ fontSize: "10px" }}>Student Number: [your student number]</p>
                                <p style={{ fontSize: "10px" }}>Reason: [state your reason here]</p>
                                <p style={{ fontSize: "10px", color: "red" }}>
                                    Note: Attach a clear and verifiable screenshot/s of the reported issue.
                                </p>
                            </div>
                            <hr />
                            <p style={{ fontSize: "10px", textAlign: "center" }}>
                                Once verified, you will receive an email that contains the new account credentials. Only those emails that used the KNS domain account or
                                the registered alternate email account (personal email account that you registered using KNS) will be processed online. Otherwise, proceed
                                to the REGISTRAR office to process your request.
                            </p>
                        </div>
                    </div>
                }
            </div>
            <div style={{ textAlign: "center", fontSize: "12px", padding: "10px", background: "#111", color: "#fff", position: "fixed", bottom: 0, width: "100%" }}>
                © 2025 Kolehiyo Ng Subic. Management Information Systems Unit.
            </div>
        </div>
    );
}
