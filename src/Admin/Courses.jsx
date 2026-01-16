import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admincss/courses.css";

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newCourse, setNewCourse] = useState({ title: "", status: "Active", department: "", initialDept: "" });

    const perPage = 5;

    useEffect(() => {
        fetchCourses();
        fetchDepartments();
    }, []);

    const fetchCourses = () => {
        axios.get(import.meta.env.VITE_API_URL + "/api/courses")
            .then(res => setCourses(res.data))
            .catch(err => console.error("Fetch error:", err));
    };

    const fetchDepartments = () => {
        axios.get(import.meta.env.VITE_API_URL + "/api/departments")
            .then(res => setDepartments(res.data))
            .catch(err => console.error("Department fetch error:", err));
    };

    const filtered = courses.filter(c => {
        const title = c.title || "";
        const instructor = c.instructor || "";
        return (
            title.toLowerCase().includes(search.toLowerCase()) ||
            instructor.toLowerCase().includes(search.toLowerCase())
        );
    });

    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    const handleSubmit = async () => {
        if (!newCourse.title || !newCourse.department) {
            return Swal.fire("Missing Fields", "Please fill in all fields.", "warning");
        }

        try {
            if (editMode) {
                await axios.put(`http://localhost:2025/api/courses/${editId}`, newCourse);
                Swal.fire("Updated", "Course updated successfully.", "success");
            } else {
                const res = await axios.post(import.meta.env.VITE_API_URL + "/api/courses", newCourse);
                setCourses([res.data, ...courses]);
                Swal.fire("Added", "Course added successfully.", "success");
            }

            fetchCourses();
            resetForm();
        } catch (err) {
            console.error("Error saving course:", err);
            Swal.fire("Error", "Something went wrong.", "error");
        }
    };

    const handleEdit = course => {
        setNewCourse({
            title: course.title,
            status: course.status,
            department: course.department || "",
            initialDept: course.initialDept || ""
        });
        setEditId(course._id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async id => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the course permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`http://localhost:2025/api/courses/${id}`);
                Swal.fire("Deleted", "Course deleted successfully.", "success");
                fetchCourses();
            } catch (err) {
                console.error("Delete error:", err);
                Swal.fire("Error", "Failed to delete course.", "error");
            }
        }
    };

    const resetForm = () => {
        setNewCourse({ title: "", status: "Active", department: "", initialDept: "" });
        setEditMode(false);
        setEditId(null);
        setShowModal(false);
    };

    return (
        <div className="courses-container">
            <div className="courses-header">
                <h1>Courses</h1>
                <p>Manage all courses offered on the platform.</p>
            </div>

            <div className="courses-controls">
                <input
                    className="courses-search"
                    placeholder="Search courses…"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <button className="courses-add-btn" onClick={() => {
                    setEditMode(false);
                    setNewCourse({ title: "", status: "Active", department: "", initialDept: "" });
                    setShowModal(true);
                }}>
                    Add Course
                </button>
            </div>

            <div className="courses-table-container">
                <table className="courses-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Course</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((c, i) => (
                            <tr key={c._id}>
                                <td>{start + i + 1}</td>
                                <td>{c.title}</td>
                                <td>{c.department || "N/A"}</td>
                                <td>
                                    <span className={c.status === "Active" ? "status-active" : "status-inactive"}>
                                        {c.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="action-btn edit" onClick={() => handleEdit(c)}>Edit</button>
                                    <button className="action-btn delete" onClick={() => handleDelete(c._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {current.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No courses found.</td>
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
                        <h2>{editMode ? "Edit Course" : "Add New Course"}</h2>
                        <input
                            type="text"
                            placeholder="Course Title"
                            value={newCourse.title}
                            onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                        />

                        <select
                            value={newCourse.department}
                            onChange={e => setNewCourse({ ...newCourse, department: e.target.value })}
                        >
                            <option value="" disabled>Select Department</option>
                            {departments.map(dep => (
                                <option key={dep._id} value={dep.name}>{dep.name}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Initial Department"
                            value={newCourse.initialDept}
                            onChange={e => setNewCourse({ ...newCourse, initialDept: e.target.value })}
                        />

                        <select
                            value={newCourse.status}
                            onChange={e => setNewCourse({ ...newCourse, status: e.target.value })}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

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
