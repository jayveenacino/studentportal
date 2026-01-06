import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admincss/enrollees.css';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";

export default function Enrollees() {
    const [enrollees, setEnrollees] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const [openChat, setOpenChat] = useState(false);
    const [chatStudent, setChatStudent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [adminMessage, setAdminMessage] = useState("");

    const openStudentChat = async (student) => {
        setChatStudent(student);
        setOpenChat(true);
        setAdminMessage("");

        try {
            const res = await axios.get(
                `http://localhost:2025/api/chats/${student._id}`
            );
            setMessages(res.data.messages);
        } catch (err) {
            console.error(err);
        }
    };

    const sendAdminMessage = async () => {
        if (!adminMessage.trim()) return;

        try {
            const res = await axios.post(
                `http://localhost:2025/api/chats/${chatStudent._id}`,
                {
                    sender: "admin",
                    text: adminMessage,
                }
            );

            setMessages(res.data.messages);
            setAdminMessage("");
        } catch (err) {
            console.error(err);
        }
    };

    const formatFullName = (student) => {
        const { lastname, firstname, middlename } = student;
        const formattedLastname = lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();
        return `${formattedLastname}, ${firstname} ${middlename ? middlename : ''}`;
    };

    useEffect(() => {
        fetchEnrollees();
    }, []);

    const fetchEnrollees = async () => {
        try {
            const res = await axios.get('http://localhost:2025/api/enrollees');
            setEnrollees(res.data);

            const uniqueCourses = [
                ...new Set(res.data.map(e => e.initialDept).filter(Boolean))
            ];
            setCourses(uniqueCourses);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    };

    const filteredEnrollees = enrollees.filter(e => {
        const matchesCourse =
            selectedCourse === "All" || e.initialDept === selectedCourse;
        const matchesSearch =
            formatFullName(e).toLowerCase().includes(searchTerm.toLowerCase()) ||
            e._id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCourse && matchesSearch;
    });

    const handleAccept = async (id) => {
        const student = enrollees.find(s => s._id === id);

        if (!student?.selectedCourse && !student?.initialDept) {
            Swal.fire({
                icon: 'warning',
                title: 'Course Not Selected',
                text: 'This student has not chosen a course. You cannot accept them.',
                confirmButtonColor: '#d33'
            });
            return;
        }

        Swal.fire({
            title: 'Sending confirmation...',
            text: 'Please wait while we accept the student and send an email.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await axios.put(`http://localhost:2025/api/students/${id}/accept`);

            Swal.fire({
                icon: 'success',
                title: 'Student Accepted!',
                text: 'Done Sending Email to Student',
                confirmButtonColor: '#3085d6'
            });

            setEnrollees(prev => prev.filter(student => student._id !== id));
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Accept',
                text: err.response?.data?.message || 'Something went wrong. Please try again.',
            });
        }
    };

    const handleDecline = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the student's record.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, decline and delete',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Declining student...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                await axios.delete(`http://localhost:2025/api/students/${id}/decline`);
                Swal.fire({
                    icon: 'success',
                    title: 'Student Declined',
                    text: 'The student was successfully removed from the list.'
                });
                fetchEnrollees();
            } catch (error) {
                console.error("Error declining student:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to decline the student. Please try again.'
                });
            }
        }
    };

    const openModal = async (studentId) => {
        try {
            const res = await axios.get(`http://localhost:2025/api/students/${studentId}`);
            setSelectedStudent(res.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch student details:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setEnlargedImage(null);
    };

    const handleImageClick = (image) => {
        setEnlargedImage(image);
    };

    const handleExport = () => {
        if (!enrollees || enrollees.length === 0) {
            Swal.fire("No Data", "There are no enrollees to export.", "info");
            return;
        }

        const headers = ["#", "Student Name", "Room", "Schedule"];

        const capacities = {
            AVR: 30,
            "COMLAB 2": 20
        };

        const timeSlots = [
            "8:00 AM - 10:00 AM",
            "10:00 AM - 11:00 AM",
            "11:00 AM - 12:00 PM",
            "1:00 PM - 3:00 PM",
            "4:00 PM - 5:00 PM"
        ];

        let scheduleIndex = 0;
        let dayCount = 1;
        let roomTrack = { AVR: 0, "COMLAB 2": 0 };

        const rows = enrollees.map((enrollee, index) => {
            let assignedRoom = null;

            for (let room of Object.keys(capacities)) {
                if (roomTrack[room] < capacities[room]) {
                    assignedRoom = room;
                    roomTrack[room]++;
                    break;
                }
            }

            if (!assignedRoom) {
                scheduleIndex++;
                roomTrack = { AVR: 0, "COMLAB 2": 0 };
                if (scheduleIndex >= timeSlots.length) {
                    scheduleIndex = 0;
                    dayCount++;
                }
                assignedRoom = "AVR";
                roomTrack[assignedRoom] = 1;
            }

            return [
                index + 1,
                formatFullName(enrollee),
                assignedRoom,
                `${timeSlots[scheduleIndex]} (Day ${dayCount})`
            ];
        });

        const csvArray = [headers, ...rows];
        const csvContent = csvArray.map(row => row.map(field => `"${field}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "enrollees_googleform.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="enrollees-container">
            <div className="enrollees-header">
                <h1>Pre-Register List</h1>
                <p>Manage and review all current enrollees here.</p>
            </div>

            <div className="enrollees-controls">
                <input
                    type="text"
                    className="enrollees-search"
                    placeholder="Search enrollees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="course-filter"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    <option value="All">All Courses</option>
                    {courses.map((course, idx) => (
                        <option key={idx} value={course}>
                            {course}
                        </option>
                    ))}
                </select>

                <button className="export-btn" onClick={handleExport}>
                    Export List
                </button>
            </div>

            {/* student list table */}
            <div className="enrollees-table-container">
                <table className="enrollees-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student Name</th>
                            <th>Registration Number</th>
                            <th>Uploaded Docs</th>
                            <th>Course Applied</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEnrollees.map((enrollee, index) => (
                            <tr key={enrollee.registerNumber}>
                                <td>{index + 1}</td>
                                <td>{formatFullName(enrollee)}</td>
                                <td>{enrollee.registerNumber}</td>
                                <td>
                                    <span
                                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                        onClick={() => openModal(enrollee._id)}
                                    >
                                        See Uploads
                                    </span>
                                </td>
                                <td>{enrollee.initialDept || 'No courses selected'}</td>
                                <td>
                                    <button className="action-btn confirm" onClick={() => handleAccept(enrollee._id)}>Confirm</button>
                                    <button className="action-btn delete" onClick={() => handleDecline(enrollee._id)}>Delete</button>
                                    <button className="action-btn chat" onClick={() => openStudentChat(enrollee)}>Chat</button>
                                </td>

                            </tr>
                        ))}
                        {filteredEnrollees.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>No enrollees found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {openChat && chatStudent && (
                <div className="admin-chat-wrapper" onClick={() => setOpenChat(false)}>
                    <div className="admin-chat-modal" onClick={(e) => e.stopPropagation()}>

                        <div className="admin-chat-header">
                            <div className="admin-chat-user">
                                <img
                                    className="admin-chat-avatar"
                                    src={chatStudent.image || "/public/img/knshdlogo.png"}
                                    alt={`${chatStudent.firstname} ${chatStudent.lastname}`}
                                />
                                <span className="admin-chat-username">
                                    {chatStudent.firstname} {chatStudent.middlename || ""} {chatStudent.lastname}
                                </span>
                            </div>

                            <button className="admin-chat-close" onClick={() => setOpenChat(false)}>✕</button>
                        </div>

                        <div className="admin-chat-body">

                            <div className="admin-chat-profile">
                                <img
                                    src={chatStudent.image || "/public/img/knshdlogo.png"}
                                    alt={`${chatStudent.firstname} ${chatStudent.lastname}`}
                                    className="admin-chat-profile-img"
                                />
                                <p className="admin-chat-profile-name">
                                    {chatStudent.firstname} {chatStudent.middlename || ""} {chatStudent.lastname}
                                </p>
                            </div>

                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`admin-chat-message ${msg.sender === "admin" ? "from-admin" : "from-student"}`}
                                >
                                    <p>{msg.text}</p>
                                </div>
                            ))}

                        </div>

                        <div className="admin-chat-input-wrapper">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={adminMessage}
                                onChange={(e) => setAdminMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendAdminMessage();
                                }}
                            />
                            <button onClick={sendAdminMessage} disabled={!adminMessage.trim()}>
                                Send
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {isModalOpen && selectedStudent && (
                <div className="studentdetails-modal-wrapper" onClick={closeModal}>
                    <div className="studentdetails-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="studentdetails-title">Student Details</h2>

                        <div className="studentdetails-info-grid">
                            <div><strong>Name:</strong> {formatFullName(selectedStudent)}</div>
                            <div><strong>PRE-REG Password:</strong> {selectedStudent.password}</div>
                            <div><strong>Scholarship Type:</strong> {selectedStudent.scholar}</div>
                            <div><strong>SHS Strand:</strong> {selectedStudent.strand}</div>
                            <div><strong>1st Course:</strong> {selectedStudent.selectedCourse}</div>
                            <div><strong>2nd Course:</strong> {selectedStudent.selectedSecCourse}</div>
                        </div>

                        <h3 className="studentdetails-subtitle">Uploaded Documents</h3>
                        <div className="studentdetails-docs-grid">
                            {selectedStudent.image && (
                                <div className="studentdetails-doc-item">
                                    <img
                                        src={selectedStudent.image}
                                        alt="Profile Picture"
                                        onClick={() => handleImageClick(selectedStudent.image)}
                                    />
                                    <p>Profile Picture</p>
                                </div>
                            )}
                            {selectedStudent.idimage && (
                                <div className="studentdetails-doc-item">
                                    <img
                                        src={selectedStudent.idimage}
                                        alt="SHS ID"
                                        onClick={() => handleImageClick(selectedStudent.idimage)}
                                    />
                                    <p>SHS ID</p>
                                </div>
                            )}
                            {selectedStudent.birthCertImage && (
                                <div className="studentdetails-doc-item">
                                    <img
                                        src={selectedStudent.birthCertImage}
                                        alt="Birth Certificate"
                                        onClick={() => handleImageClick(selectedStudent.birthCertImage)}
                                    />
                                    <p>Birth Cert</p>
                                </div>
                            )}
                            {selectedStudent.goodMoralImage && (
                                <div className="studentdetails-doc-item">
                                    <img
                                        src={selectedStudent.goodMoralImage}
                                        alt="Good Moral"
                                        onClick={() => handleImageClick(selectedStudent.goodMoralImage)}
                                    />
                                    <p>Good Moral</p>
                                </div>
                            )}
                            {selectedStudent.academicImage && selectedStudent.academicImage !== "❌" && (
                                <div className="studentdetails-doc-item">
                                    <img
                                        src={selectedStudent.academicImage}
                                        alt="Academic"
                                        onClick={() => handleImageClick(selectedStudent.academicImage)}
                                    />
                                    <p>Academic Records</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* enlarged image preview */}
            {enlargedImage && (
                <div className="enlarged-image-modal">
                    <div className="enlarged-image-content">
                        <span className="close-btn" onClick={() => setEnlargedImage(null)}>×</span>
                        <img src={enlargedImage} alt="Enlarged" className="enlarged-image" />
                    </div>
                </div>
            )}
        </div>
    );
}
