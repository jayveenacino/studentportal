import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admincss/studentlist.css';
import Swal from 'sweetalert2';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedStudent, setEditedStudent] = useState({});

    useEffect(() => {
        axios.get("http://localhost:2025/api/students")
            .then(res => setStudents(res.data))
            .catch(err => console.error(err));
    }, []);

    const filtered = students.filter(s => {
        const full = `${s.lastname || ''} ${s.firstname || ''} ${s.middlename || ''}`.toLowerCase();
        const number = s.studentNumber?.toLowerCase() || '';
        const course = s.course?.toLowerCase() || '';
        return full.includes(search.toLowerCase()) || number.includes(search.toLowerCase()) || course.includes(search.toLowerCase());
    });

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const current = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / perPage);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action will permanently delete the student record!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:2025/api/students/${id}`)
                    .then(() => {
                        setStudents(prevStudents => prevStudents.filter(s => s._id !== id));

                        Swal.fire(
                            'Deleted!',
                            'The student has been removed.',
                            'success'
                        );
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire(
                            'Error!',
                            'Failed to delete student.',
                            'error'
                        );
                    });
            }
        });
    };



    const formatFullName = (student) => {
        if (!student) return '';
        const { lastname, firstname, middlename, extension } = student;

        const format = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

        let name = `${format(firstname)} ${middlename ? format(middlename) + ' ' : ''}${format(lastname)}`;
        if (extension) name += ` ${extension.toUpperCase()}`;
        return name;
    };

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get("http://localhost:2025/api/courses");
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="studentlist-container">
            <div className="studentlist-header">
                <h1>Student List</h1>
                <p>Browse and manage student accounts</p>
            </div>

            <div className="studentlist-controls">
                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="studentlist-search"
                />
                <button className="studentlist-add-btn">+ Add Student</button>
            </div>

            <div className="studentlist-table-container">
                <table className="studentlist-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student Name</th>
                            <th>Student Number</th>
                            <th>Course</th>
                            <th>More Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.length === 0 ? (
                            <tr>
                                <td colSpan="6">
                                    No students found
                                </td>
                            </tr>
                        ) : (
                            current.map((s, i) => (
                                <tr key={s._id}>
                                    <td>{indexOfFirst + i + 1}</td>
                                    <td>{`${s.lastname || ''} ${s.firstname || ''} ${s.middlename || ''}`.trim()}</td>
                                    <td>{s.studentNumber || "N/A"}</td>
                                    <td>{s.course || s.initialDept || "N/A"}</td>
                                    <td>
                                        <span
                                            className="studentlist-more-details"
                                            onClick={() => {
                                                setSelectedStudent(s);
                                                setShowDetailsModal(true);
                                            }}
                                            style={{ cursor: "pointer", color: "#0a3d18", fontWeight: "bold" }}
                                        >
                                            View
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn confirm"
                                            onClick={() => {
                                                setSelectedStudent(s);
                                                setEditedStudent(s);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDelete(s._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {showDetailsModal && selectedStudent && (
                <div className="student-details-modal-backdrop">
                    <div className="student-details-modal-content">
                        <button className="student-details-close-btn" onClick={() => setShowDetailsModal(false)}>×</button>
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Student Details</h2>

                        <div className="student-details-grid">
                            <div><strong>Name:</strong> {formatFullName(selectedStudent)}</div>
                            <div><strong>Student No:</strong> {selectedStudent.studentNumber}</div>
                            <div><strong>Domain Email:</strong> {selectedStudent.domainEmail}</div>
                            <div><strong>Student Portal Pass:</strong> {selectedStudent.portalPassword}</div>
                            <div><strong>Course:</strong> {selectedStudent.initialDept}</div>
                            <div><strong>PRE-REG Password:</strong> {selectedStudent.password}</div>
                            <div><strong>Email:</strong> {selectedStudent.email}</div>
                            <div><strong>Year:</strong> {selectedStudent.year}</div>
                        </div>
                    </div>
                </div>
            )}


            {showEditModal && selectedStudent && (
                <div className="studentlist-edit-backdrop">
                    <div className="studentlist-edit-content" style={{ width: '600px' }}>
                        <button className="studentlist-close-btn" onClick={() => setShowEditModal(false)}>×</button>
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Student</h2>

                        <form className="studentlist-edit-grid">
                            <div>
                                <label><strong>Full Name:</strong></label>
                                <input
                                    type="text"
                                    value={formatFullName(selectedStudent)}
                                    disabled
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div>
                                <label><strong>Course:</strong></label>
                                <select
                                    value={editedStudent.course || selectedStudent.course || selectedStudent.initialDept || ""}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, course: e.target.value }))}
                                    style={{ width: "100%" }}
                                >
                                    {courses.map(course => (
                                        <option key={course._id} value={course.initialDept}>
                                            {course.initialDept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label><strong>School Year:</strong></label>
                                <select
                                    value={editedStudent.year || ''}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, year: e.target.value }))}
                                    style={{ width: "100%" }}
                                >
                                    <option value="">-- Select Year --</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                            </div>

                            <div>
                                <label><strong>User Email:</strong></label>
                                <input
                                    type="email"
                                    value={editedStudent.email || selectedStudent.email || ''}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, email: e.target.value }))}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div>
                                <label><strong>Pre Register Password:</strong></label>
                                <input
                                    type="text"
                                    value={editedStudent.password || selectedStudent.password || ''}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, password: e.target.value }))}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div>
                                <label><strong>Student Portal Password:</strong></label>
                                <input
                                    type="text"
                                    value={editedStudent.password || selectedStudent.password || ''}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, password: e.target.value }))}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    className="action-btn confirm"
                                    onClick={() => {
                                        axios.put(`http://localhost:2025/api/students/${selectedStudent._id}`, editedStudent)
                                            .then(res => {
                                                setStudents(prev => prev.map(s => s._id === selectedStudent._id ? res.data : s));
                                                setShowEditModal(false);
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Success',
                                                    text: 'Student information updated successfully!',
                                                    confirmButtonColor: '#3085d6'
                                                });
                                            })
                                            .catch(error => {
                                                console.error(error);
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Error',
                                                    text: 'Failed to update student. Please try again.',
                                                    confirmButtonColor: '#d33'
                                                });
                                            });
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}