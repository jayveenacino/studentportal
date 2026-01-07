import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    useEffect(() => {
        document.title = "Page Not Found";
    }, []);

    return (
        <div style={styles.container}>
            <Link to="/" style={styles.wrapper}>
                <img
                    src="/img/error404.png"
                    alt="404 Not Found"
                    style={styles.image}
                />
                <span style={styles.text}>Go back to Home</span>
            </Link>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
    },
    wrapper: {
        position: "relative",
        display: "inline-block",
        textDecoration: "none",
    },
    image: {
        maxWidth: "100%",
        width: "100%",
    },
    text: {
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "#0887ffff",
        padding: "10px 16px",
        borderRadius: "6px",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer",
        marginBottom: "30px",
    },
};
