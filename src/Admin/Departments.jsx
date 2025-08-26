import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/departments.css";
import Swal from 'sweetalert2';


export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newDept, setNewDept] = useState({ name: "", head: "", status: "Active" });

    const perPage = 5;

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = () => {
        axios.get("http://localhost:2025/api/departments")
            .then(res => setDepartments(res.data))
            .catch(err => console.error("Failed to fetch departments:", err));
    };

    const filtered = departments.filter(
        d =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.head.toLowerCase().includes(search.toLowerCase())
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

        try {
            if (editMode) {
                await axios.put(`http://localhost:2025/api/departments/${editId}`, newDept);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Department updated successfully.'
                });
            } else {
                const res = await axios.post("http://localhost:2025/api/departments", newDept);
                setDepartments([res.data, ...departments]);
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'New department added.'
                });
            }

            fetchDepartments();
            setNewDept({ name: "", head: "", status: "Active" });
            setEditMode(false);
            setEditId(null);
            setShowModal(false);

        } catch (err) {
            console.error("Error saving department:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not save the department.'
            });
        }
    };

    const handleEdit = dept => {
        setNewDept({ name: dept.name, head: dept.head, status: dept.status });
        setEditId(dept._id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = id => alert(`Delete department ${id}`);

    return (
        <div className="departments-container">
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
                    setNewDept({ name: "", head: "", status: "Active" });
                    setEditMode(false);
                    setEditId(null);
                    setShowModal(true);
                }}>
                    + Add Department
                </button>
            </div>

            <div className="departments-table-container">
                <table className="departments-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Department</th>
                            <th>Chairperson</th>
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
                                <td>
                                    <span className={d.status === "Active" ? "status-active" : "status-inactive"}>
                                        {d.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="action-btn edit" onClick={() => handleEdit(d)}>Edit</button>
                                    <button className="action-btn delete" onClick={() => handleDelete(d._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {current.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No departments found.</td>
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
                        <select
                            value={newDept.status}
                            onChange={e => setNewDept({ ...newDept, status: e.target.value })}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="modal-buttons">
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={() => {
                                setShowModal(false);
                                setEditMode(false);
                                setNewDept({ name: "", head: "", status: "Active" });
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}