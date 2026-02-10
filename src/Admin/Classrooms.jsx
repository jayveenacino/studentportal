import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admincss/classrooms.css";

export default function Classrooms() {
    const [classrooms, setClassrooms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');

    const perPage = 5;

    const [newClassroom, setNewClassroom] = useState({
        room: "",
        subject: "",
        day: "",
        time: ""
    });

    const filtered = classrooms.filter(
        c =>
            c.room.toLowerCase().includes(search.toLowerCase()) ||
            c.subject.toLowerCase().includes(search.toLowerCase())
    );
    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    /* ================= FETCH ================= */

    const fetchClassrooms = async () => {
        axios.get(import.meta.env.VITE_API_URL + "/api/classrooms")
            .then(res => setClassrooms(res.data))
            .catch(err => console.error("Fetch error:", err));
    };
    const fetchSubjects = () => {
        axios.get(import.meta.env.VITE_API_URL + "/api/subjects")
            .then(res => setSubjects(res.data))
            .catch(err => console.error("Subject fetch error:", err));
    };

    useEffect(() => {
        fetchClassrooms();
        fetchSubjects();
    }, []);


    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
        if (!newClassroom.room || !newClassroom.subject) {
            return Swal.fire(
                "Missing Fields",
                "Room and Subject are required.",
                "warning"
            );
        }

        try {
            if (editMode && editId) {
                await axios.put(
                    `http://localhost:2025/api/classrooms/${editId}`,
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
        }
    };

    /* ================= HELPERS ================= */

    const resetForm = () => {
        setNewClassroom({ room: "", subject: "", day: "", time: "" });
        setEditMode(false);
        setEditId(null);
        setShowModal(false);
    };

    const handleEdit = (classroom) => {
        setNewClassroom({
            room: classroom.room,
            subject: classroom.subject,
            day: classroom.day,
            time: classroom.time
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

    /* ================= UI ================= */

    return (
        <div className="classrooms-container">
            <div className="classrooms-header">
                <h1>Classroom</h1>
                <p>This is where you can manage classrooms.</p>
            </div>

            <div className="classrooms-controls">
                <input
                    type="text"
                    placeholder="Search room, subject, day..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="classrooms-search"
                />

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
                            <th scope="col">Subject</th>
                            <th scope="col">Day</th>
                            <th scope="col">Timer</th>
                            <th scope="col" style={{ textAlign: "center", paddingRight: "10px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No classrooms found.
                                </td>
                            </tr>
                        ) : (
                            current.map((c, index) => (
                                <tr key={c._id}>
                                    <td>{index + 1}</td>
                                    <td>{c.room}</td>
                                    <td>{c.subject}</td>
                                    <td>{c.day}</td>
                                    <td>{c.time}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <button className="action-btn edit" onClick={() => handleEdit(c)}>Edit</button>
                                        <button className="action-btn delete" onClick={() => handleDelete(c._id)}>Delete</button>
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
                            value={newClassroom.subject}
                            onChange={(e) =>
                                setNewClassroom({
                                    ...newClassroom,
                                    subject: e.target.value
                                })
                            }
                        >
                            <option value="" disabled>Select Subject</option>
                            {subjects.map(sub => (
                                <option key={sub._id} value={sub.name}>{sub.name}</option>
                            ))}
                        </select>

                        <select
                            type="text"
                            placeholder="Day"
                            value={newClassroom.day}
                            onChange={(e) =>
                                setNewClassroom({
                                    ...newClassroom,
                                    day: e.target.value
                                })
                            }
                        >
                            <option value="">Select Day</option>
                            <option value="Monday & Thurday">Monday-Thursday</option>
                            <option value="Tuesday & Friday">Tuesday-Friday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Saturday">Saturday</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Time"
                            value={newClassroom.time}
                            onChange={(e) =>
                                setNewClassroom({
                                    ...newClassroom,
                                    time: e.target.value
                                })
                            }
                        />

                        <div className="modal-buttons">
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={resetForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
