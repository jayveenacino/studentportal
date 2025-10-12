import React, { useState, useEffect } from "react";
import axios from "axios";
import "./studentmain.css/StudentAnnouncement.css"; // styling

export default function StudentAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get("http://localhost:2025/api/uploads");
            const data = Array.isArray(res.data) ? res.data : [];
            setAnnouncements(data);
            if (data.length > 0) setSelectedAnnouncement(data[0]);
        } catch (err) {
            console.error("Failed to fetch announcements", err);
            setAnnouncements([]);
        }
    };

    return (
        <div className="announcement-page">
            <div className="dashboard-header-stdash">
                <h1><i className="fa-solid fa-message"></i> Announcement</h1>
            </div>
            <div className="announcement-container">
                {/* LEFT: Selected announcement */}
                <div className="announcement-left-detail">
                    {selectedAnnouncement ? (
                        <>
                            {selectedAnnouncement.filename ? (
                                <img
                                    src={`http://localhost:2025/uploads/${selectedAnnouncement.filename}`}
                                    alt={selectedAnnouncement.title || "No Title"}
                                    className="announcement-image"
                                />
                            ) : (
                                <div className="no-image">No Image</div>
                            )}
                            <h3 className="announcement-title">
                                {selectedAnnouncement.title || "No Title"}
                            </h3>
                            <p className="announcement-date">
                                Date Posted:{" "}
                                {new Date(
                                    selectedAnnouncement.date ||
                                    selectedAnnouncement.createdAt ||
                                    new Date()
                                ).toLocaleDateString()}
                            </p>
                            <p className="announcement-caption">
                                {selectedAnnouncement.caption || ""}
                            </p>
                        </>
                    ) : (
                        <p>Select an announcement from the right</p>
                    )}
                </div>

                {/* RIGHT: List of all announcements */}
                <div className="announcement-right-list">
                    {announcements.length === 0 ? (
                        <p>No announcements available.</p>
                    ) : (
                        announcements.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="announcement-card"
                                onClick={() => setSelectedAnnouncement(item)}
                            >
                                <div className="announcement-small-img">
                                    {item.filename ? (
                                        <img
                                            src={`http://localhost:2025/uploads/${item.filename}`}
                                            alt={item.title || "No Title"}
                                        />
                                    ) : (
                                        <div className="no-image-small">No Image</div>
                                    )}
                                </div>
                                <div className="announcement-info">
                                    <p className="announcement-date-small">
                                        Date Posted:{" "}
                                        {new Date(
                                            item.date || item.createdAt || new Date()
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className="announcement-title-small">
                                        {item.title || "No Title"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
