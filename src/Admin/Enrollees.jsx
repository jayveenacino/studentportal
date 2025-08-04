import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admincss/enrollees.css';
import Swal from 'sweetalert2';

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
            const res = await axios.get('http://localhost:2025/api/students');
            setEnrollees(res.data);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    };

    const handleAccept = async (id) => {
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
                    if (!student) return 'No student data received.';

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


            fetchEnrollees();
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

    return (
        <div className="enrollees-container">
            <div className="enrollees-header">
                <h1>Enrollees List</h1>
                <p>Manage and review all current enrollees here.</p>
            </div>

            <div className="enrollees-controls">
                <input
                    type="text"
                    className="enrollees-search"
                    placeholder="Search enrollees..."
                />
            </div>

            <div className="enrollees-table-container">
                <table className="enrollees-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student Name</th>
                            <th>Student Number</th>
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
                                <td>{enrollee.studentNumber}</td>
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
                <div
                    className="modal open"
                    onClick={closeModal}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ fontSize: '15px' }}>Student Details</h2>

                        <div className="student-info-grid">
                            <div><strong>Name:</strong> {formatFullName(selectedStudent)}</div>
                            <div><strong>Student No:</strong> {selectedStudent.studentNumber}</div>
                            <div><strong>Domain Email:</strong> {selectedStudent.domainEmail}</div>
                            <div><strong>PRE-REG Password:</strong> {selectedStudent.password}</div>
                            <div><strong>1st Course:</strong> {selectedStudent.selectedCourse}</div>
                            <div><strong>2nd Course:</strong> {selectedStudent.selectedSecCourse}</div>
                        </div>

                        <h3 style={{ marginTop: '-30px', fontSize: '15px' }}>Uploaded Documents</h3>
                        <div className="document-grid">
                            {selectedStudent.image && (
                                <div className="document-item profile-picture">
                                    <img
                                        src={selectedStudent.image}
                                        alt="Profile Picture"
                                        onClick={() => handleImageClick(selectedStudent.image)}
                                    />
                                    <p>Profile Picture</p>
                                </div>
                            )}
                            {selectedStudent.idimage && (
                                <div className="document-item profile-picture">
                                    <img
                                        src={selectedStudent.idimage}
                                        alt="SHS ID"
                                        onClick={() => handleImageClick(selectedStudent.idimage)}
                                    />
                                    <p>SHS Id</p>
                                </div>
                            )}
                            {selectedStudent.birthCertImage && (
                                <div className="document-item profile-picture">
                                    <img
                                        src={selectedStudent.birthCertImage}
                                        alt="Birth Certificate"
                                        onClick={() => handleImageClick(selectedStudent.birthCertImage)}
                                    />
                                    <p>Birth Cert</p>
                                </div>
                            )}
                            {selectedStudent.goodMoralImage && (
                                <div className="document-item profile-picture">
                                    <img
                                        src={selectedStudent.goodMoralImage}
                                        alt="Good Moral"
                                        onClick={() => handleImageClick(selectedStudent.goodMoralImage)}
                                    />
                                    <p>Good Moral</p>
                                </div>
                            )}
                            {selectedStudent.academicImage && (
                                <div className="document-item profile-picture">
                                    <img
                                        src={selectedStudent.academicImage}
                                        alt="Good Moral"
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
