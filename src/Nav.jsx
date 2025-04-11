import React, { useState } from "react";
import { Link } from "react-router-dom";
const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="NavWarp">
            <div className="nav-container">
                <Link to="Home">
                    <img
                        className="navlogo"
                        src="/img/knshdlogo.png"
                        alt="KNS Logo"
                    />
                </Link>

                <div
                    className="nav-title"
                >
                    <Link to="Home" style={{ textDecoration: "none" }}>
                        <h1 >KOLEHIYO NG SUBIC</h1>
                    </Link>
                    <Link to="Home" style={{ textDecoration: "none" }}>
                        <p>Educasyon Tungo sa Kaunlaran</p>
                    </Link>

                </div>

                <div
                    className="navcontent"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "30px",   
                        padding: "20px",
                        marginLeft: "auto"  
                    }}
                >
                    <Link to="Home" style={{ textDecoration: "none", color: "white", fontSize: "13px" }}>Home</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}>About Us</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}>Administration</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}>Admission</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}>Research and Extension</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}>Campus Life</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}>What's New?</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}>Contact Us</Link>
                </div>

                <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <p >Home</p>
                <p >About</p>
                <p >Programs</p>
                <p >Contact</p>
            </div>
        </div>
    );
};

export default Nav;

