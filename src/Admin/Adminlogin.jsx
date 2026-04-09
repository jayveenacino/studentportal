import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdmin from './useAdmin';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Admincss/admin.css';

export default function Login() {
    const { admin, setAdmin, adminLoaded } = useAdmin();
    const [showPassword, setShowPassword] = useState(false);
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");
    const [pendingLogin, setPendingLogin] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isVerifyingPin, setIsVerifyingPin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;

            if (mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth < 768) {
                setIsMobile(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const storedAdmin = JSON.parse(sessionStorage.getItem("Admin"));
        if (storedAdmin && (storedAdmin.email || storedAdmin.username)) {
            navigate("/auth/secure-access/admin-portal/admindashboard", { replace: true });
        }
    }, [navigate]);

    const rolesRequiringPin = ["ADMIN", "REGISTRAR", "ENCODER", "EVALUATOR"];

    const handlePinSubmit = async () => {
        if (!pin || pin.length < 4) {
            Swal.fire({
                icon: "error",
                title: "Invalid PIN",
                text: "Please enter a valid 4-digit PIN",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        setIsVerifyingPin(true);

        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + "/api/verify-pin", {
                userId: pendingLogin._id,
                pin: pin
            });

            if (res.data.valid) {
                completeLogin(pendingLogin);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Invalid PIN",
                    text: "The PIN you entered is incorrect",
                    showConfirmButton: false,
                    timer: 2000,
                });
                setPin("");
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to verify PIN",
                showConfirmButton: false,
                timer: 2000,
            });
        } finally {
            setIsVerifyingPin(false);
        }
    };

    const completeLogin = async (userData) => {
        setAdmin(userData);
        sessionStorage.setItem("Admin", JSON.stringify(userData));

        await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Login Successful",
            text: `Welcome back, ${userData.username}!`,
            showConfirmButton: false,
            timer: 1500,
        });

        await Swal.fire({
            title: "Loading Dashboard...",
            html: "<b>Please wait</b>",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading(),
            timer: 2000,
        });

        navigate("/auth/secure-access/admin-portal/admindashboard", { replace: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoggingIn) return;

        setIsLoggingIn(true);

        if (
            emailOrUsername === import.meta.env.VITE_DEFAULT_ADMIN_EMAIL &&
            password === import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD
        ) {
            const defaultAdmin = {
                email: "knsadmincsd@gmail.com",
                username: "SuperAdmin",
                role: "Super Admin",
            };

            setAdmin(defaultAdmin);
            sessionStorage.setItem("Admin", JSON.stringify(defaultAdmin));

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Default Admin Login Successful",
                showConfirmButton: false,
                timer: 1500,
            });

            await Swal.fire({
                title: "Loading Dashboard...",
                html: "<b>Please wait</b>",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading(),
                timer: 2000,
            });

            setIsLoggingIn(false);
            navigate("/auth/secure-access/admin-portal/admindashboard", { replace: true });
            return;
        }

        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + "/api/adminlogin", {
                emailOrUsername,
                password,
            });

            const userData = res.data.admin;

            if (rolesRequiringPin.includes(userData.role)) {
                setPendingLogin(userData);
                setShowPinModal(true);
                setIsLoggingIn(false);
            } else {
                await completeLogin(userData);
            }
        } catch (err) {
            setIsLoggingIn(false);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Login Failed",
                text: err.response?.data?.message || "Incorrect login details",
                showConfirmButton: false,
                timer: 2500,
            });
        }
    };

    const closePinModal = () => {
        if (isVerifyingPin) return;
        setShowPinModal(false);
        setPin("");
        setPendingLogin(null);
    };

    if (isMobile) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#0a3d18",
                color: "white",
                textAlign: "center",
                padding: "20px"
            }}>
                <div style={{
                    background: "white",
                    color: "#0a3d18",
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px"
                }}>
                    <i className="fa-solid fa-mobile-screen" style={{ fontSize: "40px" }}></i>
                </div>
                <h1 style={{ fontSize: "24px", marginBottom: "15px" }}>THIS PAGE IS NOT AVAILABLE</h1>
                <p style={{ fontSize: "14px", maxWidth: "300px", lineHeight: "1.6" }}>
                    The Admin Portal is only accessible on desktop or laptop devices. Please use a computer to access this page.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="container">
                <div className="login-section">
                    <div className="login-box">
                        <div className="logo-container">
                            <img src="/img/knshdlogo.png" alt="Kolehiyo Ng Subic" className="maiinlogo" />
                        </div>

                        <h2 className="title" style={{ fontSize: "15px" }}>KOLEHIYO NG SUBIC</h2>
                        <p className="subtitle" style={{ fontSize: "10px" }}>MANAGEMENT INFORMATION SYSTEMS UNIT</p>
                        <p className="subtitle" style={{ fontSize: "10px" }}>Integrated System Admin Portal</p>

                        <form onSubmit={handleSubmit}>
                            <input
                                value={emailOrUsername}
                                onChange={e => setEmailOrUsername(e.target.value)}
                                type="text"
                                placeholder="Email or Username"
                                className="input"
                                required
                                disabled={isLoggingIn}
                            />

                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="input"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={isLoggingIn}
                                />
                                <i
                                    className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                                    onClick={() => !isLoggingIn && setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "35%",
                                        transform: "translateY(-50%)",
                                        cursor: isLoggingIn ? "not-allowed" : "pointer",
                                        color: "#666",
                                        fontSize: "16px",
                                        opacity: isLoggingIn ? 0.5 : 1
                                    }}
                                ></i>
                            </div>

                            <div className="button-group1">
                                <button 
                                    type='submit' 
                                    className="login-button1"
                                    disabled={isLoggingIn}
                                    style={{
                                        opacity: isLoggingIn ? 0.7 : 1,
                                        cursor: isLoggingIn ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {isLoggingIn ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </form>

                        <p style={{ fontSize: "10px", textAlign: "center", paddingTop: "20px" }}>
                            <a href="" style={{ color: "green" }}>Kolehiyo ng Subic General Privacy Notice</a>
                        </p>
                    </div>
                </div>
            </div>

            {showPinModal && (
                <div className="adminuser-modal" style={{ zIndex: 1000 }}>
                    <div className="adminuser-modal-content" style={{ textAlign: "center", maxWidth: "350px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h2 style={{ marginBottom: "10px", color: "#0a3d18", width: "100%" }}>Enter Admin PIN</h2>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "25px", width: "100%" }}>
                            Please enter your 4-digit PIN to continue
                        </p>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "25px" }}>
                            <input
                                type="password"
                                placeholder="••••"
                                value={pin}
                                onChange={e => setPin(e.target.value)}
                                maxLength={4}
                                disabled={isVerifyingPin}
                                style={{
                                    textAlign: "center",
                                    fontSize: "24px",
                                    letterSpacing: "8px",
                                    padding: "15px",
                                    width: "150px",
                                    border: "2px solid #0a3d18",
                                    borderRadius: "8px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    opacity: isVerifyingPin ? 0.6 : 1
                                }}
                            />
                        </div>
                        <div className="adminuser-modal-buttons" style={{ justifyContent: "center", width: "100%" }}>
                            <button 
                                onClick={handlePinSubmit} 
                                disabled={isVerifyingPin}
                                style={{ 
                                    backgroundColor: "#0a3d18",
                                    padding: "12px 24px",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    opacity: isVerifyingPin ? 0.6 : 1,
                                    cursor: isVerifyingPin ? "not-allowed" : "pointer"
                                }}
                            >
                                {isVerifyingPin ? "Verifying..." : "Verify"}
                            </button>
                            <button 
                                onClick={closePinModal} 
                                disabled={isVerifyingPin}
                                style={{ 
                                    backgroundColor: "#dc3545",
                                    padding: "12px 24px",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    opacity: isVerifyingPin ? 0.6 : 1,
                                    cursor: isVerifyingPin ? "not-allowed" : "pointer"
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                textAlign: "center",
                fontSize: "12px",
                padding: "10px",
                background: "#111",
                color: "#fff",
                position: "fixed",
                bottom: 0,
                width: "100%"
            }}>
                © 2025 Kolehiyo Ng Subic. Management Information Systems Unit.
            </div>
        </div>
    );
}