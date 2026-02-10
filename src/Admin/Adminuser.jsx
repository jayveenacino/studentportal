import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/user.css";
import Swal from "sweetalert2";

export default function Adminuser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "ADMIN",
    });

    useEffect(() => {
        fetchUsers();
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
        setLoading(true);
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + "/api/adminusers", formData);
            Swal.fire("Success", res.data.message, "success");
            setShowModal(false);
            setFormData({ username: "", email: "", password: "", role: "ADMIN" });
            fetchUsers();
        } catch (err) {
            Swal.fire("Error", "Failed to add admin user", "error");
        } finally {
            setLoading(false);
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
                    await axios.delete(`http://localhost:2025/api/adminusers/${id}`);
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
                await axios.put(`http://localhost:2025/api/adminusers/${user._id}`, {
                    username: newUsername,
                });
                Swal.fire("Updated!", "Admin user updated successfully.", "success");
                fetchUsers();
            } catch (err) {
                Swal.fire("Error", "Failed to update user.", "error");
            }
        }
    };

    return (
        <div className="adminuser-container">
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
                    + Add Admin User
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
                                            Edit
                                        </button>
                                        <button
                                            className="adminuser-action-btn delete"
                                            onClick={() => handleDeleteUser(user._id)}
                                        >
                                            Delete
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
                        </select>

                        <div className="adminuser-modal-buttons">
                            <button onClick={handleAddUser} disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
