import React, { useEffect, useState } from 'react';
import "./Deancss/deanlogin.css";

export default function DeanLogin() {
    const [showPassword, setShowPassword] = useState(false);

    const handleHoldStart = (e) => {
        if (e.cancelable) e.preventDefault();
        setShowPassword(true);
    };

    const handleHoldEnd = () => {
        setShowPassword(false);
    };

    useEffect(() => {
        document.title = "Kolehiyo Ng Subic - Deans Portal Login";
    }, []);

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

                            <form className="dl-input-form" onSubmit={(e) => e.preventDefault()}>
                                <fieldset className="dl-input-group">
                                    <legend className="dl-legend">Username*</legend>
                                    <div className="dl-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Enter ID"
                                            className="dl-inner-input"
                                            required
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
                                            required
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

                                <button type="submit" className="dl-login-btn">
                                    Login
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