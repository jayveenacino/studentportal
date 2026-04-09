import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/user.css";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";

export default function Adminuser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");
    const [pendingUser, setPendingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "ADMIN",
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoadingUsers(true);
            try {
                await fetchUsers();
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchData();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/adminusers");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch admin users:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddUser = async () => {
        if (!formData.username || !formData.email || !formData.password) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill out all fields."
            });
            return;
        }

        if (formData.role === "ADMIN") {
            setPendingUser({ ...formData });
            setShowPinModal(true);
            return;
        }

        await saveUser(formData);
    };

    const handlePinSave = async () => {
        if (!pin || pin.length !== 4) {
            Swal.fire({
                icon: "warning",
                title: "Invalid PIN",
                text: "Please enter a 4-digit PIN."
            });
            return;
        }

        const userData = { ...pendingUser, pin };
        await saveUser(userData);
        
        setShowPinModal(false);
        setPin("");
        setPendingUser(null);
    };

    const saveUser = async (userData) => {
        setIsSaving(true);
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + "/api/adminusers", userData);
            Swal.fire("Success", res.data.message, "success");
            setShowModal(false);
            setFormData({ username: "", email: "", password: "", role: "ADMIN" });
            fetchUsers();
        } catch (err) {
            Swal.fire("Error", "Failed to add admin user", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteUser = async (id) => {
        Swal.fire({
            title: "Delete Admin User?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${import.meta.env.VITE_API_URL}/api/adminusers/${id}`);
                    Swal.fire("Deleted!", "Admin user removed.", "success");
                    fetchUsers();
                } catch (err) {
                    Swal.fire("Error", "Failed to delete admin user.", "error");
                }
            }
        });
    };

    const handleEditUser = async (user) => {
        const { value: newUsername } = await Swal.fire({
            title: "Edit Admin Username",
            input: "text",
            inputValue: user.username,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (newUsername && newUsername !== user.username) {
            try {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/adminusers/${user._id}`, {
                    username: newUsername,
                });
                Swal.fire("Updated!", "Admin user updated successfully.", "success");
                fetchUsers();
            } catch (err) {
                Swal.fire("Error", "Failed to update user.", "error");
            }
        }
    };

    const closePinModal = () => {
        setShowPinModal(false);
        setPin("");
        setPendingUser(null);
    };

    return (
        <div className="adminuser-container" style={{ position: "relative" }}>
            {loadingUsers && (
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
                        Loading Admin Users...
                    </p>
                </div>
            )}

            <div className="adminuser-header">
                <h1>Admin User Management</h1>
                <p>Manage administrator accounts for the system.</p>
            </div>

            <div className="adminuser-controls" style={{ justifyContent: "flex-end" }}>
                <button
                    className="adminuser-add-btn"
                    onClick={() => setShowModal(true)}
                    disabled={loading}
                >
                    Add User
                </button>
            </div>

            <div className="adminuser-table-container">
                <table className="adminuser-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Date Created</th>
                            <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, i) => (
                                <tr key={user._id}>
                                    <td>{i + 1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="adminuser-action-btn edit"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="adminuser-action-btn delete"
                                            onClick={() => handleDeleteUser(user._id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No admin users available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="adminuser-modal">
                    <div className="adminuser-modal-content">
                        <h2>Add New Admin User</h2>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="REGISTRAR">REGISTRAR</option>
                            <option value="ENCODER">ENCODER</option>
                            <option value="EVALUATOR">EVALUATOR</option>
                        </select>

                        <div className="adminuser-modal-buttons">
                            <button onClick={handleAddUser} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button onClick={() => setShowModal(false)} disabled={isSaving}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showPinModal && (
                <div className="adminuser-modal">
                    <div className="adminuser-modal-content" style={{ textAlign: "center" }}>
                        <h2 style={{ marginBottom: "10px" }}>Create Admin PIN</h2>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                            Create a 4-digit PIN for this Admin user
                        </p>
                        <input
                            type="password"
                            placeholder="••••"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            maxLength={4}
                            style={{
                                textAlign: "center",
                                fontSize: "24px",
                                letterSpacing: "8px",
                                padding: "15px",
                                width: "150px",
                                border: "2px solid #0a3d18",
                                borderRadius: "8px",
                                marginBottom: "20px"
                            }}
                        />
                        <div className="adminuser-modal-buttons" style={{ justifyContent: "center" }}>
                            <button onClick={handlePinSave} style={{ backgroundColor: "#0a3d18" }}>
                                Create PIN
                            </button>
                            <button onClick={closePinModal} style={{ backgroundColor: "#dc3545" }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}