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

    useEffect(() => {
        fetchEnrollees();
    }, []);

    const fetchEnrollees = async () => {
        try {
            const res = await axios.get('http://localhost:2025/api/enrollees');
            setEnrollees(res.data);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    };

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
            const res = await axios.put(`http://localhost:2025/api/students/${id}/accept`);

            Swal.fire({
                icon: 'success',
                title: 'Student Accepted!',
                html: (() => {
                    const student = res.data.student;
                    if (!student) return 'Done Sending Email to Student';
                    return `
                    <div style="text-align:left;">
                        <strong>Student No:</strong> ${student.studentNumber}<br/>
                        <strong>Email:</strong> ${student.domainEmail}<br/>
                        <strong>Temp Password:</strong> <u id="temp-password">${student.portalPassword}</u>
                        <br/><br/>
                        <small>Temporary password copied on click.</small>
                    </div>
                `;
                })(),
                didOpen: () => {
                    const el = document.getElementById('temp-password');
                    if (el) {
                        el.style.cursor = 'pointer';
                        el.addEventListener('click', () => {
                            navigator.clipboard.writeText(el.innerText);
                            el.style.textDecoration = 'underline dotted';
                            Swal.showValidationMessage('Copied!');
                        });
                    }
                }
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

    const formatFullName = (student) => {
        const { lastname, firstname, middlename } = student;
        const formattedLastname = lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();
        return `${formattedLastname}, ${firstname} ${middlename ? middlename : ''}`;
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

        // Room capacities
        const capacities = {
            AVR: 30,
            "COMLAB 2": 20
        };

        // Time slots per day
        const timeSlots = [
            "8:00 AM - 10:00 AM",
            "10:00 AM - 11:00 AM",
            "11:00 AM - 12:00 PM",
            "1:00 PM - 3:00 PM",
            "4:00 PM - 5:00 PM"
        ];

        let scheduleIndex = 0; // time slot index
        let dayCount = 1; // day counter
        let roomTrack = { AVR: 0, "COMLAB 2": 0 }; // current student count per room

        const rows = enrollees.map((enrollee, index) => {
            let assignedRoom = null;

            // Find a room with available space
            for (let room of Object.keys(capacities)) {
                if (roomTrack[room] < capacities[room]) {
                    assignedRoom = room;
                    roomTrack[room]++;
                    break;
                }
            }

            // If no room has space in this slot, move to next time slot
            if (!assignedRoom) {
                scheduleIndex++;
                roomTrack = { AVR: 0, "COMLAB 2": 0 }; // reset room counters
                // If time slots are exhausted, go to next day
                if (scheduleIndex >= timeSlots.length) {
                    scheduleIndex = 0;
                    dayCount++;
                }
                assignedRoom = "AVR"; // always start with AVR
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
                />
                <button className="export-btn" onClick={handleExport}>
                    Export List
                </button>
            </div>

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
                        {enrollees.map((enrollee, index) => (
                            <tr key={enrollee._id}>
                                <td>{index + 1}</td>
                                <td>{formatFullName(enrollee)}</td>
                                <td>{enrollee._id}</td>
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
                                    <button className="action-btn confirm" onClick={() => handleAccept(enrollee._id)}>
                                        Confirm
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDecline(enrollee._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {enrollees.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>No enrollees found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
                            {selectedStudent.academicImage && (
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
