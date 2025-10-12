import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admincss/semester.css";

export default function Semester() {
    const [preRegister, setPreRegister] = useState(false);
    const [selectedSem, setSelectedSem] = useState("1st");
    const [originalSem, setOriginalSem] = useState("1st");

    useEffect(() => {
        axios.get("http://localhost:2025/settings").then((res) => {
            setPreRegister(res.data.preRegister);
            setSelectedSem(res.data.activeSemester);
            setOriginalSem(res.data.activeSemester);
        });
    }, []);

    const handleToggle = async () => {
        const newVal = !preRegister;
        setPreRegister(newVal);
        await axios.post("http://localhost:2025/settings", {
            preRegister: newVal,
            activeSemester: originalSem,
        });
    };

    const handleSaveSemester = async () => {
        await axios.post("http://localhost:2025/settings", {
            preRegister,
            activeSemester: selectedSem,
        });
        setOriginalSem(selectedSem);
        alert("Active Semester updated!");
    };

    return (
        <div className="semester-page">
            <header className="semester-header">
                <div className="header-left">
                    <h1>Semester Settings</h1>
                    <p>Control pre-registration and choose the active semester.</p>
                </div>

                <div className="active-semester-badge">
                    Active Semester:
                    <span className="badge">
                        {originalSem === "1st"
                            ? "1st Semester"
                            : originalSem === "2nd"
                                ? "2nd Semester"
                                : "Summer Class"}
                    </span>
                </div>
            </header>

            <section className="semester-card">
                <div className="card-header">
                    <div className="card-header-left">
                        <h2>Pre-Registration</h2>
                        <p>Enable or disable pre-registration globally.</p>
                    </div>
                </div>
                <div className="toggle-row">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={preRegister}
                            onChange={handleToggle}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="switch-label">
                        {preRegister ? "Pre-Registration ON" : "Pre-Registration OFF"}
                    </span>
                </div>
            </section>

            <section className="semester-card">
                <div className="card-header">
                    <div className="card-header-left">
                        <h2>Active Semester</h2>
                        <p>Select which semester is currently active.</p>
                    </div>
                    <button className="save-semester-btn" onClick={handleSaveSemester}>
                        Save
                    </button>
                </div>

                <div className="semester-options">
                    {["1st", "2nd", "summer"].map((sem) => (
                        <label key={sem}>
                            <input
                                type="radio"
                                name="semester"
                                value={sem}
                                checked={selectedSem === sem}
                                onChange={(e) => setSelectedSem(e.target.value)}
                            />
                            {sem === "1st"
                                ? "1st Semester"
                                : sem === "2nd"
                                    ? "2nd Semester"
                                    : "Summer Class"}
                        </label>
                    ))}
                </div>
            </section>
        </div>
    );
}
