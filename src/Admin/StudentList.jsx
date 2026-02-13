import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admincss/studentlist.css';
import "./Admincss/studenttwo.css";
import Swal from 'sweetalert2';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDetailsPage, setShowDetailsPage] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedStudent, setEditedStudent] = useState({});
    const [courses, setCourses] = useState([]);
    const [loadingUserData, setLoadingUserData] = useState(true);
    const [activeTab, setActiveTab] = useState("contacts");


    useEffect(() => {
        const fetchStudents = async () => {
            setLoadingUserData(true);
            try {
                const acceptedRes = await axios.get(import.meta.env.VITE_API_URL + "/api/acceptedstudents");
                const acceptedIds = acceptedRes.data.map(a => a.studentNumber);
                const allRes = await axios.get(import.meta.env.VITE_API_URL + "/api/students");
                const filtered = allRes.data.filter(s => acceptedIds.includes(s.studentNumber));
                const merged = filtered.map(student => {
                    const accepted = acceptedRes.data.find(a => a.studentNumber === student.studentNumber);
                    return { ...student, ...accepted, yearLevel: accepted.yearLevel || student.yearLevel };
                });
                setStudents(merged);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingUserData(false);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_API_URL + "/api/courses");
                setCourses(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    const filtered = students.filter(s => {
        const full = `${s.lastname || ''} ${s.firstname || ''} ${s.middlename || ''}`.toLowerCase();
        const number = s.studentNumber?.toLowerCase() || '';
        const dept = s.initialDept?.toLowerCase() || '';
        return full.includes(search.toLowerCase()) || number.includes(search.toLowerCase()) || dept.includes(search.toLowerCase());
    });

    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const current = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / perPage);

    const formatFullName = (student) => {
        if (!student) return '';
        const { lastname, firstname, middlename, extension } = student;
        const format = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
        let name = `${format(firstname)} ${middlename ? format(middlename) + ' ' : ''}${format(lastname)}`;
        if (extension) name += ` ${extension.toUpperCase()}`;
        return name;
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action will permanently delete the student record!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/acceptedstudents/${id}`);
                setStudents(prev => prev.filter(s => s._id !== id));
                Swal.fire('Deleted!', 'The student has been removed.', 'success');
            } catch (err) {
                console.error(err);
                Swal.fire('Error!', 'Failed to delete student.', 'error');
            }
        }
    };

    return (
        <div className="studentlist-container" style={{ position: 'relative', minHeight: '100vh' }}>
            {loadingUserData && (
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
                        Loading Accepted Students...
                    </p>
                </div>
            )}

            {showDetailsPage && selectedStudent && (
                <div className="vcs-full-page-view">
                    <button className="vcs-close-page-btn" onClick={() => setShowDetailsPage(false)}>×</button>
                    <div className="vcs-inner-content">
                        <div className="vcs-header-banner">
                            <div className="vcs-profile-card">
                                <div className="vcs-avatar-wrapper">
                                    {selectedStudent.image ? (
                                        <img
                                            src={selectedStudent.image}
                                            alt="Profile"
                                            className="vcs-avatar-img"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/150?text=Invalid+Data";
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src="https://placehold.co/150?text=No+Image"
                                            alt="Default"
                                            className="vcs-avatar-img"
                                        />
                                    )}
                                </div>
                                <div className="vcs-profile-info">
                                    <h1 className="vcs-name">{formatFullName(selectedStudent)}</h1>
                                    <span className="vcs-student-number">Student Number: {selectedStudent.studentNumber}</span>
                                    <span className="vcs-badge">{selectedStudent.yearLevel || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="vcs-stats-container">
                            <div className="vcs-stats-grid">
                                <StatCard icon="🎓" title="Course" count={selectedStudent.initialDept} color="indigo" />
                                <StatCard icon="📧" title="Personal Email" count={selectedStudent.email} color="red" />
                                <StatCard icon="🌐" title="Domain Email" count={selectedStudent.domainEmail} color="orange" />
                                <StatCard icon="🔑" title="Portal Password"
                                    count={selectedStudent.portalPassword ? `${selectedStudent.portalPassword.slice(0, 8)}...` : "N/A"}
                                    color="green"
                                />
                                <StatCard icon="📝" title="Pre-Reg Password" count={selectedStudent.password || "N/A"} color="blue" />
                            </div>
                        </div>
                        <div className="vcs-tabs-container">
                            <div className="vcs-tabs-header">
                                <button
                                    className={`vcs-tab-btn ${activeTab === "contacts" ? "active" : ""}`}
                                    onClick={() => setActiveTab("contacts")}
                                >
                                    Contacts
                                </button>

                                <button
                                    className={`vcs-tab-btn ${activeTab === "biography" ? "active" : ""}`}
                                    onClick={() => setActiveTab("biography")}
                                >
                                    Biography
                                </button>
                            </div>

                            <div className="vcs-tab-content">

                                {activeTab === "contacts" && (
                                    <>
                                        <div className="vcs-contact-item">
                                            <span className="vcs-contact-icon">📍</span>
                                            <span>
                                                {selectedStudent.barangay || "N/A"}, {selectedStudent.city || "N/A"}, {selectedStudent.province || "N/A"}
                                            </span>
                                        </div>

                                        <div className="vcs-contact-item">
                                            <span className="vcs-contact-icon">📞</span>
                                            <span>
                                                {selectedStudent.phone || "N/A"}
                                            </span>
                                        </div>

                                        <div className="vcs-contact-item">
                                            <span className="vcs-contact-icon">✉</span>
                                            <span>
                                                {selectedStudent.email}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {activeTab === "biography" && (
                                    <div className="vcs-biography-content">
                                        <h3>Student Biography</h3>
                                        <p>
                                            {formatFullName(selectedStudent)} is currently enrolled in the
                                            <strong> {selectedStudent.initialDept || "N/A"} </strong>
                                            program as a <strong>{selectedStudent.yearLevel || "N/A"}</strong>.
                                        </p>

                                        <p>
                                            This student is officially accepted and registered in the system.
                                            Below are the registered academic and portal credentials recorded
                                            in the database.
                                        </p>

                                        <ul>
                                            <li><strong>Student Number:</strong> {selectedStudent.studentNumber}</li>
                                            <li><strong>Email:</strong> {selectedStudent.email || "N/A"}</li>
                                            <li><strong>Domain Email:</strong> {selectedStudent.domainEmail || "N/A"}</li>
                                        </ul>
                                    </div>
                                )}

                            </div>
                        </div>


                    </div>
                </div>
            )}

            <div className="studentlist-header">
                <h1>Accepted Student List</h1>
                <p>Browse and manage accepted student accounts</p>
            </div>

            <div className="studentlist-controls">
                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="studentlist-search"
                />
                <button className="studentlist-add-btn">Add Student</button>
            </div>

            <div className="studentlist-table-container">
                <table className="studentlist-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th style={{ textAlign: "left" }}>Student Name</th>
                            <th>Student Number</th>
                            <th>Course</th>
                            <th>More Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.length === 0 ? (
                            <tr><td colSpan="6">No students found</td></tr>
                        ) : (
                            current.map((s, i) => (
                                <tr key={s._id}>
                                    <td>{indexOfFirst + i + 1}</td>
                                    <td style={{ textAlign: "left" }}>{formatFullName(s)}</td>
                                    <td>{s.studentNumber || "N/A"}</td>
                                    <td>{s.initialDept || "N/A"}</td>
                                    <td>
                                        <span
                                            className="studentlist-more-details"
                                            onClick={() => {
                                                setSelectedStudent(s);
                                                setShowDetailsPage(true);
                                            }}
                                            style={{ cursor: "pointer", color: "#0a3d18", fontWeight: "bold" }}
                                        >View</span>
                                    </td>
                                    <td>
                                        <button className="action-btn confirm" onClick={() => {
                                            setSelectedStudent(s);
                                            setEditedStudent(s);
                                            setShowEditModal(true);
                                        }}>Edit</button>
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
                        >{i + 1}</button>
                    ))}
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
                                <input type="text" value={formatFullName(selectedStudent)} disabled style={{ width: "100%" }} />
                            </div>
                            <div>
                                <label><strong>Course:</strong></label>
                                <select
                                    value={editedStudent.initialDept || selectedStudent.initialDept || ""}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, initialDept: e.target.value }))}
                                    style={{ width: "100%" }}
                                >
                                    {courses.map(course => (
                                        <option key={course._id} value={course.initialDept}>{course.initialDept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label><strong>School Year:</strong></label>
                                <select
                                    value={editedStudent.yearLevel || selectedStudent.yearLevel || ''}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, yearLevel: e.target.value }))}
                                    style={{ width: "100%" }}
                                >
                                    <option value="">-- Select Year --</option>
                                    <option value="1ST YEAR">1st Year</option>
                                    <option value="2ND YEAR">2nd Year</option>
                                    <option value="3RD YEAR">3rd Year</option>
                                    <option value="4TH YEAR">4th Year</option>
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
                                    value={editedStudent.preregisterPassword || selectedStudent.preregisterPassword || ''}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, preregisterPassword: e.target.value }))}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div>
                                <label><strong>Student Portal Password:</strong></label>
                                <input
                                    type="text"
                                    value={editedStudent.portalPassword || selectedStudent.portalPassword || ''}
                                    onChange={(e) => setEditedStudent(prev => ({ ...prev, portalPassword: e.target.value }))}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    className="action-btn confirm"
                                    onClick={() => {
                                        axios.put(`${import.meta.env.VITE_API_URL}/api/acceptedstudents/${selectedStudent._id}`, editedStudent)
                                            .then(res => {
                                                setStudents(prev => prev.map(s => s._id === selectedStudent._id ? res.data : s));
                                                setShowEditModal(false);
                                                Swal.fire({ icon: 'success', title: 'Success', text: 'Student updated!' });
                                            })
                                            .catch(err => Swal.fire({ icon: 'error', title: 'Error', text: 'Update failed!' }));
                                    }}
                                >Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const StatCard = ({ icon, title, count, color }) => (
    <div className="vcs-stat-card">
        <div className={`vcs-icon-box vcs-icon-${color}`}>{icon}</div>
        <div className="vcs-stat-content">
            <p className={`vcs-stat-title vcs-text-${color}`}>{title}</p>
            <h2 className="vcs-stat-number">{count || "N/A"}</h2>
        </div>
    </div>
);
