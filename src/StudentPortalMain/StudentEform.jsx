import React, { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";
import "./studentmain.css/ProfileEnlistmentEform.css";
import { FaFileAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ProfileEformPage() {
    const [activeTab, setActiveTab] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    
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

    const { data: acceptedStudentData, error: acceptedStudentError } = useSWR(
        loggedInAcceptedStudent?.domainEmail
            ? `${import.meta.env.VITE_API_URL}/api/acceptedstudents/by-domain/${loggedInAcceptedStudent.domainEmail}`
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
        if (acceptedStudentData && settingsData && !activeTab) {
            const settingsArray = Array.isArray(settingsData) ? settingsData : [settingsData];
            const deptSettings = settingsArray
                .filter(s => s?.department?.toLowerCase() === acceptedStudentData.department?.toLowerCase())
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (deptSettings.length) {
                setActiveTab(deptSettings[0]._id);
            }
        }
    }, [acceptedStudentData, settingsData, activeTab]);

    const enrolledSubjects = acceptedStudentData?.enrolledSubjects || [];
    const documentPassword = acceptedStudentData ? `${acceptedStudentData.lastname}${acceptedStudentData.studentNumber?.replace(/-/g, "")}` : "";

    const settings = Array.isArray(settingsData) ? settingsData : settingsData ? [settingsData] : [];

    const deptSettings = settings
        .filter(s => s?.department?.toLowerCase() === acceptedStudentData?.department?.toLowerCase())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const currentSemester = acceptedStudentData?.semester || "";

    const tabs = deptSettings.map((s, index) => {
        const startYear = s?.academicYear ? s.academicYear.split("/")[0] : new Date().getFullYear();
        const endYear = parseInt(startYear) + 1;
        const year = `${startYear}-${endYear}`;
        const semester = (s?.activeSemester || acceptedStudentData?.semester || "").toString().trim() || "Unknown";
        
        const isActiveSemester = semester.toLowerCase() === currentSemester.toLowerCase();
        
        return {
            id: s._id || index,
            label: `${year}, ${semester} Semester`,
            setting: s,
            academicYear: s?.academicYear,
            activeSemester: semester,
            isActiveSemester: isActiveSemester
        };
    });

    const activeTabData = tabs.find(t => t.id === activeTab);
    const activeSetting = activeTabData?.setting;

    const totalUnits = enrolledSubjects.reduce((total, subject) => total + (subject.units || 0), 0);
    const totalTuition = enrolledSubjects.reduce((total, subject) => total + (subject.price || 0), 0);

    const generatePDF = () => {
        if (!acceptedStudentData || enrolledSubjects.length === 0) return null;

        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("CERTIFICATE OF REGISTRATION", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(`${activeTabData?.label || acceptedStudentData.academicYear || '2026/2027'}`, 105, 30, { align: "center" });
        
        doc.setFontSize(10);
        doc.text(`Student Number: ${acceptedStudentData.studentNumber}`, 20, 50);
        doc.text(`Name: ${acceptedStudentData.lastname}, ${acceptedStudentData.firstname} ${acceptedStudentData.middlename}`, 20, 58);
        doc.text(`Program: ${acceptedStudentData.initialDept}`, 20, 66);
        doc.text(`Year Level: ${acceptedStudentData.yearLevel}`, 20, 74);
        doc.text(`Status: ${acceptedStudentData.status}`, 20, 82);
        doc.text(`Semester: ${acceptedStudentData.semester || '1st Sem'}`, 20, 90);
        
        const tableData = enrolledSubjects.map(subject => [
            subject.code,
            subject.name,
            subject.units.toString(),
            `₱${(subject.price || 0).toFixed(2)}`
        ]);
        
        tableData.push(["", "TOTAL", totalUnits.toString(), `₱${totalTuition.toFixed(2)}`]);
        
        autoTable(doc, {
            startY: 100,
            head: [["Code", "Subject", "Units", "Amount"]],
            body: tableData,
            theme: "grid",
            headStyles: { fillColor: [200, 200, 200], textColor: 0 },
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 80 },
                2: { cellWidth: 20, halign: "center" },
                3: { cellWidth: 30, halign: "right" }
            }
        });
        
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;
        
        doc.setFontSize(9);
        doc.text("This is a computer-generated document.", 105, finalY + 20, { align: "center" });
        doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 105, finalY + 28, { align: "center" });
        
        return doc.output("bloburl");
    };

    useEffect(() => {
        if (isUnlocked && acceptedStudentData) {
            const url = generatePDF();
            setPdfUrl(url);
        } else {
            setPdfUrl(null);
        }
    }, [isUnlocked, acceptedStudentData, enrolledSubjects, activeTabData, totalUnits, totalTuition]);

    const error = studentError || acceptedStudentError || settingsError;
    if (error) return <p className="eform-error">Failed to fetch data.</p>;
    if (!studentData || !acceptedStudentData) return <p className="eform-loading">Loading profile...</p>;

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordInput === documentPassword) {
            setIsUnlocked(true);
            setPasswordError(false);
        } else {
            setPasswordError(true);
            setIsUnlocked(false);
        }
    };

    return (
        <div className="eform-page">
            <div className="eform-header">
                <FaFileAlt /> <span>Student E-Form</span>
            </div>

            <hr />

            <p className="eform-password">
                Your document password is <span className="password">{documentPassword}</span>.
                This password is confidential—please do not share it with anyone.
            </p>

            <hr />

            <div className="eform-tabs">
                {tabs.length > 0 ? (
                    tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`eform-tab ${tab.isActiveSemester ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsUnlocked(false);
                                setPasswordInput("");
                                setPasswordError(false);
                            }}
                        >
                            {tab.label}
                        </button>
                    ))
                ) : (
                    <button className="eform-tab active">
                        {acceptedStudentData.academicYear || '2026/2027'}, {acceptedStudentData.semester || '1st Sem'} Semester
                    </button>
                )}
            </div>

            <div className="eform-content">
                <div className="cor-container">
                    <div className="cor-header">
                        <h3>Certificate of Registration</h3>
                        <p style={{ color: '#666', margin: '5px 0 0 0' }}>
                            {activeTabData?.label || `${acceptedStudentData.academicYear || '2026/2027'}, ${acceptedStudentData.semester || '1st Sem'} Semester`}
                        </p>
                    </div>

                    {!isUnlocked ? (
                        <div className="password-protection">
                            <div className="password-box">
                                <h4>Password Required</h4>
                                <p>Enter your document password to view the Certificate of Registration</p>

                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            placeholder="Enter password"
                                            className={passwordError ? "error" : ""}
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {passwordError && (
                                        <p className="error-text">Incorrect password. Please try again.</p>
                                    )}
                                    <button type="submit" className="submit-btn">
                                        Unlock Document
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="cor-document">
                            <div className="pdf-native-viewer">
                                {pdfUrl ? (
                                    <iframe
                                        src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                                        title="Certificate of Registration"
                                        className="pdf-native-iframe"
                                    />
                                ) : (
                                    <div className="pdf-loading">
                                        <p>Generating PDF...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}