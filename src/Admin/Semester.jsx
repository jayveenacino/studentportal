import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admincss/semester.css";

export default function Semester() {
    const [preRegister, setPreRegister] = useState(false);
    const [selectedSem, setSelectedSem] = useState("1st");
    const [originalSem, setOriginalSem] = useState("1st");
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");

    useEffect(() => {
        // Fetch global settings (pre-register)
        axios.get(import.meta.env.VITE_API_URL + "/settings").then((res) => {
            setPreRegister(res.data.preRegister);
            setSelectedSem("1st"); // default for first load
            setOriginalSem(res.data.activeSemester || "1st");
        });

        // Fetch department list
        axios.get(import.meta.env.VITE_API_URL + "/api/departments")
            .then(async (res) => {
                setDepartments(res.data);
                if (res.data.length > 0) {
                    const firstDept = res.data[0].name;
                    setSelectedDept(firstDept);
                    // Load that department’s semester
                    try {
                        const deptRes = await axios.get(`http://localhost:2025/api/settings/${firstDept}`);
                        if (deptRes.data) {
                            setSelectedSem(deptRes.data.activeSemester || "1st");
                        } else {
                            setSelectedSem("1st");
                        }
                    } catch {
                        setSelectedSem("1st");
                    }
                }
            })
            .catch((err) => console.error("Failed to fetch department:", err));
    }, []);

    const handleToggle = async () => {
        const newVal = !preRegister;
        setPreRegister(newVal);
        await axios.post(import.meta.env.VITE_API_URL + "/settings", {
            preRegister: newVal,
            activeSemester: originalSem,
        });
        Swal.fire({
            icon: "success",
            title: "Pre-Registration Updated",
            text: newVal ? "Pre-Registration is now ON" : "Pre-Registration is now OFF",
            timer: 2000,
            showConfirmButton: false,
        });
    };

    const handleSaveSemester = async () => {
        if (!selectedDept)
            return Swal.fire({
                icon: "warning",
                title: "Select Department",
                text: "Please choose a department first",
            });

        try {
            await axios.post(import.meta.env.VITE_API_URL + "/api/settings", {
                department: selectedDept,
                activeSemester: selectedSem,
                preRegister,
            });

            Swal.fire({
                icon: "success",
                title: "Settings Saved",
                text: `${selectedDept} updated to ${selectedSem} semester.`,
                timer: 2500,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Save Failed",
                text: "Could not save department settings",
            });
            console.error(err);
        }
    };

    const handleDepartmentChange = async (e) => {
        const dept = e.target.value;
        setSelectedDept(dept);

        try {
            const res = await axios.get(`http://localhost:2025/api/settings/${dept}`);
            if (res.data) {
                setSelectedSem(res.data.activeSemester || "1st");
                setPreRegister(res.data.preRegister || false);
            } else {
                // default if department has no settings yet
                setSelectedSem("1st");
            }
        } catch (err) {
            console.error("Failed to fetch settings:", err);
            setSelectedSem("1st");
        }
    };

    return (
        <div className="semester-page">
            <header className="semester-header">
                <div className="header-left">
                    <h1>Semester Settings</h1>
                    <p>Control pre-registration and choose the active semester.</p>
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

            <section className="semester-card semester-reui">
                <div className="card-header">
                    <div className="card-header-left">
                        <h2>Active Semester</h2>
                        <p>Select a department and set its semester</p>
                    </div>
                </div>

                <div className="semester-reui-form">
                    <div className="form-group">
                        <label>Department</label>
                        <select value={selectedDept} onChange={handleDepartmentChange}>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept.name}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Choose Semester</label>
                        <div className="radio-group">
                            {["1st", "2nd", "summer"].map((sem) => (
                                <label key={sem} className="radio-option">
                                    <input
                                        type="radio"
                                        name="semester"
                                        value={sem}
                                        checked={selectedSem === sem}
                                        onChange={(e) => setSelectedSem(e.target.value)}
                                    />
                                    <span>
                                        {sem === "1st"
                                            ? "1st Semester"
                                            : sem === "2nd"
                                                ? "2nd Semester"
                                                : "Summer Class"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button className="save-btn" onClick={handleSaveSemester}>
                        Save Settings
                    </button>
                </div>
            </section>
        </div>
    );
}
