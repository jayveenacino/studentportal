import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Admincss/instructor.css";
import Swal from 'sweetalert2';
import { Pencil, Trash2, Image, Eye } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const InstructorImage = ({ instructorId }) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await axios.get(`${API}/api/instructors/${instructorId}/image`);
                setImage(res.data.profileImage);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchImage();
    }, [instructorId]);

    if (loading) {
        return (
            <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "10%",
                background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }} />
        );
    }

    return image ? (
        <img
            src={image}
            alt="Instructor"
            style={{
                width: "50px",
                height: "50px",
                borderRadius: "10%",
                objectFit: "cover"
            }}
        />
    ) : (
        <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <span style={{ color: "#888", fontSize: "12px" }}>No Image</span>
        </div>
    );
};

export default function Instructor() {
    const [instructors, setInstructors] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewInstructor, setViewInstructor] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingInstructors, setLoadingInstructors] = useState(true);
    const [newInstructor, setNewInstructor] = useState({
        name: "",
        department: "",
        status: "Active",
        profileImage: ""
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [departments, setDepartments] = useState([]);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${API}/api/departments`);
            setDepartments(res.data.filter(d => d.status === "Active"));
        } catch (err) {
            console.error("Failed to fetch departments:", err);
        }
    };

    const fetchInstructors = async () => {
        try {
            const res = await axios.get(`${API}/api/instructors`);
            setInstructors(res.data);
        } catch (err) {
            console.error("Failed to fetch instructors:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoadingInstructors(true);
            try {
                await fetchInstructors();
                await fetchDepartments();
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingInstructors(false);
            }
        };
        fetchData();
    }, []);

    const perPage = 5;

    const filtered = instructors.filter(
        i =>
            (selectedDepartment === "" || i.department === selectedDepartment) &&
            (i.name.toLowerCase().includes(search.toLowerCase()) ||
                i.department.toLowerCase().includes(search.toLowerCase()))
    );
    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            Swal.fire({
                icon: "error",
                title: "Invalid File",
                text: "Please upload an image file."
            });
            return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            Swal.fire({
                icon: "error",
                title: "File Too Large",
                text: "Image must be 2MB or less."
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            setNewInstructor(prev => ({ ...prev, profileImage: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!newInstructor.name || !newInstructor.department) {
            return Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill out all fields.'
            });
        }

        setIsSaving(true);

        try {
            if (editMode) {
                const res = await axios.put(`${API}/api/instructors/${editId}`, newInstructor);
                setInstructors(prev => prev.map(i => i._id === editId ? res.data : i));
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Instructor updated successfully.'
                });
            } else {
                const res = await axios.post(`${API}/api/instructors`, newInstructor);
                setInstructors([res.data, ...instructors]);
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'New instructor added.'
                });
            }
            resetForm();
        } catch (err) {
            console.error("Save error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not save the instructor.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = async (instructor) => {
        try {
            const res = await axios.get(`${API}/api/instructors/${instructor._id}`);
            const fullInstructor = res.data;
            setNewInstructor({
                name: fullInstructor.name,
                department: fullInstructor.department,
                status: fullInstructor.status,
                profileImage: fullInstructor.profileImage || ""
            });
            setPreviewUrl(fullInstructor.profileImage || null);
            setEditId(fullInstructor._id);
            setEditMode(true);
            setShowModal(true);
        } catch (err) {
            console.error("Failed to fetch instructor details:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load instructor details'
            });
        }
    };

    const handleView = async (instructor) => {
        try {
            const res = await axios.get(`${API}/api/instructors/${instructor._id}`);
            setViewInstructor(res.data);
            setShowViewModal(true);
        } catch (err) {
            console.error("Failed to fetch instructor details:", err);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This instructor will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`${API}/api/instructors/${id}`);
            setInstructors(prev => prev.filter(i => i._id !== id));
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Instructor has been deleted.'
            });
        } catch (err) {
            console.error("Delete failed:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not delete instructor.'
            });
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditMode(false);
        setEditId(null);
        setNewInstructor({ name: "", department: "", status: "Active", profileImage: "" });
        setPreviewUrl(null);
        setIsSaving(false);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setViewInstructor(null);
    };

    return (
        <div className="instructor-container" style={{ position: "relative" }}>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>

            {loadingInstructors && (
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
                        Loading Instructors...
                    </p>
                </div>
            )}

            <div className="instructor-header">
                <h1>Instructors</h1>
                <p>Manage faculty members and teaching staff.</p>
            </div>

            <div className="instructor-controls" style={{ justifyContent: "space-between" }}>
                <input
                    className="instructor-search"
                    placeholder="Search instructors…"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <select
                        className="instructor-department-filter"
                        value={selectedDepartment}
                        onChange={e => {
                            setSelectedDepartment(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept._id} value={dept.name}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    <button className="instructor-add-btn" onClick={() => {
                        setNewInstructor({ name: "", department: "", status: "Active", profileImage: "" });
                        setPreviewUrl(null);
                        setEditMode(false);
                        setEditId(null);
                        setShowModal(true);
                    }}>
                        Add Instructor
                    </button>
                </div>
            </div>

            <div className="instructor-table-container">
                <table className="instructor-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Details</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((i, idx) => (
                            <tr key={i._id}>
                                <td>{start + idx + 1}</td>
                                <td>
                                    <InstructorImage instructorId={i._id} />
                                </td>
                                <td>{i.name}</td>
                                <td>{i.department}</td>
                                <td>
                                    <Eye
                                        size={20}
                                        color="#0a3d18"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleView(i)}
                                    />
                                </td>
                                <td>
                                    <span className={i.status === "Active" ? "status-active" : "status-inactive"}>
                                        {i.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="action-btn edit" onClick={() => handleEdit(i)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(i._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {current.length === 0 && !loadingInstructors && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No instructors found.</td>
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
                <div className="adminupload-modal">
                    <div className="adminupload-modal-content wide">
                        <div className="adminupload-modal-header">
                            <h2>{editMode ? "Edit Instructor" : "Add Instructor"}</h2>
                            <span className="adminupload-close" onClick={resetForm}>
                                &times;
                            </span>
                        </div>

                        <div className="adminupload-modal-body">
                            <div className="adminupload-top-row">
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                                    <input
                                        type="text"
                                        placeholder="Enter Name"
                                        value={newInstructor.name}
                                        onChange={e => setNewInstructor({ ...newInstructor, name: e.target.value })}
                                        className="adminupload-title-input"
                                    />

                                    <select
                                        value={newInstructor.department}
                                        onChange={e => setNewInstructor({ ...newInstructor, department: e.target.value })}
                                        className="adminupload-title-input"
                                    >
                                        <option value="" disabled>Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept.name}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={newInstructor.status}
                                        onChange={e => setNewInstructor({ ...newInstructor, status: e.target.value })}
                                        className="adminupload-title-input"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div
                                    className="adminupload-image-box"
                                    onClick={() => fileInputRef.current.click()}
                                    style={{ width: "150px", height: "150px", borderRadius: "8px" }}
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="adminupload-image-preview"
                                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    ) : (
                                        <Image size={50} color="#888" />
                                    )}
                                </div>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="adminupload-modal-footer">
                            <button
                                className="adminupload-upload-btn"
                                onClick={handleSubmit}
                                disabled={isSaving}
                            >
                                {isSaving ? (editMode ? "Saving..." : "Adding...") : (editMode ? "Save Changes" : "Add Instructor")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showViewModal && viewInstructor && (
                <div className="adminupload-modal">
                    <div className="adminupload-modal-content" style={{ width: "400px" }}>
                        <div className="adminupload-modal-header">
                            <h2>Instructor Details</h2>
                            <span className="adminupload-close" onClick={closeViewModal}>
                                &times;
                            </span>
                        </div>

                        <div className="adminupload-modal-body" style={{ textAlign: "center" }}>
                            {viewInstructor.profileImage ? (
                                <img
                                    src={viewInstructor.profileImage}
                                    alt={viewInstructor.name}
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        marginBottom: "20px"
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "50%",
                                    background: "#ddd",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 20px"
                                }}>
                                    <span style={{ color: "#888" }}>No Image</span>
                                </div>
                            )}

                            <div style={{ textAlign: "left", padding: "0 20px" }}>
                                <p><strong>Name:</strong> {viewInstructor.name}</p>
                                <p><strong>Department:</strong> {viewInstructor.department}</p>
                                <p><strong>Status:</strong>
                                    <span className={viewInstructor.status === "Active" ? "status-active" : "status-inactive"}>
                                        {viewInstructor.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="adminupload-modal-footer">
                            <button className="adminupload-upload-btn" onClick={closeViewModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}