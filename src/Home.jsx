import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const videoRef = useRef(null);

    const newsArticles = [
        {
            title: "HIV/AIDS Awareness Seminar on March 5, 2025",
            description:
                "To promote health education and prevention, Kolehiyo ng Subic held an HIV/AIDS Awareness Seminar on March 5, 2025, at the Subic Sports Complex Function Hall. The event featured Lester L. Ragadio, RN, MAN, LPT, MAEd, MPA, who provided crucial insights on HIV/AIDS, including transmission, prevention, early detection, and the need to combat stigma.",
            image: "/img/HIV.jpg",
        },
        {
            title: "Oathtaking Ceremony of Newly Appointed",
            description:
                "The Kolehiyo Ng Subic Family warmly congratulates Dr. Rosely H. Agustin as she took her oath as the Full Pledged College President of the institution. Dr. Rosely was known as one of the pioneers of KNS and signified her love for the college countless times by her dedication and hard work.",
            image: "/img/college-pres.png",
        },
    ];

    useEffect(() => {
        const handleUserInteraction = () => {
            if (videoRef.current) {
                videoRef.current.play().catch((err) => console.log("Play failed:", err));
            }
            window.removeEventListener("click", handleUserInteraction);
        };

        window.addEventListener("click", handleUserInteraction);
        return () => window.removeEventListener("click", handleUserInteraction);
    }, []);

    return (
        <div className="news-section">
            <div className="homediv">
                <img className="home-header" src="/img/bghome.png" alt="" />
                <h2>Kolehiyo Ng Subic</h2>
            </div>

            <hr style={{ background: "grey", marginBottom: "45px" }} />

            <div className="image-row">
                <Link to="home/collegepresident" target="blank_" className="image-item">
                    <img src="/img/MaamRosely.png" alt="" />
                    <p>Office of the College President</p>
                </Link>

                <a href="#" className="image-item">
                    <img src="/img/MaamHas.png" alt="" />
                    <p>Office of Student Affairs</p>
                </a>

                <a href="#" className="image-item">
                    <img src="/img/REG.png" alt="" />
                    <p>College Registrar</p>
                </a>
            </div>

            <hr style={{ background: "grey", marginBottom: "45px" }} />

            <h2 className="news-title">LATEST NEWS</h2>

            <div className="news-grid">
                {newsArticles.map((article, index) => (
                    <div className="news-card" key={index}>
                        <img src={article.image} alt={article.title} className="news-image" />
                        <div className="news-content">
                            <h3 className="news-heading">{article.title}</h3>
                            <p className="news-description">{article.description}</p>
                            <button className="news-button">READ MORE...</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
