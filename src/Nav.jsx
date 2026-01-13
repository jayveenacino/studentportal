import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./maincss/navbar.css";

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

    const location = useLocation();

    const toggleDropdown = (menu) => {
        setDropdownOpen(dropdownOpen === menu ? null : menu);
    };

    const toggleMobileDropdown = (menu) => {
        setMobileDropdownOpen(mobileDropdownOpen === menu ? null : menu);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest(".enuique-dropdown")) {
            setDropdownOpen(null);
        }
    };

    useEffect(() => {
        setDropdownOpen(null);
        setMobileDropdownOpen(null);
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="enuique-navwarp">
            <div className="enuique-nav-container">
                <div className="enuique-nav-left">
                    <Link to="Home">
                        <img className="enuique-navlogo" src="/img/knshdlogo.png" alt="KNS Logo" />
                    </Link>
                    <div className="enuique-nav-title">
                        <Link to="Home" style={{ textDecoration: "none" }}>
                            <h1>KOLEHIYO NG SUBIC</h1>
                        </Link>
                        <Link to="Home" style={{ textDecoration: "none" }}>
                            <p>Educasyon Tungo sa Kaunlaran</p>
                        </Link>
                    </div>
                </div>

                <div className="enuique-navcontent">
                    <Link to="/home">Home</Link>

                    <div className="enuique-dropdown">
                        <span onClick={(e) => { e.stopPropagation(); toggleDropdown("about"); }}>About Us</span>
                        {dropdownOpen === "about" && (
                            <div className="enuique-dropdown-menu">
                                <Link to="/history">History</Link>
                                <Link to="/mission">Mission & Vision</Link>
                                <Link to="/team">Team</Link>
                            </div>
                        )}
                    </div>

                    <div className="enuique-dropdown">
                        <span onClick={(e) => { e.stopPropagation(); toggleDropdown("administration"); }}>Administration</span>
                        {dropdownOpen === "administration" && (
                            <div className="enuique-dropdown-menu">
                                <Link to="/staff">Staff</Link>
                                <Link to="/departments">Departments</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/admission">Admission</Link>
                    <Link to="/research">Research and Extension</Link>
                    <Link to="/campus">Campus Life</Link>
                    <Link to="/whatsnew">What's New?</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>

                <div className="enuique-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className="fa-solid fa-bars"></i>
                </div>
            </div>

            {menuOpen && (
                <div className="enuique-mobile-dropdown-wrapper">
                    <Link to="/home">Home</Link>

                    <div className="enuique-mobile-dropdown">
                        <span onClick={() => toggleMobileDropdown("about")}>About Us</span>
                        {mobileDropdownOpen === "about" && (
                            <div className="enuique-mobile-dropdown-menu">
                                <Link to="/history">History</Link>
                                <Link to="/mission">Mission & Vision</Link>
                                <Link to="/team">Team</Link>
                            </div>
                        )}
                    </div>

                    <div className="enuique-mobile-dropdown">
                        <span onClick={() => toggleMobileDropdown("administration")}>Administration</span>
                        {mobileDropdownOpen === "administration" && (
                            <div className="enuique-mobile-dropdown-menu">
                                <Link to="/staff">Staff</Link>
                                <Link to="/departments">Departments</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/admission">Admission</Link>
                    <Link to="/research">Research and Extension</Link>
                    <Link to="/campus">Campus Life</Link>
                    <Link to="/whatsnew">Whats New?</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
            )}
        </div>
    );
};

export default Nav;
