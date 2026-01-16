import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admincss/subjects.css";

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newSubject, setNewSubject] = useState({
        code: "",
        name: "",
        department: "",
        units: "",
        semester: "",
        yearLevel: ""
    });

    const [courses, setCourses] = useState([]);

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/subjects");
            setSubjects(res.data);
        } catch (err) {
            console.error("Fetch subjects error:", err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/courses");
            setCourses(res.data);
        } catch (err) {
            console.error("Fetch courses error:", err);
        }
    };

    useEffect(() => {
        fetchSubjects();
        fetchCourses();
    }, []);

    const filteredSubjects = subjects.filter((s) =>
        s.code?.toLowerCase().includes(search.toLowerCase()) ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        courses.find((c) => c.initialDept === s.department)?.initialDept.toLowerCase().includes(search.toLowerCase()) ||
        s.department?.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setNewSubject({ code: "", name: "", department: "", units: "", semester: "", yearLevel: "" });
        setEditMode(false);
        setEditId(null);
        setShowModal(false);
    };

    const handleSubmit = async () => {
        if (!newSubject.code || !newSubject.name || !newSubject.department) {
            return Swal.fire("Missing Fields", "Code, Name, and Department are required.", "warning");
        }

        try {
            if (editMode && editId) {
                await axios.put(`http://localhost:2025/api/subjects/${editId}`, newSubject);
                Swal.fire("Updated", "Subject updated successfully.", "success");
            } else {
                await axios.post(import.meta.env.VITE_API_URL + "/api/subjects", newSubject);
                Swal.fire("Added", "Subject added successfully.", "success");
            }
            resetForm();
            fetchSubjects();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.response?.data?.error || err.message, "error");
        }
    };

    const handleEdit = (subject) => {
        setNewSubject({
            code: subject.code,
            name: subject.name,
            department: subject.department,
            units: subject.units,
            semester: subject.semester,
            yearLevel: subject.yearLevel
        });
        setEditId(subject._id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the subject permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`http://localhost:2025/api/subjects/${id}`);
                Swal.fire("Deleted", "Subject deleted successfully.", "success");
                fetchSubjects();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete subject.", "error");
            }
        }
    };

    return (
        <div className="subjects-container">
            <div className="subjects-header">
                <h1>Subjects</h1>
                <p>This is where you can manage available subjects.</p>
            </div>

            <div className="subjects-controls">
                <input
                    type="text"
                    placeholder="Search Code, Subject, Department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="subjects-search"
                />
                <button className="subjects-add-btn" onClick={() => setShowModal(true)}>
                    Add Subject
                </button>
            </div>

            <div className="subjects-table-container">
                <table className="subjects-table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Code</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Units</th>
                            <th scope="col">Semester</th>
                            <th scope="col">Year Level</th>
                            <th scope="col">Course</th>
                            <th scope="col" style={{ textAlign: "right", paddingRight: "20px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSubjects.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>No subjects found.</td>
                            </tr>
                        ) : (
                            filteredSubjects.map((s, index) => (
                                <tr key={s._id}>
                                    <td>{index + 1}</td>
                                    <td>{s.code}</td>
                                    <td className="subject-name">{s.name}</td>
                                    <td>{s.units || "-"}</td>
                                    <td>{s.semester || "-"}</td>
                                    <td>{s.yearLevel || "-"}</td>
                                    <td>{courses.find((c) => c.initialDept === s.department)?.initialDept || s.department}</td>
                                    <td style={{ textAlign: "right", paddingRight: "20px" }}>
                                        <button className="action-btn edit" onClick={() => handleEdit(s)}>Edit</button>
                                        <button className="action-btn delete" onClick={() => handleDelete(s._id)}>Delete</button>
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
                        <h2>{editMode ? "Edit Subject" : "Add Subject"}</h2>
                        <input
                            type="text"
                            placeholder="Subject Code"
                            value={newSubject.code}
                            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Subject Name"
                            value={newSubject.name}
                            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                        />
                        <select
                            value={newSubject.department}
                            onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
                        >
                            <option value="" disabled>Select Course</option>
                            {courses.map((c) => (
                                <option key={c._id} value={c.initialDept}>{c.initialDept}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Units"
                            value={newSubject.units}
                            onChange={(e) => setNewSubject({ ...newSubject, units: e.target.value })}
                        />
                        <select
                            value={newSubject.semester}
                            onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                        >
                            <option value="" disabled>Select Semester</option>
                            <option value="1st Sem">1st Sem</option>
                            <option value="2nd Sem">2nd Sem</option>
                            <option value="Summer">Summer</option>
                        </select>
                        <select
                            value={newSubject.yearLevel}
                            onChange={(e) => setNewSubject({ ...newSubject, yearLevel: e.target.value })}
                        >
                            <option value="" disabled>Select Year Level</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                        <div className="modal-buttons" style={{ marginTop: "1px" }}>
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={resetForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
