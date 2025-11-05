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
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px", }}
                        onMouseEnter={(e) => e.target.style.color = "orange"}
                        onMouseLeave={(e) => e.target.style.color = "white"}
                    >Home</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}
                        onMouseEnter={(e) => e.target.style.color = "orange"}
                        onMouseLeave={(e) => e.target.style.color = "white"}>About Us</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}
                        onMouseEnter={(e) => e.target.style.color = "orange"}
                        onMouseLeave={(e) => e.target.style.color = "white"}>Administration</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}
                        onMouseEnter={(e) => e.target.style.color = "orange"}
                        onMouseLeave={(e) => e.target.style.color = "white"}>Admission</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}
                        onMouseEnter={(e) => e.target.style.color = "orange"}
                        onMouseLeave={(e) => e.target.style.color = "white"}>Research and Extension</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}
                        onMouseEnter={(e) => e.target.style.color = "orange"}
                        onMouseLeave={(e) => e.target.style.color = "white"}>Campus Life</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}
                        onMouseEnter={(e) => e.target.style.color = "orange"}
                        onMouseLeave={(e) => e.target.style.color = "white"}>What's New?</Link>
                    <Link style={{ textDecoration: "none", color: "white", fontSize: "13px" }}
                        onMouseEnter={(e) => e.target.style.color = "orange"}
                        onMouseLeave={(e) => e.target.style.color = "white"}>Contact Us</Link>
                </div>
                <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    <i class="fa-solid fa-bars"></i>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <Link to="Home" style={{ textDecoration: "none", color: "white", fontSize: "16px" }}>Home</Link>
                <Link style={{ textDecoration: "none", color: "white", fontSize: "16px",marginTop:"14px" }}>About Us</Link>
                <Link style={{ textDecoration: "none", color: "white", fontSize: "16px",marginTop:"14px" }}>Administration</Link>
                <Link style={{ textDecoration: "none", color: "white", fontSize: "16px",marginTop:"14px" }}>Admission</Link>
                <Link style={{ textDecoration: "none", color: "white", fontSize: "16px",marginTop:"14px" }}>Research and Extension</Link>
                <Link style={{ textDecoration: "none", color: "white", fontSize: "16px",marginTop:"14px" }}>Campus Life</Link>
                <Link style={{ textDecoration: "none", color: "white", fontSize: "16px",marginTop:"14px" }}>Whats New?</Link>
                <Link style={{ textDecoration: "none", color: "white", fontSize: "16px",marginTop:"14px" }}>Contact Us</Link>
            </div>
        </div>
    );
};

export default Nav;

