import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h1 style={{ fontSize: "18px" }}>About KNS</h1>
                    <p style={{ fontSize: "13px" }}>
                        <span style={{ display: 'block', marginBottom: '10px' }}>
                            Kolehiyo ng Subic, or known as KNS, is the first community college in the province of Zambales.
                        </span>
                        <span style={{ display: 'block', marginBottom: '10px' }}>
                            Mayor Jeffrey D. Khonghun, the President Emeritus, is the acknowledged founder and father of the school.
                        </span>
                    </p>

                    <br />
                    <hr />
                    <br />
                    <h1 style={{ fontSize: "18px" }}>Contact Us!</h1>
                    <p style={{ fontSize: "13px",}}><i className="fa-solid fa-phone" style={{ fontSize: "15px" }}></i> (047) 232 4897</p>
                    <p style={{ fontSize: "13px" }}><i className="fa-solid fa-envelope" style={{ fontSize: "15px" }}></i> Kolehiyongsubic01@gmail.com</p>
                    <p style={{ fontSize: "13px" }}><i className="fa-solid fa-location-dot" style={{ fontSize: "15px" }}></i> 6GJ+WPX, Burgos St, Baraca, Subic, 2209 Zambales</p>
                    <br />
                    <hr />
                    <br />
                    <p style={{ fontSize: "13px" }}>Citizen's Charter</p>
                    <p style={{ fontSize: "13px" }}>Website Policy</p>
                    <p style={{ fontSize: "13px" }}>Data Privacy Policy</p>
                    <p style={{ fontSize: "13px" }}>Rights of Data Subjects </p>
                    <p style={{ fontSize: "13px" }}>Responsibilities of Data Subjects</p>
                </div>

                <div className="footer-section resources">
                    <div className="student-resources">
                        <h1 style={{ fontSize: "18px" }}>Student Resources</h1>
                        <p style={{ color: "grey", fontSize: "13px" }}>  KNSLamp</p>
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
                                        transition: "color 0.3s ease", fontSize: "13px"
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = "orange"}
                                    onMouseLeave={(e) => e.target.style.color = "white"}
                                >
                                    Student Portal
                                </p>
                            </a>
                        </Link>
                        <Link to="signup" style={{ textDecoration: "None", }}>
                            <a
                                style={{
                                    fontSize: "16px",
                                    color: "white",
                                    textDecoration: "none",
                                    cursor: "pointer", fontSize: "13px"
                                }}
                            >
                                <p
                                    style={{
                                        transition: "color 0.3s ease", fontSize: "13px"
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
                                        transition: "color 0.3s ease", fontSize: "13px"
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
                        <h1 style={{ fontSize: "18px" }}>Faculty Resources</h1>
                        <p style={{ color: "grey", fontSize: "13px" }}>KNS Lamp</p>
                        <p style={{ color: "grey", fontSize: "13px" }}>KNS Health Check</p>
                        <p style={{ color: "grey", fontSize: "13px" }}>KNS Registrar</p>
                        <p style={{ color: "grey", fontSize: "13px" }}>KNS Teachers Portal</p>
                        <p style={{ color: "grey", fontSize: "13px" }}>KNS Deans Portal</p>
                    </div>
                </div>
                <div className="footer-section social"> 
                    <h1 style={{ fontSize: "18px" }}>Connect With Us!</h1>
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
            <div className="footer-bottom" >
                <p style={{fontSize:"13px"}}>Copyright © 2025 <span className="" style={{ color: "#00ff00", fontWeight: "bold" , fontSize:"13px" }}>Kolehiyo Ng Subic</span>. All rights reserved.</p>
            </div>
        </div>
    );
}
