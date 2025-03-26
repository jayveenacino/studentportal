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
                {/* Hamburger Menu Button */}
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

