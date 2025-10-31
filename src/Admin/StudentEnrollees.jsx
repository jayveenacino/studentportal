import React, { useState, useEffect } from "react";
import "./Admincss/StudentEnrollees.css";
import axios from "axios";

export default function StudentEnrollees() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(8);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:2025/students")
            .then(res => {
                setStudents(res.data);
                setFilteredStudents(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:2025/courses")
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let filtered = students;

        if (searchTerm) {
            filtered = filtered.filter(student =>
                `${student.firstname} ${student.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCourse) {
            filtered = filtered.filter(student => student.course === selectedCourse);
        }

        setFilteredStudents(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedCourse, students]);

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openDetails = (student) => setSelectedStudent(student);
    const closeDetails = () => setSelectedStudent(null);

    return (
        <div className="enrollees-container">
            <div className="enrollees-header">
                <h1>Student Enrollees</h1>
                <p>Manage all student enlistments and enrollment status here.</p>
            </div>

            <div className="enrollees-controls">
                <input
                    type="text"
                    className="enrollees-search"
                    placeholder="Search student..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="course-filter"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    <option value="">All Courses</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course.name || course.courseName}>
                            {course.name || course.courseName}
                        </option>
                    ))}
                </select>


            </div>

            <div className="enrollees-table-container">
                <table className="enrollees-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Course</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.length > 0 ? (
                            currentStudents.map((student, index) => (
                                <tr key={index}>
                                    <td>{`${student.firstname} ${student.lastname}`}</td>
                                    <td>{student.email}</td>
                                    <td>{student.course || "N/A"}</td>
                                    <td className={student.status === "Active" ? "status-active" : "status-inactive"}>
                                        {student.status || "Pending"}
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn confirm"
                                            onClick={() => openDetails(student)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => alert("Deleted!")}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No students found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls">
                {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }).map((_, i) => (
                    <button
                        key={i}
                        className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => paginate(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {selectedStudent && (
                <div className="studentdetails-modal-wrapper">
                    <div className="studentdetails-modal">
                        <button className="close-btn" onClick={closeDetails}>Close</button>
                        <h2 className="studentdetails-title">Student Details</h2>

                        <div className="studentdetails-info-grid">
                            <div><strong>Name:</strong> {selectedStudent.firstname} {selectedStudent.lastname}</div>
                            <div><strong>Email:</strong> {selectedStudent.email}</div>
                            <div><strong>Course:</strong> {selectedStudent.course}</div>
                            <div><strong>Status:</strong> {selectedStudent.status}</div>
                            <div><strong>Phone:</strong> {selectedStudent.phone}</div>
                            <div><strong>Date of Birth:</strong> {selectedStudent.birthdate}</div>
                        </div>

                        <h3 className="studentdetails-subtitle">Uploaded Documents</h3>
                        <div className="studentdetails-docs-grid">
                            {selectedStudent.documents && selectedStudent.documents.length > 0 ? (
                                selectedStudent.documents.map((doc, i) => (
                                    <div className="studentdetails-doc-item" key={i}>
                                        <img src={doc.url} alt={doc.name} />
                                        <p>{doc.name}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No documents uploaded.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
