import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./student css/create.css";
import Swal from "sweetalert2";

export default function Create() {
    const navigate = useNavigate();
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

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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

        try {
            const response = await axios.post("http://localhost:2025/register", formData);

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Account Created!",
                    text: "Your account has been successfully created. Redirecting...",
                    showConfirmButton: false,
                    timer: 2000
                });

                setTimeout(() => navigate("/signup"), 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create an account.";

            if (errorMessage.includes("already registered")) {
                Swal.fire({
                    icon: "warning",
                    title: "Email Already Registered",
                    text: "The email address is already in use. Try another one.",
                    confirmButtonColor: "#ff9800"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: errorMessage,
                    confirmButtonColor: "#d33"
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
                        <strong className="important">Important:</strong> Please Fill Out the Information Below Accurately
                    </p>

                    <h3 className="section-title" style={{ fontSize: "13px" }}>Email Address</h3>
                    <p style={{ fontSize: "12px", marginTop: "-10px" }}>
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
                </div>

                <div className="rightcontainer">
                    <h2>Create An Account</h2>
                    <hr />
                    {message && <p className="message">{message}</p>}
                    {/* Display success/error message */}

                    <form onSubmit={handleSubmit}>
                        <div className="grid-container">
                            <input type="text" name="firstname" placeholder="Firstname*" className="input-field short-width" value={formData.firstname} onChange={handleChange} />
                            <input type="text" name="middlename" placeholder="Middlename" className="input-field short-width" value={formData.middlename} onChange={handleChange} />
                            <input type="text" name="lastname" placeholder="Lastname*" className="input-field short-width" value={formData.lastname} onChange={handleChange} />
                            <select name="extension" className="input-field short-width" value={formData.extension} onChange={handleChange}>
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
                            <input type="date" name="birthdate" className="input-field" value={formData.birthdate} onChange={handleChange} />
                            <input type="text" name="phone" placeholder="+63 XXX-XXX-XXXX" className="input-field" value={formData.phone} onChange={handleChange} />
                            <select name="register" className="input-field" value={formData.register} onChange={handleChange}>
                                <option value="" disabled hidden>Registering As:</option>
                                <option value="New student">New student</option>
                                <option value="Transferee">Transferee</option>
                                <option value="Second Courser">Second Courser</option>
                            </select>
                        </div>

                        <div className="grid-container">
                            <input type="email" name="email" placeholder="Email Address*" className="input-field" value={formData.email} onChange={handleChange} />
                            <input type="password" name="password" placeholder="Desired Password*" className="input-field" value={formData.password} onChange={handleChange} />
                            <input type="password" name="confirmPassword" placeholder="Confirm Password*" className="input-field" value={formData.confirmPassword} onChange={handleChange} />
                        </div>

                        <hr />
                        <p className="privacy-text" style={{ textAlign: "center" }}>
                            I have read the Kolehiyo Ng Subic General Privacy Notice at <a href="#" className="privacy-link">Kolehiyo Ng Subic Privacy Policy</a>.
                        </p>
                        <hr />

                        <div className="button-container">
                            <button className={isFormValid() ? "enabled-btn" : "disabled-btn"} disabled={!isFormValid() || loading}>
                                {loading ? "Creating Account..." : "Continue with Sign Up"}
                            </button>
                            <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
