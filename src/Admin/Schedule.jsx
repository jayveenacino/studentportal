import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/schedule.css";
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";

export default function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [newSchedule, setNewSchedule] = useState({ 
        room: "", 
        subjects: "", 
        time: "", 
        instructor: "", 
        status: "Active" 
    });

    const perPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoadingSchedules(true);
            try {
                await fetchSchedules();
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSchedules(false);
            }
        };
        fetchData();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/schedules");
            setSchedules(res.data);
        } catch (err) {
            console.error("Failed to fetch schedules:", err);
        }
    };

    const filtered = schedules.filter(
        s =>
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.location.toLowerCase().includes(search.toLowerCase())
    );
    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    const handleSubmit = async () => {
        if (!newSchedule.title || !newSchedule.date || !newSchedule.time || !newSchedule.location) {
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
                    `${import.meta.env.VITE_API_URL}/api/schedules/${editId}`,
                    newSchedule
                );

                setSchedules(prev =>
                    prev.map(s => s._id === editId ? res.data : s)
                );

                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Schedule updated successfully.'
                });
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/schedules`, newSchedule);
                setSchedules([res.data, ...schedules]);
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'New schedule added.'
                });
            }

            setNewSchedule({ title: "", date: "", time: "", location: "", status: "Active" });
            setEditMode(false);
            setEditId(null);
            setShowModal(false);

        } catch (err) {
            console.error("Save error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not save the schedule.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = schedule => {
        setNewSchedule({
            title: schedule.title,
            date: schedule.date,
            time: schedule.time,
            location: schedule.location,
            status: schedule.status
        });
        setEditId(schedule._id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This schedule will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/schedules/${id}`);

            setSchedules(prev => prev.filter(s => s._id !== id));

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Schedule has been deleted.'
            });
        } catch (err) {
            console.error("Delete failed:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not delete schedule.'
            });
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditMode(false);
        setEditId(null);
        setNewSchedule({ title: "", date: "", time: "", location: "", status: "Active" });
        setIsSaving(false);
    };

    return (
        <div className="schedule-container" style={{ position: "relative" }}>
            {loadingSchedules && (
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
                        Loading Schedules...
                    </p>
                </div>
            )}

            <div className="schedule-header">
                <h1>Schedules</h1>
                <p>Manage events, meetings, and activities schedules.</p>
            </div>

            <div className="schedule-controls">
                <input
                    className="schedule-search"
                    placeholder="Search schedules…"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <button className="schedule-add-btn" onClick={() => {
                    setNewSchedule({ title: "", date: "", time: "", location: "", status: "Active" });
                    setEditMode(false);
                    setEditId(null);
                    setShowModal(true);
                }}>
                    Add Schedule
                </button>
            </div>

            <div className="schedule-table-container">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Instructor</th>
                            <th>Department</th>
                            <th>Details</th>
                            <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((s, i) => (
                            <tr key={s._id}>
                                <td>{start + i + 1}</td>
                                <td>{s.title}</td>
                                <td>{s.date}</td>
                                <td>{s.time}</td>
                                <td>{s.location}</td>
                                <td>
                                    <span className={s.status === "Active" ? "status-active" : "status-inactive"}>
                                        {s.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="action-btn edit" onClick={() => handleEdit(s)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(s._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {current.length === 0 && !loadingSchedules && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No schedules found.</td>
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
                        <h2>{editMode ? "Edit Schedule" : "Add New Schedule"}</h2>
                        <input
                            type="text"
                            placeholder="Enter Title"
                            value={newSchedule.title}
                            onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })}
                        />
                        <input
                            type="date"
                            placeholder="Enter Date"
                            value={newSchedule.date}
                            onChange={e => setNewSchedule({ ...newSchedule, date: e.target.value })}
                        />
                        <input
                            type="time"
                            placeholder="Enter Time"
                            value={newSchedule.time}
                            onChange={e => setNewSchedule({ ...newSchedule, time: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={newSchedule.location}
                            onChange={e => setNewSchedule({ ...newSchedule, location: e.target.value })}
                        />
                        <select
                            value={newSchedule.status}
                            onChange={e => setNewSchedule({ ...newSchedule, status: e.target.value })}
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