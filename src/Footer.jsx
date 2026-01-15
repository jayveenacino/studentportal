import React from 'react'
import { Link } from 'react-router-dom';
import "./maincss/footer.css";

export default function Footer() {
    return (
        <div className="enuique-footer">
            <div className="enuique-footer-container">
                <div className="enuique-footer-section about">
                    <h1>Contact Us!</h1>
                    <p><i className="fa-solid fa-phone"></i> (047) 232 4897</p>
                    <p><i className="fa-solid fa-envelope"></i> Kolehiyongsubic01@gmail.com</p>
                    <p><i className="fa-solid fa-location-dot"></i> 6GJ+WPX, Burgos St, Baraca, Subic, 2209 Zambales</p>

                    <hr />
                    <p>Citizen's Charter</p>
                    <p>Website Policy</p>
                    <p>Data Privacy Policy</p>
                    <p>Rights of Data Subjects</p>
                    <p>Responsibilities of Data Subjects</p>
                </div>

                <div className="enuique-footer-section resources">
                    <div className="enuique-student-resources">
                        <h1>Student Resources</h1>
                        <Link to="/login" target='_blank'><p>Student Portal</p></Link>
                        <Link to="/signup" target='_blank'><p>KNS Admission Portal</p></Link>
                        <Link to="/body"><p>Register Admission</p></Link>
                    </div>
                    <hr />
                    <div className="enuique-faculty-resources">
                        <h1>Faculty Resources</h1>
                        <p>KNS Health Check</p>
                        <p>KNS Registrar</p>
                        <p>KNS Teachers Portal</p>
                        <p>KNS Deans Portal</p>
                    </div>
                </div>

                <div className="enuique-footer-section social">
                    <h1>Connect With Us!</h1>
                    <div className="enuique-social-icons">
                        <button className="enuique-social-btn"> Facebook</button>
                        <button className="enuique-social-btn"> Email</button>
                        <button className="enuique-social-btn"> YouTube</button>
                    </div>

                    <hr />
                    <div className="enuique-footer-logo">
                        <img src="/img/knshdlogo.png" alt="KNS LOGO" />
                    </div>
                </div>
            </div>

            <div className="enuique-footer-bottom">
                <p>Copyright © 2025 <span className="enuique-highlight">Kolehiyo Ng Subic</span>. All rights reserved.</p>
            </div>
        </div>
    )
}
