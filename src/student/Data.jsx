import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Data() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="uploads">
            <div>
                <h4>Hello There!</h4>
                <hr
                    style={{
                        backgroundColor: "gray",
                        height: "1px",
                        border: "none",
                        marginTop: isMobile ? "10px" : "20px",
                        marginBottom: "20px",
                    }}
                />
                <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                    I have read the Kolehiyo ng Subic General Privacy Notice at{" "}
                    <Link to="notice" target="_blank">
                        <strong
                            style={{
                                fontStyle: "italic",
                                textDecoration: "underline",
                                color: "green",
                            }}
                        >
                            @kolehiyongsubic01@gmail.com
                        </strong>
                    </Link>
                    . By clicking the <strong>"Accept and Continue"</strong> button, I acknowledge
                    the authority of Kolehiyo ng Subic to process my personal and sensitive
                    information in accordance with the General Privacy Notice and applicable
                    laws, and I agree to the collection and use of my information as described
                    in the policy.
                </p>
            </div>
        </div>
    );
}
