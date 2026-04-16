import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStudentData } from "../hooks/useStudentData";
import "./studentmain.css/profileenlistment.css"; 

export default function ProfileEnlistment() {
    const [activeSection, setActiveSection] = useState("dataStatement");
    
    const loggedInAcceptedStudent = JSON.parse(
        localStorage.getItem("acceptedStudent")
    );

    const identifier = loggedInAcceptedStudent?.domainEmail || loggedInAcceptedStudent?.studentNumber;
    const type = loggedInAcceptedStudent?.domainEmail ? 'email' : 'number';

    const { studentData, isLoading, error } = useStudentData(identifier, type);

    const goToSection = (sectionName) => {
        setActiveSection(sectionName);
    };
    
    const toggleSection = (section) => {
        setActiveSection(section);
    };

    if (error) return <p className="prolist-error">{error}</p>;
    if (isLoading) return <p className="prolist-loading">Loading profile...</p>;
    if (!studentData) return <p className="prolist-error">No student data found.</p>;

    const renderCircleContent = (section, number, icon) => {
        return activeSection === section ? (
            <i className={`fa-solid ${icon}`}></i>
        ) : (
            number
        );
    };

    return (
        <div className="student-dashboard-stdash">
            <div className="dashboard-header-stdash">
                <h1><i className="fa-solid fa-book"></i> Profile / Enlistment</h1>
                <p>This section is for updating your profile and enlistment at Kolehiyo ng Subic Student Portal.
                    You must accomplish the forms first before proceeding with the enlistment.
                    The information to be gathered includes personal information, educational background,
                    and family background. After completing all the required (*) information,
                    you may proceed to the enlistment, which is the final step of the process.</p>
            </div>

            <div className="prolist-profile-header">
                <div className="prolist-profile-image">
                    {studentData?.image ? (
                        <img src={studentData.image} alt="Student" />
                    ) : (
                        <div className="prolist-no-image">No Image</div>
                    )}
                </div>

                <div className="prolist-profile-grid-info">
                    <div className="prolist-info-item">
                        <strong>Student Number</strong>
                        <span>{studentData?.studentNumber || "N/A"}</span>
                    </div>

                    <div className="prolist-info-item">
                        <strong>Full Name</strong>
                        <span style={{ textTransform: "uppercase" }}>
                            {`${studentData?.lastname}, ${studentData?.firstname} ${studentData?.middlename || ""}`}
                        </span>
                    </div>

                    <div className="prolist-info-item">
                        <strong>College/Program</strong>
                        <span>{studentData?.initialDept || "N/A"}</span>
                    </div>

                    <div className="prolist-info-item">
                        <strong>Email Address (Domain)</strong>
                        <span>{studentData?.domainEmail || "N/A"}</span>
                    </div>

                    <div className="prolist-info-item">
                        <strong>Alternate Email Address (Personal)</strong>
                        <span>{studentData?.email || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className="studentpanelbar">
                <div className="studentpanelbar-item">
                    <button
                        onClick={() => goToSection("dataStatement")}
                        className={`prolist-icon-header ${activeSection === "dataStatement" ? "active" : ""}`}
                    >
                        <div className="prolist-icon-circle">
                            {renderCircleContent("dataStatement", "1", "fa-shield-alt")}
                        </div>
                        DATA PRIVACY STATEMENT
                    </button>

                    {activeSection === "dataStatement" && (
                        <div className="studentpanelbar-content">
                            <p>
                                I have read the Kolehiyo Ng Subic General Privacy Notice at <Link className="studentlink">@kolehiyongsubic01@gmail.com</Link>.
                                By clicking the "Accept and Continue" button, I recognize the authority of the Kolehiyo Ng Subic
                                to process my personal and sensitive personal information, pursuant to the Kolehiyo Ng Subic General
                                Privacy Notice and applicable laws, and agree to the collection and use of information in accordance
                                with the policy stated.
                            </p>
                            <hr />
                            <div className="btn-container">
                                <button onClick={() => goToSection("personalInfo")}>
                                    Accept and Continue <i className="fa-solid fa-forward-step"></i>
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                <div className="studentpanelbar-item">
                    <button
                        onClick={() => goToSection("personalInfo")}
                        className={`prolist-icon-header ${activeSection === "personalInfo" ? "active" : ""}`}
                    >
                        <div className="prolist-icon-circle">
                            {renderCircleContent("personalInfo", "2", "fa-user")}
                        </div>
                        PERSONAL INFORMATION
                    </button>

                    {activeSection === "personalInfo" && (
                        <div className="persnalinfolist">
                            <div className="studentpanelbar-content prolist-grid-2">
                                <p><strong>Birthdate:</strong> {studentData?.birthdate || "N/A"}</p>
                                <p><strong>Sex:</strong> {studentData?.sex || "N/A"}</p>
                                <p><strong>Civil Status:</strong> {studentData?.civil || "N/A"}</p>
                                <p><strong>Religion:</strong> {studentData?.religion || "N/A"}</p>
                                <p><strong>Citizenship:</strong> {studentData?.citizenship || "N/A"}</p>
                                <p><strong>Address:</strong> {`${studentData?.barangay}, ${studentData?.city}, ${studentData?.province}`}</p>
                            </div>
                            <hr />
                            <div className="btn-container-save">
                                <button onClick={() => goToSection("education")}>
                                    Save and Continue <i className="fa-solid fa-forward-step"></i>
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                <div className="studentpanelbar-item">
                    <button
                        onClick={() => goToSection("education")}
                        className={`prolist-icon-header ${activeSection === "education" ? "active" : ""}`}
                    >
                        <div className="prolist-icon-circle">
                            {renderCircleContent("education", "3", "fa-school")}
                        </div>
                        EDUCATIONAL BACKGROUND
                    </button>

                    {activeSection === "education" && (
                        <div className="studentpanelbar-content prolist-grid-2">
                                <p><strong>Elementary:</strong> {studentData?.elementary || "N/A"} ({studentData?.elemYear || "N/A"})</p>
                                <p><strong>High School:</strong> {studentData?.highschool || "N/A"} ({studentData?.highYear || "N/A"})</p>
                                <p><strong>Strand:</strong> {studentData?.strand || "N/A"}</p>
                                <p><strong>Scholarship:</strong> {studentData?.scholar || "N/A"}</p>
                        </div>
                    )}
                </div>

                <div className="studentpanelbar-item">
                    <button
                        onClick={() => goToSection("family")}
                        className={`prolist-icon-header ${activeSection === "family" ? "active" : ""}`}
                    >
                        <div className="prolist-icon-circle">
                            {renderCircleContent("family", "4", "fa-people-roof")}
                        </div>
                        FAMILY INFORMATION
                    </button>

                    {activeSection === "family" && (
                        <div className="studentpanelbar-content prolist-grid-2">
                                <p><strong>Parent/Guardian:</strong> {studentData?.parentName || "N/A"}</p>
                                <p><strong>Contact:</strong> {studentData?.parentContact || "N/A"}</p>
                        </div>
                    )}
                </div>

                <div className="studentpanelbar-item">
                    <button
                        onClick={() => goToSection("updateProfile")}
                        className={`prolist-icon-header ${activeSection === "updateProfile" ? "active" : ""}`}
                    >
                        <div className="prolist-icon-circle">
                            {renderCircleContent("updateProfile", "5", "fa-pen-to-square")}
                        </div>
                        UPDATE PROFILE
                    </button>

                    {activeSection === "updateProfile" && (
                        <div className="studentpanelbar-content">
                            <p>You can update your personal details through the student portal.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}