import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Admincss/adminupload.css";
import { FiImage } from "react-icons/fi";

export default function AdminUpload() {
    const [uploads, setUploads] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            const res = await axios.get("http://localhost:2025/api/uploads");
            setUploads(res.data);
        } catch (err) {
            console.error("Failed to fetch uploads:", err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            Swal.fire("Error", "Only image files are allowed!", "error");
            e.target.value = null;
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setTitle("");
        setCaption("");
        setShowModal(false);
        setIsEditMode(false);
        setCurrentEdit(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            Swal.fire("Missing Image", "Please upload an image for your announcement.", "warning");
            return;
        }

        if (!title.trim()) {
            Swal.fire("Missing Title", "Please enter a title for your announcement.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("title", title);
        formData.append("caption", caption || "");

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:2025/api/uploads", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Success", res.data.message, "success");
            resetForm();
            fetchUploads();
        } catch (err) {
            Swal.fire("Error", "Failed to post announcement.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (upload) => {
        setIsEditMode(true);
        setShowModal(true);
        setCurrentEdit(upload);
        setTitle(upload.title || "");
        setCaption(upload.caption || "");
        setPreviewUrl(`http://localhost:2025/uploads/${upload.filename}`);
    };

    const handleUpdate = async () => {
        if (!title.trim()) {
            Swal.fire("Missing Title", "Please enter a title before saving changes.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("caption", caption || "");
        if (selectedFile) formData.append("image", selectedFile);

        setLoading(true);
        try {
            await axios.put(`http://localhost:2025/api/uploads/${currentEdit._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Success", "Announcement updated successfully.", "success");
            resetForm();
            fetchUploads();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to update announcement.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (filename) => {
        Swal.fire({
            title: "Delete Announcement?",
            text: `This will permanently remove ${filename}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:2025/api/uploads/${filename}`);
                    Swal.fire("Deleted!", "Announcement removed.", "success");
                    fetchUploads();
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "Failed to delete announcement.", "error");
                }
            }
        });
    };

    return (
        <div className="adminupload-container">
            <div className="adminupload-header">
                <h1>Announcements</h1>
                <p>Manage event announcements with images, title, and captions.</p>
            </div>

            <div className="adminupload-controls">
                <button
                    className="adminupload-upload-btn"
                    onClick={() => {
                        setIsEditMode(false);
                        setShowModal(true);
                    }}
                >
                    Add Announcement
                </button>
            </div>

            <div className="adminupload-table-container">
                <table className="adminupload-table">
                    <thead style={{ fontSize: "16px" }}>
                        <tr>
                            <th>#</th>
                            <th>Preview</th>
                            <th  style={{textAlign: "center"}}>Title</th>
                            <th>Caption</th>
                            <th style={{textAlign: "center"}}>Date</th>
                            <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: "12px" }}>
                        {uploads.length > 0 ? (
                            uploads.map((u, i) => (
                                <tr key={u._id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        {u.filename && (
                                            <img
                                                src={`http://localhost:2025/uploads/${u.filename}`}
                                                alt="preview"
                                                className="adminupload-preview"
                                            />
                                        )}
                                    </td>
                                    <td  style={{textAlign: "center"}}>{u.title || "-"}</td>
                                    <td className="adminupload-caption-cell">
                                        <div
                                            className="caption-scroll"
                                            style={{ color: "#007bff", cursor: "pointer" }}
                                            onClick={() =>
                                                Swal.fire("Full Caption", u.caption || "No caption.")
                                            }
                                        >
                                            See More
                                        </div>
                                    </td>
                                    <td  style={{textAlign: "center"}}>{new Date(u.date).toLocaleString()}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="adminupload-action-btn edit"
                                            onClick={() => handleEdit(u)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="adminupload-action-btn delete"
                                            onClick={() => handleDelete(u.filename)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No announcements available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="adminupload-modal">
                    <div className="adminupload-modal-content wide">
                        <div className="adminupload-modal-header">
                            <h2>{isEditMode ? "Edit Announcement" : "Add Announcement"}</h2>
                            <span className="adminupload-close" onClick={resetForm}>
                                &times;
                            </span>
                        </div>

                        <div className="adminupload-modal-body">
                            <div className="adminupload-top-row">
                                <input
                                    type="text"
                                    placeholder="Title of your announcement"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="adminupload-title-input"
                                />
                                <div
                                    className="adminupload-image-box"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="adminupload-image-preview"
                                        />
                                    ) : (
                                        <FiImage size={50} color="#888" />
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

                            <textarea
                                placeholder="Write your announcement caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="adminupload-textarea"
                                rows="5"
                            />
                        </div>

                        <div className="adminupload-modal-footer">
                            <button
                                className="adminupload-upload-btn"
                                onClick={isEditMode ? handleUpdate : handleUpload}
                                disabled={loading}
                            >
                                {loading
                                    ? isEditMode
                                        ? "Saving..."
                                        : "Posting..."
                                    : isEditMode
                                        ? "Save Changes"
                                        : "Post Announcement"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
