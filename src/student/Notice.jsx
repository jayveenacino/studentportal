import React from 'react';
import "./student css/notice.css";

export default function Notice() {
    return (
        <div className="notice-container">
            <div className="headernotice">
                <img src="/img/knshdlogo.png" alt="" className="logonotice" />
                <h1 style={{color:"#006400", fontSize:"24px", margin:"0" }}>Kolehiyo Ng Subic</h1>
                <h2 style={{fontSize:"18px", color:"#444"}}>General Privacy Notice</h2>
            </div>
            <hr />
            <p style={{fontSize:"14px", lineHeight:"1.6", color:"#333"}}>
                This is Kolehiyo Ng Subic general statement on its data processing activities to notify data subjects of 
                categories of personal data processed and the purpose and extent of processing. This is not a consent form 
                but an announcement on how Kolehiyo Ng Subic processes personal data.
            </p>
            <h3 style={{fontSize:"16px",marginTop:"20px"}}>1. Acts of Processing</h3>
            <p style={{fontSize:"14px", lineHeight:"1.6", color:"#333"}}>Kolehiyo Ng Subic processes Personal Data to:</p>
            <ul style={{marginLeft:"20px",paddingLeft:"10px"}}>
                <li style={{fontSize:"14", marginBottom:"5px"}}>Perform its obligations, exercise its rights, and conduct its associated functions as:
                    <ul style={{fontSize:"14", marginBottom:"5px"}}>
                        <li style={{fontSize:"14", marginBottom:"5px"}}>An instrumentality of the government</li>
                        <li style={{fontSize:"14", marginBottom:"5px"}}>A higher education institution</li>
                    </ul>
                </li>
                <li style={{fontSize:"14", marginBottom:"5px"}}>Pursue its purposes and mandates:
                    <ul style={{fontSize:"14", marginBottom:"5px"}}>
                        <li style={{fontSize:"14", marginBottom:"5px"}}>The Higher Education Act of 1994 (Republic Act No. 7722)</li>
                        <li style={{fontSize:"14", marginBottom:"5px"}}>CHED Memorandum Order No. 32 S. 2006</li>
                        <li style={{fontSize:"14", marginBottom:"5px"}}>City Ordinance No. 07 S. 2018</li>
                    </ul>
                </li>
            </ul>
            <p style={{fontSize:"14px", lineHeight:"1.6", color:"#333"}}>
                The Gordon College website and web applications use cookies to prevent security risks, recognize that the 
                user is logged in, customize the user’s browsing experience, store authorization tokens, and permit social 
                media sharing.
            </p>
            <h3 style={{fontSize:"16px",marginTop:"20px"}}>2. Personal Data Collected</h3>
            <p style={{fontSize:"14px", lineHeight:"1.6", color:"#333"}}>Kolehiyo Ng Subic collects the following Personal Data:</p>
        </div>
    );
}
