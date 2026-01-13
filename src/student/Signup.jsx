import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import useAdmin from "../Admin/useAdmin";
import "../student/student css/studentsignup.css";

const Signup = () => {
    const { setUser } = useAdmin();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [newShowPassword, setNewShowPassword] = useState(false);
    const [reset, setReset] = useState(false);
    const [loading, setLoading] = useState(true);
    const [preRegisterOpen, setPreRegisterOpen] = useState(true);

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [formData, setFormData] = useState({
        registerNum: "",
        birthdate: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    useEffect(() => {
        axios.get("http://localhost:2025/settings")
            .then(res => setPreRegisterOpen(res.data.preRegister))
            .catch(() => setPreRegisterOpen(false));
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUser(user);
                navigate("/preregister");
            } catch (err) {
                console.error("Failed to parse user from localStorage:", err);
            }
        }
    }, [navigate, setUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            let numericValue = value.replace(/\D/g, "");
            if (numericValue.startsWith("0")) numericValue = numericValue.slice(1);
            numericValue = numericValue.slice(0, 10);
            let formattedPhone = numericValue.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3")
                .replace(/^(\d{3})(\d{3})$/, "$1-$2");
            setFormData({ ...formData, phone: formattedPhone });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:2025/login", loginForm);
            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Logged In!",
                    text: "You successfully logged in. Redirecting...",
                    showConfirmButton: false,
                    timer: 2000,
                });
                const user = response.data.student;
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));
                setTimeout(() => navigate("/preregister"), 2000);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.response?.data?.error || "Login failed",
                confirmButtonColor: "#d33",
            });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const { registerNum, email, phone, birthdate, password, confirmPassword } = formData;

        if (!registerNum || !email || !phone || !birthdate || !password || !confirmPassword) {
            Swal.fire({ icon: "error", title: "Error", text: "All fields are required!" });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({ icon: "error", title: "Error", text: "Passwords do not match!" });
            return;
        }

        let formattedPhone = phone.replace(/\D/g, ""); 
        if (!formattedPhone.startsWith("63")) formattedPhone = "63" + formattedPhone;
        formattedPhone = formattedPhone.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");

        const payload = {
            registerNum,
            email: email.trim().toLowerCase(),
            phone: formattedPhone,
            birthdate,
            password,
            confirmPassword,
        };

        try {
            const response = await axios.post("http://localhost:2025/reset-password", payload);
            Swal.fire({ icon: "success", title: "Success", text: response.data.message || "Password updated successfully!" });
            setReset(false);
            setFormData({
                registerNum: "",
                birthdate: "",
                phone: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.message || "Failed to reset password" });
        }
    };

    useEffect(() => {
    const preventScroll = (e) => e.preventDefault();

    if (reset) {
        document.body.classList.add("modal-open");
        document.body.addEventListener("touchmove", preventScroll, { passive: false }); // disable scroll on body
    } else {
        document.body.classList.remove("modal-open");
        document.body.removeEventListener("touchmove", preventScroll);
    }

    return () => {
        document.body.classList.remove("modal-open");
        document.body.removeEventListener("touchmove", preventScroll);
    };
}, [reset]);


    if (loading) return <div className="signup-loading"></div>;

    return (
        <div className="signup-container">
            <div className="signup-login-section">
                <div className="signup-login-box">
                    <div className="signup-logo-container">
                        <img src="/img/knshdlogo.png" alt="Kolehiyo Ng Subic" className="signup-mainlogo" />
                    </div>
                    <h2 className="signup-title" style={{ fontSize: "15px" }}>KOLEHIYO NG SUBIC</h2>
                    <p className="signup-subtitle" style={{ fontSize: "10px" }}>Office of the Student Welfare and Services</p>
                    <p className="signup-subtitle" style={{ fontSize: "10px" }}>Student Admission Portal</p>
                    <hr />

                    <form onSubmit={handleSubmit}>
                        <input
                            onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                            value={loginForm.email}
                            type="text"
                            placeholder="Email"
                            className="signup-input"
                            required
                        />
                        <div className="signup-input-wrapper-password">
                            <input
                                value={loginForm.password}
                                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="signup-input"
                            />
                            <i
                                className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>

                        <div className="signup-button-group">
                            <button className="signup-login-button">Login</button>
                            <button
                                className="signup-signup-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!preRegisterOpen) {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Pre-registration Closed",
                                            text: "The server has closed pre-registration. Please try again later.",
                                            confirmButtonColor: "#d33",
                                        });
                                    } else {
                                        navigate("/signup/create");
                                    }
                                }}
                            >
                                Sign Up
                            </button>
                        </div>

                        <p
                            onClick={() => setReset(true)}
                            className="signup-forgot-password"
                        >
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

            {reset && (
                <div className="signup-forgot-reset">
                    <div className="signup-forgot-resetbg">
                        <h2 className="signup-forgot-reset-title">Forgot Password?</h2>
                        <p className="signup-forgot-reset-description">
                            To recover your password, please fill out this form. Make sure the information you provide matches what we have on file.
                        </p>

                        <form className="signup-forgot-reset-form" onSubmit={handleResetPassword}>
                            <div className="signup-forgot-input-group">
                                <label>Registration/KNSAT Number*</label>
                                <input type="text" name="registerNum" placeholder="Your registration Number" value={formData.registerNum} onChange={handleChange} required />
                            </div>
                            <div className="signup-forgot-input-group">
                                <label>Email Address*</label>
                                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="signup-forgot-input-group">
                                <label>Mobile Number*</label>
                                <input type="text" name="phone" placeholder="+63 XXX-XXX-XXXX" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="signup-forgot-input-group">
                                <label>Date of Birth*</label>
                                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
                            </div>
                            <div className="signup-forgot-input-group">
                                <label>New Password*</label>
                                <div className="signup-input-wrapper">
                                    <input type={newShowPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                    <i
                                        className={`fa-solid ${newShowPassword ? "fa-eye" : "fa-eye-slash"}`}
                                        onMouseDown={() => setNewShowPassword(true)}
                                        onMouseUp={() => setNewShowPassword(false)}
                                        onMouseLeave={() => setNewShowPassword(false)}
                                    ></i>
                                </div>
                            </div>
                            <div className="signup-forgot-input-group">
                                <label>Confirm Password*</label>
                                <div className="signup-input-wrapper">
                                    <input type={newShowPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                                    <i
                                        className={`fa-solid ${newShowPassword ? "fa-eye" : "fa-eye-slash"}`}
                                        onMouseDown={() => setNewShowPassword(true)}
                                        onMouseUp={() => setNewShowPassword(false)}
                                        onMouseLeave={() => setNewShowPassword(false)}
                                    ></i>
                                </div>
                            </div>

                            <div className="signup-forgot-reset-buttons">
                                <button type="button" className="signup-forgot-cancel-button" onClick={() => setReset(false)}>Cancel</button>
                                <button type="submit" className="signup-forgot-update-button">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="signup-info-section">
                <div className="signup-school-branding">
                    <img src="/img/knshdlogo.png" alt="Kolehiyo Ng Subic" className="signup-school-logo" />
                    <h2 className="signup-school-name">KOLEHIYO NG SUBIC</h2>
                    <p className="signup-school-address">WFI Compound, Wawandue, Subic Zambales</p>
                </div>

                <h2 className="signup-section-title">VISION</h2>
                <p className="signup-section-text">Kolehiyo ng Subic uplifts the quality of life of the populace through effective and efficient education.</p>
                <h2 className="signup-section-title">MISSION</h2>
                <p className="signup-section-text">To develop globally competitive graduates to be active and responsible members of the community.</p>
                <h2 className="signup-section-title">GOAL</h2>
                <p className="signup-section-text">Kolehiyo ng Subic prepares students to succeed, fosters academic excellence through public education, delivers educational opportunities for students and educators to become globally competitive and active members of the community.</p>
            </div>
        </div>
    );
};

export default Signup;
