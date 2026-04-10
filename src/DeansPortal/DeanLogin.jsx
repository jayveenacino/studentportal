import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import "./Deancss/deanlogin.css";

export default function DeanLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();

    const handleHoldStart = (e) => {
        if (e.cancelable) e.preventDefault();
        setShowPassword(true);
    };

    const handleHoldEnd = () => {
        setShowPassword(false);
    };

    useEffect(() => {
        document.title = "Kolehiyo Ng Subic - Deans Portal Login";
        
        const storedDean = sessionStorage.getItem("Dean");
        if (storedDean) {
            navigate("/deans-portal/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please enter both username and password.',
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }

        setIsLoggingIn(true);

        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + "/api/departments/dean-login", {
                username: username ,
                password: password
            });

            const deanData = res.data.department;

            if (deanData.status !== "Active") {
                Swal.fire({
                    icon: 'error',
                    title: 'Account Inactive',
                    text: 'Your account is currently inactive. Please contact the administrator.',
                    showConfirmButton: false,
                    timer: 2500
                });
                setIsLoggingIn(false);
                return;
            }

            sessionStorage.setItem("Dean", JSON.stringify(deanData));

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Login Successful",
                text: `Welcome, ${deanData.head}!`,
                showConfirmButton: false,
                timer: 1500
            });

            navigate("/deans-portal/dashboard", { replace: true });

        } catch (err) {
            setIsLoggingIn(false);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response?.data?.message || 'Invalid username or password.',
                showConfirmButton: false,
                timer: 2500
            });
        }
    };

    return (
        <div className="dl-full-screen-wrapper">
            <div className="dl-main-layout">
                <div className="dl-form-side">
                    <div className="dl-login-card">
                        <div className="dl-content-holder">
                            <div className="dl-logo-icon">
                                <img
                                    src="/img/knshdlogo.png"
                                    alt="KNS Logo"
                                    className="dl-main-logo"
                                />
                            </div>

                            <h1 className="dl-heading">KOLEHIYO NG SUBIC</h1>
                            <p className="dl-subtext">Deans Portal v1.0.0</p>

                            <form className="dl-input-form" onSubmit={handleLogin}>
                                <fieldset className="dl-input-group">
                                    <legend className="dl-legend">Username*</legend>
                                    <div className="dl-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Enter ID"
                                            className="dl-inner-input"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                            disabled={isLoggingIn}
                                        />
                                        <div className="dl-input-appendix">
                                            <span className="dl-email-suffix">@kolehiyongsubic.edu.ph</span>
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="dl-input-group">
                                    <legend className="dl-legend">Password*</legend>
                                    <div className="dl-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="dl-inner-input"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            disabled={isLoggingIn}
                                        />
                                        <div
                                            className="dl-input-appendix dl-pointer dl-no-select"
                                            onMouseDown={handleHoldStart}
                                            onMouseUp={handleHoldEnd}
                                            onMouseLeave={handleHoldEnd}
                                            onTouchStart={handleHoldStart}
                                            onTouchEnd={handleHoldEnd}
                                            onTouchCancel={handleHoldEnd}
                                        >
                                            <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} dl-password-toggle`}></i>
                                        </div>
                                    </div>
                                </fieldset>

                                <button 
                                    type="submit" 
                                    className="dl-login-btn"
                                    disabled={isLoggingIn}
                                    style={{
                                        opacity: isLoggingIn ? 0.7 : 1,
                                        cursor: isLoggingIn ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {isLoggingIn ? "Logging in..." : "Login"}
                                </button>
                            </form>

                            <div className="dl-bottom-nav">
                                <p className="dl-privacy-text">
                                    By clicking the login button, you recognize the authority of Kolehiyo ng Subic
                                    to process your personal and sensitive information, pursuant to the
                                    Kolehiyo ng Subic General Privacy Notice and applicable laws.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dl-image-side"></div>
            </div>
        </div>
    );
}