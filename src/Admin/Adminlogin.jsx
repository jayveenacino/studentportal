import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAdmin from './useAdmin';
import './Admincss/admin.css';

export default function Login() {
    const { admin, setAdmin } = useAdmin()
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();

    useEffect(() => {
        if (admin.email) navigate('/AdminDashboard')
    }, [admin])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "admin@gmail.com" && password === "admin") {
            setAdmin({ email })
            localStorage.setItem("Admin", JSON.stringify({ email }))
        }
    }


    return (
        <div>
            <div className="container">
                {/* Left Section - Login */}
                <div className="login-section">
                    <div className="login-box">
                        <div className="logo-container">
                            <img src="public/img/knshdlogo.png" alt="Kolehiyo Ng Subic" className="maiinlogo" />
                        </div>
                        <h2 className="title" style={{ fontSize: "15px" }}>KOLEHIYO NG SUBIC</h2>
                        <p className="subtitle" style={{ fontSize: "10px" }}>MANAGEMENT INFORMATION SYSTEMS UNIT</p>
                        <p className="subtitle" style={{ fontSize: "10px" }}>Integrated System Admin Portal</p>

                        <form onSubmit={handleSubmit}>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Username" className="input" required />

                            {/* Password Input Field with Eye Icon */}
                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="input"
                                    required
                                    style={{ paddingRight: "7px" }}
                                    value={password} onChange={e => setPassword(e.target.value)}
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

                            {/* Login Button */}
                            <div className="button-group1">
                                <button type='submit' className="login-button1">Login</button>
                            </div>
                        </form>

                        <p style={{ fontSize: "10px", textAlign: "center", paddingTop: "20px" }}>
                            <a href="" style={{ color: "green", }}>Kolehiyo ng Subic General Privacy Notice</a>
                        </p>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: "center", fontSize: "12px", padding: "10px", background: "#111", color: "#fff", position: "fixed", bottom: 0, width: "100%" }}>
                © 2025 Kolehiyo Ng Subic. Management Information Systems Unit.
            </div>
        </div>
    )
}
