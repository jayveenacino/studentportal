import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admincss/classrooms.css";

export default function Classrooms() {
    const [classrooms, setClassrooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');


    const [newClassroom, setNewClassroom] = useState({
        room: "",
        subject: "",
        day: "",
        time: ""
    });

    const filteredClassrooms = classrooms.filter(c =>
        c.room.toLowerCase().includes(search.toLowerCase()) ||
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.day.toLowerCase().includes(search.toLowerCase()) ||
        c.time.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= FETCH ================= */

    const fetchClassrooms = async () => {
        try {
            const res = await axios.get("http://localhost:2025/api/classrooms");
            setClassrooms(res.data);
        } catch (err) {
            console.error("Fetch classrooms error:", err);
        }
    };

    useEffect(() => {
        fetchClassrooms();
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
                    "http://localhost:2025/api/classrooms",
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

    const handleDelete = async id => {
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
                await axios.delete(`http://localhost:2025/api/classrooms/${id}`);
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
                            <th>#</th>
                            <th>Room</th>
                            <th>Subject</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClassrooms.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No classrooms found.
                                </td>
                            </tr>
                        ) : (
                            filteredClassrooms.map((c, index) => (
                                <tr key={c._id}>
                                    <td>{index + 1}</td>
                                    <td>{c.room}</td>
                                    <td>{c.subject}</td>
                                    <td>{c.day}</td>
                                    <td>{c.time}</td>
                                    <td>
                                        <button className="action-btn edit" onClick={() => handleEdit(c)}>Edit</button>
                                        <button className="action-btn delete" onClick={() => handleDelete(c._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

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

                        <input
                            type="text"
                            placeholder="Subject"
                            value={newClassroom.subject}
                            onChange={(e) =>
                                setNewClassroom({
                                    ...newClassroom,
                                    subject: e.target.value
                                })
                            }
                        />

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
