import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/report.css";
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";

export default function Report() {
    const [reports, setReports] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingReports, setLoadingReports] = useState(true);
    const [newReport, setNewReport] = useState({
        title: "",
        type: "",
        date: "",
        description: "",
        status: "Active"
    });

    const perPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoadingReports(true);
            try {
                await fetchReports();
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingReports(false);
            }
        };
        fetchData();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/reports");
            setReports(res.data);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
        }
    };

    const filtered = reports.filter(
        r =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.type.toLowerCase().includes(search.toLowerCase())
    );
    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    const handleSubmit = async () => {
        if (!newReport.title || !newReport.type || !newReport.date || !newReport.description) {
            return Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill out all fields.'
            });
        }

        setIsSaving(true);

        try {
            if (editMode) {
                const res = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/reports/${editId}`,
                    newReport
                );

                setReports(prev =>
                    prev.map(r => r._id === editId ? res.data : r)
                );

                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Report updated successfully.'
                });
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/reports`, newReport);
                setReports([res.data, ...reports]);
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'New report added.'
                });
            }

            setNewReport({ title: "", type: "", date: "", description: "", status: "Active" });
            setEditMode(false);
            setEditId(null);
            setShowModal(false);

        } catch (err) {
            console.error("Save error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not save the report.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = report => {
        setNewReport({
            title: report.title,
            type: report.type,
            date: report.date,
            description: report.description,
            status: report.status
        });
        setEditId(report._id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This report will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/reports/${id}`);

            setReports(prev => prev.filter(r => r._id !== id));

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Report has been deleted.'
            });
        } catch (err) {
            console.error("Delete failed:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not delete report.'
            });
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditMode(false);
        setEditId(null);
        setNewReport({ title: "", type: "", date: "", description: "", status: "Active" });
        setIsSaving(false);
    };

    return (
        <div className="report-container" style={{ position: "relative" }}>
            {loadingReports && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(255,255,255,0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 50,
                        flexDirection: "column",
                    }}
                >
                    <div className="spinner" />
                    <p style={{ marginTop: 15, fontWeight: "bold", color: "#006666" }}>
                        Loading Reports...
                    </p>
                </div>
            )}

            <div className="report-header">
                <h1>Reports</h1>
                <p>Manage system reports and documentation.</p>
            </div>

            <div className="report-controls">
                <input
                    className="report-search"
                    placeholder="Search reports…"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="report-table-container">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((r, i) => (
                            <tr key={r._id}>
                                <td>{start + i + 1}</td>
                                <td>{r.title}</td>
                                <td>{r.type}</td>
                                <td>{r.date}</td>
                                <td>{r.description}</td>
                                <td>
                                    <span className={r.status === "Active" ? "status-active" : "status-inactive"}>
                                        {r.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="action-btn edit" onClick={() => handleEdit(r)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(r._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {current.length === 0 && !loadingReports && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No reports found.</td>
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
                        <h2>{editMode ? "Edit Report" : "Add New Report"}</h2>
                        <input
                            type="text"
                            placeholder="Enter Title"
                            value={newReport.title}
                            onChange={e => setNewReport({ ...newReport, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Enter Type"
                            value={newReport.type}
                            onChange={e => setNewReport({ ...newReport, type: e.target.value })}
                        />
                        <input
                            type="date"
                            placeholder="Enter Date"
                            value={newReport.date}
                            onChange={e => setNewReport({ ...newReport, date: e.target.value })}
                        />
                        <textarea
                            placeholder="Enter Description"
                            value={newReport.description}
                            onChange={e => setNewReport({ ...newReport, description: e.target.value })}
                            rows="4"
                            style={{ padding: "12px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "6px", resize: "vertical" }}
                        />
                        <select
                            value={newReport.status}
                            onChange={e => setNewReport({ ...newReport, status: e.target.value })}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="modal-buttons">
                            <button onClick={handleSubmit} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button onClick={resetForm} disabled={isSaving}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}