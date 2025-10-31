import React, { useState, useEffect, use } from "react";
import { Link } from 'react-router-dom';

export default function     Data() {

    return (
        <div className="uploads">
            <div>
                <h4 >Hello There !</h4 >
                <hr style={{ background: "#333" }} />
                <p style={{ fontSize: "14px" }}>I have read the Kolehiyo Ng Subic General Privacy Notice at
                    <Link to="notice" target='_blank'><strong style={{ fontStyle: "italic", textDecoration: "underline", color: "green" }}>  @kolehiyongsubic01@gmail.com</strong> .  </Link>
                    By clicking the "Accept and Continue" button, I recognize the authority of the Kolehiyo Ng Subic
                    to process my personal and sensitive personal information, pursuant to the Kolehiyo Ng Subic General
                    Privacy Notice and applicable laws, and agree to the collection and use of information in accordance
                    with the policy stated.
                </p>
            </div>
        </div>
    )
}
