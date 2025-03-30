import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [newShowPassword, setNewShowPassword] = useState(false);
    const navigate =useNavigate()

    const [reset, setReset] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    })

    const [formData, setFormData] = useState({
        birthdate: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            let numericValue = value.replace(/\D/g, "");

            if (numericValue.startsWith("0")) {
                numericValue = numericValue.slice(1);
            }

            numericValue = numericValue.slice(0, 10);

            let formattedPhone = numericValue
                .replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3")
                .replace(/^(\d{3})(\d{3})$/, "$1-$2");

            setFormData({ ...formData, phone: formattedPhone });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:2025/login", loginForm)

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Logged In!",
                    text: "You successfully Logged In. Redirecting...",
                    showConfirmButton: false,
                    timer: 2000
                });

                setTimeout(() => navigate("/preregister"), 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error

            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: errorMessage,
                confirmButtonColor: "#d33"
            });
        }

    }
    
    return (
        <div className="container">
            {/* Left Section - Login */}

            <div className="login-section">
                <div className="login-box">
                    <div className="logo-container">
                        <img src="public/img/knshdlogo.png" alt="Kolehiyo Ng Subic" className="maiinlogo" />
                    </div>
                    <h2 className="title" style={{ fontSize: "15px" }}>KOLEHIYO NG SUBIC</h2>
                    <p className="subtitle" style={{ fontSize: "10px" }}>Office of the Student Welfare and Services</p>
                    <p className="subtitle" style={{ fontSize: "10px" }}>Student Admission Portal </p>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <input onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} value={loginForm.email} type="text" placeholder="Username" className="input" required />
                        <div style={{ position: "relative", width: "100%" }}>
                            <input
                                value={loginForm.password}
                                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="input"
                                required
                                style={{ paddingRight: "7px" }}
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
                        <div className="button-group">
                            <button className="login-button" style={{ border: "none", backgroundColor: "#005bb5" }}>Login</button>
                            <Link to="create"> <button className="signup-button" style={{ border: "none", backgroundColor: "#005bb5" }}>Sign Up</button></Link>
                        </div>
                        <p onClick={() => setReset(true)} className="forgot-password" style={{ fontSize: "11px" }}>Forgot Password?</p>
                    </form>

                    <hr />
                    <p style={{ fontSize: "10px", textAlign: "center" }}>
                        By clicking the login button, you recognize the authority of Kolehiyo ng Subic to process your personal and sensitive information,
                        pursuant to the <a href="" style={{ color: "green" }}>Kolehiyo ng Subic General Privacy Notice</a> and applicable laws.
                    </p>
                </div>
            </div>

            {reset && (
                <div className="forgot-reset">
                    <div className="forgot-resetbg">
                        <h2 className="forgot-reset-title">Forgot Password?</h2>
                        <p className="forgot-reset-description">
                            To recover your password, please fill out this form. Make sure the information you provide matches what we have on file.
                        </p>

                        <form className="forgot-reset-form" action="">
                            <div className="forgot-input-group">
                                <label>Registration/KNSAT Number*</label>
                                <input type="text" placeholder="Your registration Number" required />
                            </div>

                            <div className="forgot-input-group">
                                <label>Username/Email Address*</label>
                                <input type="email" placeholder="Username/Email Address" required />
                            </div>

                            <div className="forgot-input-group">
                                <label>Mobile Number*</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="+63 XXX-XXX-XXXX"
                                    className="input-field"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="forgot-input-group">
                                <label>Date of Birth*</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    className="input-field"
                                    onChange={handleChange}
                                    onFocus={(e) => e.target.placeholder = ""}
                                    onBlur={(e) => e.target.placeholder = window.innerWidth <= 768 ? "MM/DD/YYYY" : ""}
                                    placeholder={window.innerWidth <= 768 ? "MM/DD/YYYY" : ""}
                                />

                            </div>

                            <div className="forgot-input-group">
                                <label>New Password*</label>
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type={newShowPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="input"
                                        required
                                        style={{ paddingRight: "30px" }}
                                    />
                                    <i
                                        className={`fa-solid ${newShowPassword ? "fa-eye" : "fa-eye-slash"}`}
                                        onMouseDown={() => setNewShowPassword(true)}
                                        onMouseUp={() => setNewShowPassword(false)}
                                        onMouseLeave={() => setNewShowPassword(false)}
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            top: "50%",
                                            transform: "translateY(-93%)",
                                            cursor: "pointer",
                                            color: "#666",
                                            fontSize: "16px"
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <div className="forgot-input-group" style={{ marginTop: "-20px" }}>
                                <label>Confirm Password*</label>
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type={newShowPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="input"
                                        required
                                        style={{ paddingRight: "30px" }}
                                    />
                                    <i
                                        className={`fa-solid ${newShowPassword ? "fa-eye" : "fa-eye-slash"}`}
                                        onMouseDown={() => setNewShowPassword(true)}
                                        onMouseUp={() => setNewShowPassword(false)}
                                        onMouseLeave={() => setNewShowPassword(false)}
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            top: "50%",
                                            transform: "translateY(-93%)",
                                            cursor: "pointer",
                                            color: "#666",
                                            fontSize: "16px"
                                        }}
                                    ></i>
                                </div>
                            </div>

                            <div className="forgot-reset-buttons">
                                <button type="button" className="forgot-cancel-button" onClick={() => setReset(false)}>Cancel</button>
                                <button type="submit" className="forgot-update-button">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {/* Right Section - Vision/Mission */}
            <div className="info-section">
                <div className="logo-container">
                    <img src="public/img/knshdlogo.png" alt="Kolehiyo Ng Subic" className="maiinlogo" />
                </div>

                <h2 className="section-title" style={{ color: "white" }}>VISION</h2>
                <p className="section-text">By 2025, the College envisions to be a premier local institution of higher learning in Region 3 committed to the holistic development of the human person and society.</p>
                <h2 className="section-title" style={{ color: "white" }}>MISSION</h2>
                <p className="section-text">To produce well-trained, skilled, dynamic, and competitive individuals imbued with values and attitudes responsive to the changing needs of the local, national and global communities.</p>
                <h2 className="section-title" style={{ color: "white" }}>GOALS</h2>
                <ul className="goals-list">
                    <li>Provide opportunities for high-level education in professional, technical, and vocational studies.</li>
                    <li>Develop innovative programs and research studies.</li>
                    <li>Promote community development through relevant programs.</li>
                    <li>Support employability and entrepreneurship of graduates.</li>
                </ul>
            </div>
        </div>
    );
};

export default Signup;
