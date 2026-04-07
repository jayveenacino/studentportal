import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./student css/create.css";
import Swal from "sweetalert2";
import useAdmin from "../Admin/useAdmin";

export default function Create() {
    const { setUser } = useAdmin();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstname: "",
        middlename: "",
        lastname: "",
        extension: "",
        birthdate: "",
        phone: "",
        register: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        document.title = "Kolehiyo Ng Subic - Create Account"
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            let numericValue = value.replace(/\D/g, "");
            if (numericValue.startsWith("0")) numericValue = numericValue.slice(1);
            numericValue = numericValue.slice(0, 10);

            let formattedPhone = numericValue
                .replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3")
                .replace(/^(\d{3})(\d{3})$/, "$1-$2");

            setFormData({ ...formData, phone: formattedPhone });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const isFormValid = () => {
        return (
            formData.firstname.trim() !== "" &&
            formData.lastname.trim() !== "" &&
            formData.birthdate.trim() !== "" &&
            formData.phone.trim() !== "" &&
            formData.email.trim() !== "" &&
            formData.password.trim() !== "" &&
            formData.confirmPassword.trim() !== "" &&
            formData.password === formData.confirmPassword
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // --- NEW MIDDLE NAME VALIDATION ---
        // This regex checks if the middlename is just 1 letter or 1 letter plus a dot (e.g., "M" or "M.")
        const initialRegex = /^[A-Za-z]\.?$/;
        if (formData.middlename.trim() !== "" && initialRegex.test(formData.middlename.trim())) {
            Swal.fire({
                icon: "error",
                title: "Invalid Middle Name",
                text: "Please enter your full middle name, not just initials (e.g., 'Manalo' instead of 'M.').",
                confirmButtonColor: "#3085d6",
            });
            setLoading(false);
            return;
        }
        // ----------------------------------

        Swal.fire({
            title: "PLEASE WAIT",
            text: "Creating your account...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const bannedList = [
            "123", "1234", "12345", "123456", "password", "password123",
            "username", "user", "user123", "admin", "test", "qwerty",
            "abc123", "guest", "default", "letmein"
        ];

        const usernameCheck = `${formData.firstname}${formData.lastname}`.toLowerCase();
        const passwordCheck = formData.password.toLowerCase();

        if (bannedList.some(item => usernameCheck.includes(item) || passwordCheck.includes(item))) {
            Swal.close();
            Swal.fire({
                toast: true,
                icon: "error",
                title: "Default Credentials Detected!",
                text: "Your password uses a default. Please choose a stronger one.",
                position: "top-end",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + "/register",
                formData
            );

            if (response.status === 201) {
                Swal.close();

                Swal.fire({
                    icon: "success",
                    title: "Account Created!",
                    text: "Redirecting to main page...",
                    timer: 2000,
                    showConfirmButton: false
                });

                localStorage.setItem("user", JSON.stringify(response.data.student));
                setUser(response.data.student);

                setTimeout(() => {
                    navigate("/preregister");
                }, 2000);
            }
        } catch (error) {
            Swal.close();

            const errorMessage =
                error.response?.data?.message || "Failed to create an account.";
            const existingUser = error.response?.data?.existingUser;

            if (existingUser) {
                const nameMismatch =
                    existingUser.firstname !== formData.firstname ||
                    existingUser.middlename !== formData.middlename ||
                    existingUser.lastname !== formData.lastname;

                Swal.fire({
                    toast: true,
                    icon: nameMismatch ? "error" : "warning",
                    title: nameMismatch ? "Name Mismatch Detected" : "Already Registered",
                    text: nameMismatch
                        ? "The email or phone number is already registered with a different name."
                        : "This email or phone is already registered with the same name.",
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    toast: true,
                    icon: "error",
                    title: "Registration Failed",
                    text: errorMessage,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true
                });
            }
        }

        setLoading(false);
    };


    return (
        <div className="signincontainer">
            <div className="headersign">
                <img src="/img/knshdlogo.png" alt="Logo" className="maiinlogo" />
                <h1 className="college-name">KOLEHIYO NG SUBIC</h1>
                <p className="admission-text">STUDENT ADMISSION</p>
            </div>

            <hr className="divider" />

            <div className="main-content">
                <div className="leftcontainer">
                    <p style={{ fontSize: "12px" }}>
                        <strong className="important">Important:</strong> Please Fill Out the Information Accurately
                    </p>

                    <h3 className="section-title" style={{ fontSize: "13px" }}>Email Address</h3>
                    <p style={{ fontSize: "12px", marginTop: "10px" }}>
                        Enter a valid and existing email address. This will be our secondary means of communication and will be used as an alternate contact for scheduling and interview.
                    </p>
                    <p className="note" style={{ fontSize: "13px" }}>
                        <em>Note: Please double-check your email to ensure it is correct</em>
                    </p>

                    <h3 className="section-title" style={{ fontSize: "13px" }}>Account Credentials</h3>
                    <p style={{ fontSize: "12px" }}>
                        Make sure to remember your username and password. These credentials will be required to access your application, view updates, and schedule your interview.
                    </p>
                    <p className="security-warning" style={{ fontSize: "12px" }}>
                        <em>For your security, do not share your login information with others</em>
                    </p>

                    <h3 className="section-title" style={{ fontSize: "13px" }}>Forgot Password Verification</h3>
                    <p style={{ fontSize: "12px" }}>
                        If you forget your password, you will need to answer your verification questions. Provide accurate information to ensure easy account recovery.
                    </p>

                    <h3 className="section-title" style={{ fontSize: "13px" }}>Document Upload</h3>
                    <p style={{ fontSize: "12px" }}>
                        Upload only clear and valid documents as required. Make sure all files are complete and readable to avoid delays in your application.
                    </p>

                    <h3 className="section-title" style={{ fontSize: "13px" }}>Multiple Accounts</h3>
                    <p style={{ fontSize: "12px" }}>
                        Do not create multiple accounts. Submitting more than one application may result in disapproval.
                    </p>
                </div>

                <div className="rightcontainer">
                    <h2>Create An Account</h2>
                    <hr />
                    {message && <p className="message">{message}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid-container">
                            <input
                                type="text"
                                name="firstname"
                                autoComplete="given-name"
                                placeholder="Firstname*"
                                className="input-field short-width"
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="middlename"
                                autoComplete="additional-name"
                                placeholder="Middlename"
                                className="input-field short-width"
                                value={formData.middlename}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="lastname"
                                autoComplete="family-name"
                                placeholder="Lastname*"
                                className="input-field short-width"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                            <select
                                name="extension"
                                className="input-field short-width"
                                value={formData.extension}
                                onChange={handleChange}
                            >
                                <option value="" disabled hidden>Extension</option>
                                <option value="">None</option>
                                <option value="Sr">Sr</option>
                                <option value="Jr">Jr</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                                <option value="V">V</option>
                            </select>
                        </div>

                        <div className="grid-container">
                            <input
                                type="date"
                                name="birthdate"
                                autoComplete="bday"
                                className="input-field"
                                value={formData.birthdate}
                                onChange={handleChange}
                            />
                            <input
                                type="tel"
                                name="phone"
                                autoComplete="tel"
                                placeholder="+63 XXX-XXX-XXXX"
                                className="input-field"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <select
                                name="register"
                                className="input-field"
                                value={formData.register}
                                onChange={handleChange}
                            >
                                <option value="" disabled hidden>Registering As:</option>
                                <option value="New student">New student</option>
                                <option value="Transferee">Transferee</option>
                                <option value="Second Courser">Second Courser</option>
                            </select>
                        </div>

                        <div className="grid-container">
                            <div className="input-row">
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="Email Address*"
                                        className="input-field"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="input-wrapper">
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="Password*"
                                        className="input-field"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <i
                                        className={`fas ${showPasswords ? "fa-eye" : "fa-eye-slash"} toggle-eye`}
                                        onMouseDown={() => setShowPasswords(true)}
                                        onMouseUp={() => setShowPasswords(false)}
                                        onMouseLeave={() => setShowPasswords(false)}
                                        onTouchStart={() => setShowPasswords(true)}
                                        onTouchEnd={() => setShowPasswords(false)}

                                    ></i>
                                </div>

                                <div className="input-wrapper">
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        name="confirmPassword"
                                        autoComplete="new-password"
                                        placeholder="Confirm Password*"
                                        className="input-field"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <i
                                        className={`fas ${showPasswords ? "fa-eye" : "fa-eye-slash"} toggle-eye`}
                                        onMouseDown={() => setShowPasswords(true)}
                                        onMouseUp={() => setShowPasswords(false)}
                                        onMouseLeave={() => setShowPasswords(false)}
                                        onTouchStart={() => setShowPasswords(true)}
                                        onTouchEnd={() => setShowPasswords(false)}

                                    ></i>
                                </div>
                            </div>
                        </div>


                        <hr />
                        <p className="privacy-text" style={{ textAlign: "center" }}>
                            <input type="checkbox" required /> I have read the Kolehiyo Ng Subic General Privacy Notice at <Link to='notice' target='_blank' className="privacy-link">Kolehiyo Ng Subic Privacy Policy.</Link>
                        </p>
                        <hr />

                        <div className="button-container">
                            <button
                                type="submit"
                                className={isFormValid() ? "enabled-btn" : "disabled-btn"}
                                disabled={!isFormValid() || loading}
                            >
                                {loading ? "Creating Account..." : "Continue with Sign Up"}
                            </button>
                            <button type="button" className="back-btn" onClick={() => navigate(-1)}>Back</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}