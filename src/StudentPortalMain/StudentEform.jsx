import React, { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import "./studentmain.css/ProfileEnlistmentEform.css";
import { FaFileAlt } from "react-icons/fa";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ProfileEformPage() {
    const [activeTab, setActiveTab] = useState("");
    
    const loggedInAcceptedStudent = JSON.parse(localStorage.getItem("acceptedStudent"));

    const { data: studentData, error: studentError } = useSWR(
        loggedInAcceptedStudent?.domainEmail 
            ? `${import.meta.env.VITE_API_URL}/student/by-domain/${loggedInAcceptedStudent.domainEmail}`
            : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000,
            shouldRetryOnError: false,
        }
    );

    const { data: settingsData, error: settingsError } = useSWR(
        `${import.meta.env.VITE_API_URL}/settings/`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000,
            shouldRetryOnError: false,
        }
    );

    useEffect(() => {
        if (studentData && settingsData && !activeTab) {
            const settingsArray = Array.isArray(settingsData) ? settingsData : [settingsData];
            const deptSettings = settingsArray
                .filter(s => s?.department?.toLowerCase() === studentData.department?.toLowerCase())
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (deptSettings.length) {
                setActiveTab(deptSettings[0]._id);
            }
        }
    }, [studentData, settingsData, activeTab]);

    const error = studentError || settingsError;
    const settings = Array.isArray(settingsData) ? settingsData : settingsData ? [settingsData] : [];

    if (error) return <p className="eform-error">Failed to fetch data.</p>;
    if (!studentData || settings.length === 0) return <p className="eform-loading">Loading profile...</p>;

    const documentPassword = `${studentData.lastname}${studentData.studentNumber.replace(/-/g, "")}`;

    const deptSettings = settings
        .filter(s => s?.department?.toLowerCase() === studentData.department?.toLowerCase())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const tabs = deptSettings.map(s => {
        const startYear = s?.academicYear ? s.academicYear.split("/")[0] : new Date().getFullYear();
        const endYear = parseInt(startYear) + 1;
        const year = `${startYear}-${endYear}`;
        const semester = (s?.activeSemester || "").toString().trim() || "Unknown";
        return {
            id: s._id,
            label: `${year}, ${semester} Semester`,
            setting: s
        };
    });

    const activeSetting = tabs.find(t => t.id === activeTab)?.setting;

    if (!activeSetting) return <p className="eform-error">No active semester found for your department.</p>;

    return (
        <div className="eform-page">
            <div className="eform-header">
                <FaFileAlt /> <span>Student E-Form</span>
            </div>

            <hr />

            <p className="eform-password">
                Your document password is <span className="password">{documentPassword}</span>.
                This password is confidential—please do not share it with anyone or store in unsecured locations.
            </p>

            <hr />

            <div className="eform-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`eform-tab ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="eform-content">
                <div className="eform-document">
                    <img src="/public/img/knshdlogo.png" alt="Logo" />
                    <h1>404</h1>
                    <p>Page not found</p>
                </div>
            </div>
        </div>
    );
}