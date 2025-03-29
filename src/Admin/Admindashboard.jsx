import React, { useState } from 'react';
import './Admincss/admin.css';
import { Link } from 'react-router-dom';

export default function Admindashboard() {

    //taenayan
    return (
        <div>
            <div className="adcontainer">
                <div className="adnav">
                    <img className="adlogo" src="./img/knshdlogo.png" style={{ height: "45px" }} alt="Logo" />
                    <div className="adnav-text">
                        <h1>Kolehiyo Ng Subic</h1>
                        <p>Management Information Systems Unit</p>
                    </div>
                    <i className="fa-solid fa-bars menu-icon"></i>
                </div>
                <div className='adsidebar' style={{ display: "flex", flexDirection: "column" }}>
                    <a href="#">asdasda</a>
                    <a href="#">asdasda</a>
                    <a href="#">asdasda</a>
                    <a href="#">asdasda</a>
                    <a href="#">asdasda</a>
                    <a href="#">asdasda</a>
                </div>
            </div>
        </div>
    );
}