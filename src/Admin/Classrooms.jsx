import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";
import "./Admincss/classrooms.css";

export default function Classrooms() {
    const [classrooms, setClassrooms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [loadingClassrooms, setLoadingClassrooms] = useState(true);

    const perPage = 5;

    const [newClassroom, setNewClassroom] = useState({
        room: "",
        department: ""
    });

    const filtered = classrooms.filter(
        c => {
            const matchesSearch = c.room.toLowerCase().includes(search.toLowerCase());
            const matchesDept = deptFilter === '' || c.department === deptFilter;
            return matchesSearch && matchesDept;
        }
    );
    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    const fetchClassrooms = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/classrooms");
            setClassrooms(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/departments");
            setDepartments(res.data);
        } catch (err) {
            console.error("Department fetch error:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoadingClassrooms(true);
            try {
                await fetchClassrooms();
                await fetchDepartments();
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingClassrooms(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!newClassroom.room || !newClassroom.department) {
            return Swal.fire(
                "Missing Fields",
                "Room and Department are required.",
                "warning"
            );
        }

        setIsSaving(true);

        try {
            if (editMode && editId) {
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/classrooms/${editId}`,
                    newClassroom
                );
                Swal.fire("Updated", "Classroom updated successfully.", "success");
            } else {
                await axios.post(
                    import.meta.env.VITE_API_URL + "/api/classrooms",
                    newClassroom
                );
                Swal.fire("Added", "Classroom added successfully.", "success");
            }

            resetForm();
            fetchClassrooms();
        } catch (err) {
            console.error("Error saving classroom:", err);
            Swal.fire(
                "Error",
                err.response?.data?.error || err.message,
                "error"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setNewClassroom({ room: "", department: "" });
        setEditMode(false);
        setEditId(null);
        setShowModal(false);
        setIsSaving(false);
    };

    const handleEdit = (classroom) => {
        setNewClassroom({
            room: classroom.room,
            department: classroom.department
        });
        setEditId(classroom._id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (_id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the classroom permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });
        if (confirm.isConfirmed) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/classrooms/${_id}`);
                Swal.fire("Deleted", "Classroom deleted successfully.", "success");
                fetchClassrooms();
            } catch (err) {
                console.error("Delete error:", err);
                Swal.fire("Error", "Failed to delete classroom.", "error");
            }
        }
    };

    return (
        <div className="classrooms-container" style={{ position: "relative" }}>
            {loadingClassrooms && (
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
                        Loading Classrooms...
                    </p>
                </div>
            )}

            <div className="classrooms-header">
                <h1>Classroom</h1>
                <p>This is where you can manage classrooms.</p>
            </div>

            <div className="classrooms-controls">
                <input
                    type="text"
                    placeholder="Search room..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="classrooms-search"
                />

                <select
                    value={deptFilter}
                    onChange={(e) => {
                        setDeptFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="classrooms-filter"
                >
                    <option value="">All Departments</option>
                    <option value="General">General</option>
                    {departments.map(dept => (
                        <option key={dept._id} value={dept.name}>{dept.name}</option>
                    ))}
                </select>

                <button
                    className="classrooms-add-btn"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    Add Classroom
                </button>
            </div>

            <div className="classrooms-table-container">
                <table className="classrooms-table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Room</th>
                            <th scope="col">Department</th>
                            <th scope="col" style={{ textAlign: "center", paddingRight: "10px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.length === 0 && !loadingClassrooms ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                    No classrooms found.
                                </td>
                            </tr>
                        ) : (
                            current.map((c, index) => (
                                <tr key={c._id}>
                                    <td>{start + index + 1}</td>
                                    <td>{c.room}</td>
                                    <td>{c.department}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <button className="action-btn edit" onClick={() => handleEdit(c)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDelete(c._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
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
                        <h2>
                            {editMode ? "Edit Classroom" : "Add New Classroom"}
                        </h2>

                        <input
                            type="text"
                            placeholder="Room"
                            value={newClassroom.room}
                            onChange={(e) =>
                                setNewClassroom({
                                    ...newClassroom,
                                    room: e.target.value
                                })
                            }
                        />

                        <select
                            value={newClassroom.department}
                            onChange={(e) =>
                                setNewClassroom({
                                    ...newClassroom,
                                    department: e.target.value
                                })
                            }
                        >
                            <option value="" disabled>Select Department</option>
                            <option value="General">General</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept.name}>{dept.name}</option>
                            ))}
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