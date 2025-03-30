import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h1>About KNS</h1>
                    <p>
                        Kolehiyo ng Subic, or known as KNS, is the first community college in the province of Zambales. Mayor Jeffrey D. Khonghun,
                        the President Emeritus, is the acknowledged founder and father of the school.
                    </p>
                    <br />
                    <hr />
                    <br />
                    <h1>Contact Us!</h1>
                    <p><i className="fa-solid fa-phone" style={{ fontSize: "15px" }}></i> (047) 232 4897</p>
                    <p><i className="fa-solid fa-envelope" style={{ fontSize: "15px" }}></i> Kolehiyongsubic01@gmail.com</p>
                    <p><i className="fa-solid fa-location-dot" style={{ fontSize: "15px" }}></i>    6GJ+WPX, Burgos St, Baraca, Subic, 2209 Zambales</p>
                    <br />
                    <hr />
                    <br />
                    <p>Citizen's Charter</p>
                    <p>Website Policy</p>
                    <p>Data Privacy Policy</p>
                    <p>Rights of Data Subjects </p>
                    <p>Responsibilities of Data Subjects</p>
                </div>

                <div className="footer-section resources">
                    <div className="student-resources">
                        <h1>Student Resources</h1>
                        <p style={{ color: "grey" }}>  KNSLamp</p>
                        <Link to="login" style={{ textDecoration: "None" }}>
                            <a
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    textDecoration: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <p
                                    style={{
                                        transition: "color 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = "orange"}
                                    onMouseLeave={(e) => e.target.style.color = "white"}
                                >
                                    Student Portal
                                </p>
                            </a>
                        </Link>
                        <Link to="signup" style={{ textDecoration: "None" }}>
                            <a
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    textDecoration: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <p
                                    style={{
                                        transition: "color 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = "orange"}
                                    onMouseLeave={(e) => e.target.style.color = "white"}
                                >
                                    KNS Admission
                                </p>
                            </a>
                        </Link>


                        <Link to="/" style={{ textDecoration: "None" }}>
                            <a
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    textDecoration: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <p
                                    style={{
                                        transition: "color 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = "orange"}
                                    onMouseLeave={(e) => e.target.style.color = "white"}
                                >
                                    Register
                                </p>
                            </a>
                        </Link>

                    </div>
                    <br />
                    <hr />
                    <br />
                    <div className="faculty-resources">
                        <h1>Faculty Resources</h1>
                        <p style={{ color: "grey" }}>KNS Lamp</p>
                        <p style={{ color: "grey" }}>KNS Health Check</p>
                        <p style={{ color: "grey" }}>KNS Registrar</p>
                        <p style={{ color: "grey" }}>KNS Teachers Portal</p>
                        <p style={{ color: "grey" }}>KNS Deans Portal</p>
                    </div>
                </div>
                <div className="footer-section social">
                    <h1>Connect With Us!</h1>
                    <div className="social-icons">
                        <button className="social-btn"><i className="fa-brands fa-square-facebook" style={{ fontSize: "15px" }}></i> Facebook</button>
                        <button className="social-btn"><i className="fa-brands fa-square-x-twitter" style={{ fontSize: "15px" }}></i> Twitter</button>
                        <button className="social-btn"><i className="fa-brands fa-youtube" style={{ fontSize: "15px" }}></i> YouTube</button>
                    </div>
                    <br />
                    <br />
                    <hr />
                    <div className="footer-logo">
                        <img src="/img/knshdlogo.png" alt="KNS LOGO" />
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright © 2025 <span className="" style={{ color: "#00ff00", fontWeight: "bold" }}>Kolehiyo Ng Subic</span>. All rights reserved.</p>
            </div>
        </div>
    );
}
