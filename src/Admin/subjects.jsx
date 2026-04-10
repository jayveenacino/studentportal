import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";
import "./Admincss/subjects.css";

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [newSubject, setNewSubject] = useState({
        code: "",
        name: "",
        department: "",
        units: "",
        semester: "",
        yearLevel: "",
        price: "",
        prerequisite: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoadingSubjects(true);
            try {
                await fetchSubjects();
                await fetchCourses();
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSubjects(false);
            }
        };
        fetchData();
    }, []);

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

    const filtered = subjects.filter((s) =>
        s.code?.toLowerCase().includes(search.toLowerCase()) ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.department?.toLowerCase().includes(search.toLowerCase())
    );

    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const currentItems = filtered.slice(start, start + perPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSubmit = async () => {
        if (!newSubject.code || !newSubject.name || !newSubject.department) {
            return Swal.fire("Missing Fields", "Code, Name, and Department are required.", "warning");
        }

        setIsSaving(true);

        try {
            const url = `${import.meta.env.VITE_API_URL}/api/subjects`;

            const submitData = {
                code: newSubject.code,
                name: newSubject.name,
                department: newSubject.department,
                units: Number(newSubject.units) || 3,
                semester: newSubject.semester || "1st Sem",
                yearLevel: newSubject.yearLevel || "1st Year",
                price: newSubject.price === "" ? 0 : Number(newSubject.price),
                prerequisite: newSubject.prerequisite === "" ? null : newSubject.prerequisite
            };

            if (editMode && editId) {
                await axios.put(`${url}/${editId}`, submitData);
                Swal.fire("Updated", "Subject updated successfully.", "success");
            } else {
                await axios.post(url, submitData);
                Swal.fire("Added", "Subject added successfully.", "success");
            }

            fetchSubjects();
            resetForm();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.response?.data?.error || "Something went wrong.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (subject) => {
        setNewSubject({
            code: subject.code,
            name: subject.name,
            department: subject.department,
            units: subject.units?.toString() || "",
            semester: subject.semester || "",
            yearLevel: subject.yearLevel || "",
            price: subject.price?.toString() || "",
            prerequisite: subject.prerequisite || ""
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
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/subjects/${id}`);
                Swal.fire("Deleted", "Subject deleted successfully.", "success");
                fetchSubjects();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete subject.", "error");
            }
        }
    };

    const resetForm = () => {
        setNewSubject({ code: "", name: "", department: "", units: "", semester: "", yearLevel: "", price: "", prerequisite: "" });
        setEditMode(false);
        setEditId(null);
        setShowModal(false);
        setIsSaving(false);
    };

    const availablePrerequisites = subjects.filter(s => editMode ? s._id !== editId : true);

    return (
        <div className="subjects-container" style={{ position: "relative" }}>
            {loadingSubjects && (
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
                        Loading Subjects...
                    </p>
                </div>
            )}

            <div className="subjects-header">
                <h1>Subjects</h1>
                <p>Manage the list of academic subjects here.</p>
            </div>

            <div className="subjects-controls">
                <input
                    type="text"
                    placeholder="Search Code, Subject, Department..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
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
                            <th>#</th>
                            <th>Code</th>
                            <th>Subject</th>
                            <th>Units</th>
                            <th>Semester</th>
                            <th>Year Level</th>
                            <th>Course</th>
                            <th>Price</th>
                            <th>Prerequisite</th>
                            <th style={{ textAlign: "right", paddingRight: "20px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((s, index) => (
                            <tr key={s._id}>
                                <td>{start + index + 1}</td>
                                <td>{s.code}</td>
                                <td className="subject-name">{s.name}</td>
                                <td>{s.units || "-"}</td>
                                <td>{s.semester || "-"}</td>
                                <td>{s.yearLevel || "-"}</td>
                                <td>{s.department}</td>
                                <td>{s.price !== undefined && s.price !== null ? `₱${s.price}` : "-"}</td>
                                <td>{s.prerequisite || "None"}</td>
                                <td style={{ textAlign: "right", paddingRight: "20px" }}>
                                    <button className="action-btn edit" onClick={() => handleEdit(s)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(s._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {currentItems.length === 0 && !loadingSubjects && (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>No subjects found.</td>
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
                            onClick={() => paginate(idx + 1)}
                            className={`pagination-btn ${currentPage === idx + 1 ? "active" : ""}`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content compact-modal">
                        <h2>{editMode ? "Edit Subject" : "Add Subject"}</h2>
                        <div className="bento-grid">
                            <div className="bento-item bento-code">
                                <label>Code</label>
                                <input
                                    type="text"
                                    placeholder="Subject Code"
                                    value={newSubject.code}
                                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                                />
                            </div>
                            <div className="bento-item bento-name">
                                <label>Subject Name</label>
                                <input
                                    type="text"
                                    placeholder="Subject Name"
                                    value={newSubject.name}
                                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                />
                            </div>
                            <div className="bento-item bento-course">
                                <label>Course</label>
                                <select
                                    value={newSubject.department}
                                    onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
                                >
                                    <option value="" disabled>Select Course</option>
                                    <option value="General">General (All Courses)</option>
                                    {courses.map((c) => (
                                        <option key={c._id} value={c.initialDept}>{c.initialDept}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="bento-item bento-units">
                                <label>Units</label>
                                <input
                                    type="number"
                                    placeholder="Units"
                                    value={newSubject.units}
                                    onChange={(e) => setNewSubject({ ...newSubject, units: e.target.value })}
                                />
                            </div>
                            <div className="bento-item bento-semester">
                                <label>Semester</label>
                                <select
                                    value={newSubject.semester}
                                    onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                                >
                                    <option value="" disabled>Select Semester</option>
                                    <option value="1st Sem">1st Sem</option>
                                    <option value="2nd Sem">2nd Sem</option>
                                    <option value="Summer">Summer</option>
                                </select>
                            </div>
                            <div className="bento-item bento-year">
                                <label>Year Level</label>
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
                            </div>
                            <div className="bento-item bento-price">
                                <label>Price</label>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={newSubject.price}
                                    onChange={(e) => setNewSubject({ ...newSubject, price: e.target.value })}
                                />
                            </div>
                            <div className="bento-item bento-prerequisite">
                                <label>Prerequisite</label>
                                <select
                                    value={newSubject.prerequisite}
                                    onChange={(e) => setNewSubject({ ...newSubject, prerequisite: e.target.value })}
                                >
                                    <option value="">None</option>
                                    {availablePrerequisites.map((s) => (
                                        <option key={s._id} value={s.code}>{s.code} - {s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
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
};

export default Subjects;