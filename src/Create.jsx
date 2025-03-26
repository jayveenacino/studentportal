import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/create.css";

export default function Create() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
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

    return (
        <div className="signincontainer">
            {/* Header */}
            <div className="headersign">
                <img src="/img/knshdlogo.png" alt="Logo" className="maiinlogo" />
                <h1 className="college-name">KOLEHIYO NG SUBIC</h1>
                <p className="admission-text">STUDENT ADMISSION</p>
            </div>

            <hr className="divider" />

            {/* Main Content */}
            <div className="main-content">
                {/* Left Container */}
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

                    <h3 className="section-title" style={{ fontSize: "13px" }}>Forgot Password Verification</h3>
                    <p style={{ fontSize: "12px" }}>
                        If you forget your password, you'll be prompted to answer the verification questions you provide during registration. Please ensure that you enter accurate information for the security questions so you can easily recover your account if needed.
                    </p>
                    <p style={{ fontSize: "12px" }}>
                        Example questions may include but are not limited to: your registration number and other information.
                    </p>

                    <h3 className="section-title" style={{ fontSize: "13px" }}>Multiple Accounts</h3>
                    <p style={{ fontSize: "12px" }}>
                        Do not create multiple accounts. Submitting more than one application can result in disapproval of your application.
                    </p>

                    <p className="thank-you" style={{ fontSize: "12px" }}>
                        <strong>Thank you for your attention to these details</strong>
                    </p>
                </div>

                {/* Right Container (Form) */}
                <div className="rightcontainer">
                    <h2>Create An Account</h2>

                    <hr />

                    <div className="grid-container">
                        <input type="text" name="firstname" placeholder="Firstname*" className="input-field short-width" onChange={handleChange} />
                        <input type="text" name="middlename" placeholder="Middlename" className="input-field short-width" onChange={handleChange} />
                        <input type="text" name="lastname" placeholder="Lastname*" className="input-field short-width" onChange={handleChange} />
                        <select className="input-field short-width">
                            <option value="" disabled selected hidden>Extension</option>
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
                            className="input-field"
                            onChange={handleChange}
                            onFocus={(e) => e.target.placeholder = ""}
                            onBlur={(e) => e.target.placeholder = window.innerWidth <= 768 ? "MM/DD/YYYY" : ""}
                            placeholder={window.innerWidth <= 768 ? "MM/DD/YYYY" : ""}
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="+63 XXX-XXX-XXXX"
                            className="input-field"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <select className="input-field">
                            <option value="" disabled selected hidden>Registering As:</option>
                            <option value="">New student</option>
                            <option value="Transferee">Transferee</option>
                            <option value="Second Courser">Second Courser</option>
                        </select>
                    </div>

                    <div className="grid-container">
                        <input type="email" name="email" placeholder="Email Address*" className="input-field" onChange={handleChange} />
                        <input type="password" name="password" placeholder="Desired Password*" className="input-field" onChange={handleChange} />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password*" className="input-field" onChange={handleChange} />
                    </div>

                    <hr />

                    <p className="privacy-text" style={{ textAlign: "center" }}>
                        I have read the Kolehiyo Ng Subic General Privacy Notice at{" "}
                        <a href="#" className="privacy-link">
                            Kolehiyo Ng Subic Privacy Policy
                        </a>.
                    </p>
                    <hr />

                    <div className="button-container">
                        <button
                            className={isFormValid() ? "enabled-btn" : "disabled-btn"}
                            disabled={!isFormValid()}
                        >
                            Continue with Sign Up
                        </button>
                        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
