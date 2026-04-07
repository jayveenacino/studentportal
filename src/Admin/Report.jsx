import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import "./Admincss/courses.css";

export default function Report() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filterType, setFilterType] = useState("all");

    const perPage = 5;

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = () => {
        axios.get(import.meta.env.VITE_API_URL + "/api/logs")
            .then(res => setLogs(res.data))
            .catch(err => console.error("Fetch error:", err));
    };

    const filtered = logs.filter(log => {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
            (log.user?.toLowerCase() || "").includes(searchLower) ||
            (log.action?.toLowerCase() || "").includes(searchLower) ||
            (log.details?.toLowerCase() || "").includes(searchLower);
        
        let matchesDate = true;
        if (startDate && endDate) {
            const logDate = new Date(log.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            matchesDate = logDate >= start && logDate <= end;
        }

        let matchesType = true;
        if (filterType !== "all") {
            matchesType = log.type === filterType;
        }

        return matchesSearch && matchesDate && matchesType;
    });

    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    const handleExport = async () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: "System Activity Report",
                        heading: HeadingLevel.TITLE,
                        spacing: { after: 400 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Generated on: ", bold: true }),
                            new TextRun(formatDate(new Date()) + " " + formatTime(new Date()))
                        ],
                        spacing: { after: 400 }
                    }),
                    new Paragraph({
                        text: "User Activity Logs",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 400, after: 200 }
                    }),
                    ...filtered.map((log, index) => {
                        const date = formatDate(log.date);
                        const time = formatTime(log.date);
                        let logText = "";
                        
                        if (log.type === "login") {
                            logText = `${log.user} Login on ${log.portal || "Student Portal"} ${date} ${time}`;
                        } else if (log.type === "admin_access") {
                            logText = `Admin, ${log.user} Access Admin Portal ${date} ${time}`;
                        } else if (log.type === "export") {
                            logText = `${log.user} export ${log.details || "eform"} ${date} ${time}`;
                        } else {
                            logText = `${log.user} ${log.action} ${date} ${time}`;
                        }

                        return new Paragraph({
                            children: [
                                new TextRun({ text: `${index + 1}. `, bold: true }),
                                new TextRun(logText)
                            ],
                            spacing: { after: 120 }
                        });
                    })
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `System_Report_${formatDate(new Date()).replace(/ /g, "_")}.docx`);
        
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Report exported successfully",
            showConfirmButton: false,
            timer: 2000
        });

        setShowModal(false);
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setFilterType("all");
        setShowModal(false);
    };

    return (
        <div className="courses-container">
            <div className="courses-header">
                <h1>Reports</h1>
                <p>View and export system activity logs.</p>
            </div>

            <div className="courses-controls">
                <input
                    className="courses-search"
                    placeholder="Search logs..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <button className="courses-add-btn" onClick={() => setShowModal(true)}>
                    Export to Word
                </button>
            </div>

            <div className="courses-table-container">
                <table className="courses-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((log, i) => (
                            <tr key={log._id || i}>
                                <td>{start + i + 1}</td>
                                <td>{log.user}</td>
                                <td>
                                    <span className={log.type === "login" ? "status-active" : log.type === "admin_access" ? "status-active" : "status-inactive"}>
                                        {log.action}
                                    </span>
                                </td>
                                <td>{log.details || "N/A"}</td>
                                <td>{formatDate(log.date)}</td>
                                <td>{formatTime(log.date)}</td>
                            </tr>
                        ))}
                        {current.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pageCount > 1 && (
                <div className="pagination-controls">
                    {Array.from({ length: pageCount }, (_, idx) => (
                        <button
                            key={idx}
                            className={`pagination-btn ${currentPage === idx + 1 ? "active" : ""}`}
                            onClick={() => setCurrentPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Export Report</h2>
                        
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Filter by Type:</label>
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ddd" }}
                        >
                            <option value="all">All Activities</option>
                            <option value="login">Login</option>
                            <option value="admin_access">Admin Access</option>
                            <option value="export">Export</option>
                            <option value="other">Other</option>
                        </select>

                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ddd" }}
                        />

                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ddd" }}
                        />

                        <div className="modal-buttons">
                            <button onClick={handleExport}>Export</button>
                            <button onClick={resetFilters}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}