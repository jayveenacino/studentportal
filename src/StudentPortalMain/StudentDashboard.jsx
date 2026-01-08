import React, { useState, useEffect, useRef } from "react";
import "./studentmain.css/studentdashboard.css";

export default function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollments, setEnrollments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const didFetch = useRef(false);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const raw = String(dateString).split("T")[0];
            const [year, month, day] = raw.split("-");
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            return `${monthNames[parseInt(month, 10) - 1]} ${String(day).padStart(2, "0")}, ${year}`;
        } catch {
            return "-";
        }
    };

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        const storedStudent = localStorage.getItem("acceptedStudent");
        if (!storedStudent) {
            setLoading(false);
            return;
        }

        const parsed = JSON.parse(storedStudent);
        setStudent(parsed);

        const email = parsed.domainEmail;

        fetch(`http://localhost:2025/api/enrollment-status/${email}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {

                    const semesterOrder = { First: 1, Second: 2, Summer: 3 };
                    const sorted = data.sort((a, b) => {
                        if (a.academicYear === b.academicYear) {
                            return (semesterOrder[a.semester] || 99) - (semesterOrder[b.semester] || 99);
                        }
                        return b.academicYear.localeCompare(a.academicYear);
                    });
                    setEnrollments(sorted);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching enrollment status:", err);
                setLoading(false);
            });
    }, []);

    const handleOpenModal = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEnrollment(null);
    };

    const handleProceed = () => {
        console.log("Proceeding with enrollment for:", selectedEnrollment);
        setShowModal(false);
        alert("Enrollment process started!");
    };

    return (
        <div className="student-dashboard-stdash">
            <div className="dashboard-header-stdash">
                <h1><i className="fa-solid fa-book"></i> Student Dashboard</h1>
            </div>

            <div className="dashboard-grid-stdash">
                <div className="card-stdash enrollment-desc-stdash">
                    <h2>Enrollment Status Description</h2>
                    <table className="table-stdash">
                        <thead>
                            <tr><th>Enrollment Status</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>For Enlistment</td><td>You are not done with the Enlistment Process</td></tr>
                            <tr><td>Enlisted, For Scheduling</td><td>You are already done with the Enlistment Process. Waiting for schedule</td></tr>
                            <tr><td>Scheduled</td><td>Schedule given by coordinator, waiting for registrar approval</td></tr>
                            <tr><td>Officially Enrolled</td><td>Your enrollment has been approved by the registrar</td></tr>
                            <tr><td>Open for Enrollment</td><td>The semester is open and you can now start enrolling</td></tr>
                            <tr><td>Pending</td><td>You have submitted your requirements and are waiting for approval</td></tr>
                            <tr><td>Will Not Enroll</td><td>You marked yourself as not enrolling OR failed to complete enlistment</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="card-stdash enrollment-history-stdash">
                    <h2>Enrollment History</h2>
                    <table className="table-stdash">
                        <thead>
                            <tr>
                                <th>Academic Year/Semester</th>
                                <th>Enrollment Status</th>
                                <th>Date Enlisted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <>
                                    {[...Array(3)].map((_, i) => (
                                        <tr key={i}>
                                            <td><div className="skeleton skeleton-text"></div></td>
                                            <td><div className="skeleton skeleton-text"></div></td>
                                            <td><div className="skeleton skeleton-text"></div></td>
                                        </tr>
                                    ))}
                                </>
                            ) : enrollments.length > 0 ? (
                                enrollments.map((e, i) => (
                                    <tr key={i}>
                                        <td>{`${e.academicYear || "N/A"}, ${e.semester || ""}`}</td>
                                        <td
                                            className={
                                                e.enrollmentStatus === "Officially Enrolled"
                                                    ? "status-stdash enrolled-stdash"
                                                    : e.enrollmentStatus === "Open for Enrollment"
                                                        ? "status-stdash open-stdash clickable-status"
                                                        : e.enrollmentStatus === "Pending"
                                                            ? "status-stdash pending-stdash"
                                                            : (e.enrollmentStatus && e.enrollmentStatus.includes("Not Enlisted"))
                                                                ? "status-stdash not-enrolled-stdash"
                                                                : "status-stdash"
                                            }
                                            onClick={() =>
                                                e.enrollmentStatus === "Open for Enrollment" && handleOpenModal(e)
                                            }
                                        >
                                            {e.enrollmentStatus || "N/A"}
                                        </td>
                                        <td>
                                            {e.enrollmentStatus === "Open for Enrollment"
                                                ? "Pending"
                                                : e.dateEnlisted
                                                    ? formatDate(e.dateEnlisted)
                                                    : "Not yet enlisted"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3">No enrollment history found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card-stdash inbox-stdash">
                    <h2>Inbox</h2>
                    <div className="inbox-empty-stdash">
                        <i className="fa-solid fa-envelope"></i>
                        <p>You have no messages at this moment</p>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Open for Enrollment</h3>
                        <p>
                            You are eligible to enroll for{" "}
                            <strong>{selectedEnrollment?.academicYear}, {selectedEnrollment?.semester}</strong>.
                        </p>
                        <p>Would you like to proceed with enrollment?</p>

                        <div className="modal-buttons">
                            <button className="btn-proceed" onClick={handleProceed}>Proceed</button>
                            <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
