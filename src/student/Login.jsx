import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./student css/studentlogin.css"

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
            if (student) navigate("/studentmain");
        }
    }, [navigate]);

    useEffect(() => { document.title = "Kolehiyo Ng Subic - Student Portal Login"; }, []);

    useEffect(() => {
        if (localStorage.getItem("autoLogout") === "true") {
            Swal.fire({ toast: true, position: "top-end", icon: "info", title: "Auto Logout", text: "You were logged out due to 3 minutes of inactivity. Please re-login.", timer: 4000, showConfirmButton: false });
            localStorage.removeItem("autoLogout");
        }

        const expiry = localStorage.getItem("sessionExpiry");
        if (expiry && Date.now() > Number(expiry)) {
            localStorage.removeItem("acceptedStudent");
            localStorage.removeItem("activeSession");
            Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Session Expired", text: "Your session has expired. Please login again.", timer: 4500, showConfirmButton: false });
        }

        const activeSession = localStorage.getItem("activeSession");
        if (activeSession) {
            const student = JSON.parse(localStorage.getItem("acceptedStudent"));
            if (student) navigate("/studentmain");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (showModal) return;

        try {
            Swal.fire({ title: "Logging in...", text: "Please wait", allowOutsideClick: false, allowEscapeKey: false, didOpen: () => Swal.showLoading() });

            const res = await fetch(import.meta.env.VITE_API_URL + "/api/acceptedstudents/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentNumber, portalPassword: password }),
            });

            const data = await res.json();
            Swal.close();

            if (!res.ok) return Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Login Failed", text: data.message, timer: 3000, showConfirmButton: false });

            localStorage.setItem("acceptedStudent", JSON.stringify(data.student));
            localStorage.setItem("activeSession", "true");

            const identifier = data.student.domainEmail || data.student.studentNumber;
            try {
                const res2 = await fetch(`http://localhost:2025/api/student/original/${identifier}`);
                if (res2.ok) {
                    const studentRecord = await res2.json();
                    localStorage.setItem("originalStudent", JSON.stringify(studentRecord));
                }
            } catch (err) { console.error("Error fetching original student record:", err); }

            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Login Successful!", showConfirmButton: false, timer: 1500 })
                .then(() => navigate("/studentmain"));
        } catch (err) {
            Swal.close();
            Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error", text: "Something went wrong", timer: 3000, showConfirmButton: false });
        }
    };

    useEffect(() => {
        const handleStorageChange = (e) => { if (e.key === 'activeSession' && e.newValue === null) navigate("/login"); };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [navigate]);

    return (
        <div className="studentportal-container">
            {showModal && (
                <div className="studentportal-modal-backdrop">
                    <div className="studentportal-modal-container">
                        <img src="/img/class-shed.png" alt="Class Shed" />
                        <i
                            onClick={() => setShowModal(false)}
                            className="fa-solid fa-xmark studentportal-fa-xmark"
                        ></i>
                    </div>
                </div>
            )}

            <div className="studentportal-container-inner" style={{ flex: 1, pointerEvents: showModal ? "none" : "auto" }}>
                <div className="studentportal-login-section">
                    <div className="studentportal-login-box">
                        <div className="studentportal-logo-container">
                            <img
                                src="/img/knshdlogo.png"
                                alt="Kolehiyo Ng Subic"
                                className="maiinlogo"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowModal(true)}
                            />
                        </div>

                        <h2 className="studentportal-title">KOLEHIYO NG SUBIC</h2>
                        <p className="studentportal-subtitle">STUDENT PORTAL</p>
                        <p className="studentportal-subtitle" style={{ marginTop: "-20px", color: "darkgreen", fontWeight: "bold" }}>
                            STUDENT ENROLLMENT SYSTEM v.1
                        </p>
                        <hr />
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Student Number / Domain Email"
                                className="studentportal-input"
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                                required
                            />
                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="studentportal-input"
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
                            <div className="studentportal-button-group1">
                                <button type="submit" className="studentportal-login-button1">Login</button>
                            </div>
                            <p onClick={() => setReset(true)} className="studentportal-forgot-password">Forgot Password?</p>
                        </form>
                        <hr />
                        <p style={{ fontSize: "10px", textAlign: "center" }}>
                            By clicking the login button, you recognize the authority of Kolehiyo ng Subic to process your personal and sensitive information,
                            pursuant to the <Link to="notice" target='_blank' style={{ color: "green" }}>Kolehiyo ng Subic General Privacy Notice</Link> and applicable laws.
                        </p>
                    </div>
                </div>

                {reset && (
                    <div className="studentportal-reset">
                        <div className="studentportal-resetbg">
                            <h1><i className="fa-solid fa-globe"></i> Instruction</h1>
                            <a href="#" style={{ position: "absolute", top: "10px", right: "10px" }}>
                                <i onClick={() => setReset(false)} className="fa-solid fa-xmark"></i>
                            </a>
                            <hr />
                            <p style={{ fontSize: "12px" }}>
                                For password reset requests and other reports for both KNS Systems and Google Workspace accounts, kindly send an email to
                                [webadmin@kns.edu.ph] using your domain email account or your registered alternate email account (personal) with the following format:
                            </p>
                            <div style={{ marginLeft: "20px" }}>
                                <p style={{ fontSize: "10px", color: "orange" }}>Subject: Password RESET Request for [SPAcc/KNSLAMP/Google Account]</p>
                                <p style={{ fontSize: "10px" }}>Student Number: [your student number]</p>
                                <p style={{ fontSize: "10px" }}>Reason: [state your reason here]</p>
                                <p style={{ fontSize: "10px", color: "red" }}>Note: Attach a clear and verifiable screenshot/s of the reported issue.</p>
                            </div>
                            <hr />
                            <p style={{ fontSize: "10px", textAlign: "center" }}>
                                Once verified, you will receive an email that contains the new account credentials. Only those emails that used the KNS domain account or
                                the registered alternate email account (personal email account that you registered using KNS) will be processed online. Otherwise, proceed
                                to the REGISTRAR office to process your request.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className='login-footer' >
                <p>© 2025 Kolehiyo Ng Subic. Management Information Systems Unit.</p>
            </div>
        </div>
    );
}
