import React, { useState, useEffect, useRef } from "react";
import "./studentmain.css/studentdashboard.css";

export default function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [todayEvent, setTodayEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollments, setEnrollments] = useState([]);
    const didFetch = useRef(false);

    const formatFullName = () => {
        if (!student) return "Student";
        if (student.fullName) return student.fullName;
        const { firstname, middlename, lastname, extension } = student || {};
        return `${lastname || ""} ${firstname || ""} ${middlename ? middlename.charAt(0) + "." : ""} ${extension || ""}`.trim();
    };

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
        } catch (err) {
            console.error("formatDate error:", err, dateString);
            return "-";
        }
    };

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        const storedStudent = localStorage.getItem("acceptedStudent");
        if (storedStudent) {
            try {
                setStudent(JSON.parse(storedStudent));
            } catch {
                localStorage.removeItem("acceptedStudent");
            }
        }

        fetch("http://localhost:2025/api/acceptedstudents")
            .then((res) => res.json())
            .then((data) => {
                const savedStudent = JSON.parse(localStorage.getItem("acceptedStudent"));
                let filtered = Array.isArray(data) ? data : [];

                if (savedStudent && savedStudent.email) {
                    filtered = filtered.filter(
                        (e) => e.email && e.email.toLowerCase() === savedStudent.email.toLowerCase()
                    );
                }

                const grouped = filtered.reduce((acc, e) => {
                    const key = `${e.academicYear || "N/A"}-${e.semester || "N/A"}`;
                    const curTs = e.dateEnlisted ? Date.parse(e.dateEnlisted) : Infinity;

                    if (!acc[key]) {
                        acc[key] = e;
                    } else {
                        const existingTs = acc[key].dateEnlisted ? Date.parse(acc[key].dateEnlisted) : Infinity;
                        if (curTs < existingTs) acc[key] = e;
                    }
                    return acc;
                }, {});

                const uniqueEnrollments = Object.values(grouped).sort((a, b) => {
                    const at = a.dateEnlisted ? Date.parse(a.dateEnlisted) : Infinity;
                    const bt = b.dateEnlisted ? Date.parse(b.dateEnlisted) : Infinity;
                    return at - bt;
                });

                setEnrollments(uniqueEnrollments);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching accepted students:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="student-dashboard-stdash">
            <div className="dashboard-header-stdash">
                <h1><i className="fa-solid fa-book"></i> Dashboard</h1>
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
                            ) : enrollments && enrollments.length > 0 ? (
                                enrollments.map((e) => (
                                    <tr key={e._id}>
                                        <td>{`${e.academicYear || "N/A"}, ${e.semester || ""}`}</td>
                                        <td
                                            className={
                                                e.enrollmentStatus === "Officially Enrolled"
                                                    ? "status-stdash enrolled-stdash"
                                                    : "status-stdash not-enrolled-stdash"
                                            }
                                        >
                                            {e.enrollmentStatus || "N/A"}
                                        </td>
                                        <td>{e.dateEnlisted ? formatDate(e.dateEnlisted) : "Not yet enlisted"}</td>
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
        </div>
    );
}
