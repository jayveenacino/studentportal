import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/departments.css";
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [newDept, setNewDept] = useState({ name: "", head: "", username: "", password: "", status: "Active" });
    const [showPassword, setShowPassword] = useState(false);

    const perPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoadingDepartments(true);
            try {
                await fetchDepartments();
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDepartments(false);
            }
        };
        fetchData();
    }, [])

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/departments");
            setDepartments(res.data);
        } catch (err) {
            console.error("Failed to fetch departments:", err);
        }
    };

    const filtered = departments.filter(
        d =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.head.toLowerCase().includes(search.toLowerCase()) ||
            (d.username && d.username.toLowerCase().includes(search.toLowerCase()))
    );
    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    const handleSubmit = async () => {
        if (!newDept.name || !newDept.head) {
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
                    `${import.meta.env.VITE_API_URL}/api/departments/${editId}`,
                    newDept
                );

                setDepartments(prev =>
                    prev.map(d => d._id === editId ? res.data : d)
                );

                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Department updated successfully.'
                });
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/departments`, newDept);
                setDepartments([res.data, ...departments]);
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'New department added.'
                });
            }

            setNewDept({ name: "", head: "", username: "", password: "", status: "Active" });
            setEditMode(false);
            setEditId(null);
            setShowModal(false);
            setShowPassword(false);

        } catch (err) {
            console.error("Save error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not save the department.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = dept => {
        setNewDept({
            name: dept.name,
            head: dept.head,
            username: dept.username || "",
            password: dept.password || "",
            status: dept.status
        });
        setEditId(dept._id);
        setEditMode(true);
        setShowModal(true);
        setShowPassword(false);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This department will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/departments/${id}`);

            setDepartments(prev => prev.filter(d => d._id !== id));

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Department has been deleted.'
            });
        } catch (err) {
            console.error("Delete failed:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not delete department.'
            });
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditMode(false);
        setEditId(null);
        setNewDept({ name: "", head: "", username: "", password: "", status: "Active" });
        setIsSaving(false);
        setShowPassword(false);
    };

    return (
        <div className="departments-container" style={{ position: "relative" }}>
            {loadingDepartments && (
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
                        Loading Departments...
                    </p>
                </div>
            )}

            <div className="departments-header">
                <h1>Departments</h1>
                <p>Manage the different departments in your school or organization.</p>
            </div>

            <div className="departments-controls">
                <input
                    className="departments-search"
                    placeholder="Search departments…"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <button className="departments-add-btn" onClick={() => {
                    setNewDept({ name: "", head: "", username: "", password: "", status: "Active" });
                    setEditMode(false);
                    setEditId(null);
                    setShowModal(true);
                    setShowPassword(false);
                }}>
                    Add Department
                </button>
            </div>

            <div className="departments-table-container">
                <table className="departments-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Department</th>
                            <th>Chairperson</th>
                            <th>Username</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((d, i) => (
                            <tr key={d._id}>
                                <td>{start + i + 1}</td>
                                <td>{d.name}</td>
                                <td>{d.head}</td>
                                <td>{d.username || "-"}</td>
                                <td>
                                    <span className={d.status === "Active" ? "status-active" : "status-inactive"}>
                                        {d.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="action-btn edit" onClick={() => handleEdit(d)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(d._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {current.length === 0 && !loadingDepartments && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No departments found.</td>
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
                        <h2>{editMode ? "Edit Department" : "Add New Department"}</h2>
                        <input
                            type="text"
                            placeholder="Enter Department"
                            value={newDept.name}
                            onChange={e => setNewDept({ ...newDept, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Enter Dean"
                            value={newDept.head}
                            onChange={e => setNewDept({ ...newDept, head: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={newDept.username}
                            onChange={e => setNewDept({ ...newDept, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                        />
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={newDept.password}
                                onChange={e => setNewDept({ ...newDept, password: e.target.value })}
                                style={{ width: "100%", paddingRight: "35px" }}
                            />
                            <i 
                                className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    cursor: "pointer",
                                    color: "#666"
                                }}
                            />
                        </div>
                        <select
                            value={newDept.status}
                            onChange={e => setNewDept({ ...newDept, status: e.target.value })}
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