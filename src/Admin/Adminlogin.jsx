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
    const navigate = useNavigate();

    // ✅ Redirect immediately if already logged in
    useEffect(() => {
        const storedAdmin = JSON.parse(localStorage.getItem("Admin"));
        if (storedAdmin && storedAdmin.email) {
            navigate("/auth/secure-access/admin-portal/admindashboard", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            emailOrUsername === "knsadmincsd@gmail.com" &&
            password === "kolehiyongsubiccsd2002"
        ) {
            const defaultAdmin = {
                email: "knsadmincsd@gmail.com",
                username: "KNS Admin",
                role: "Super Admin",
            };

            setAdmin(defaultAdmin);
            localStorage.setItem("Admin", JSON.stringify(defaultAdmin));

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

            navigate("/auth/secure-access/admin-portal/admindashboard", { replace: true });
            return;
        }

        try {
            const res = await axios.post("http://localhost:2025/api/adminlogin", {
                emailOrUsername,
                password,
            });

            setAdmin(res.data.admin);
            localStorage.setItem("Admin", JSON.stringify(res.data.admin));

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Login Successful",
                text: `Welcome back, ${res.data.admin.username}!`,
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
        } catch (err) {
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
                            />

                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="input"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
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
                                <button type='submit' className="login-button1">Login</button>
                            </div>
                        </form>

                        <p style={{ fontSize: "10px", textAlign: "center", paddingTop: "20px" }}>
                            <a href="" style={{ color: "green" }}>Kolehiyo ng Subic General Privacy Notice</a>
                        </p>
                    </div>
                </div>
            </div>

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
