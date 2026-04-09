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
    const [isCreatingPin, setIsCreatingPin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");
    const [pendingUser, setPendingUser] = useState(null);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "ADMIN",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPin, setShowPin] = useState(false);

    useEffect(() => {
        const storedAdmin = sessionStorage.getItem("Admin");
        if (storedAdmin) {
            setCurrentAdmin(JSON.parse(storedAdmin));
        }
        
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

    const canAddUser = () => {
        if (!currentAdmin) return false;
        const allowedRoles = ["ADMIN", "Super Admin"];
        return allowedRoles.includes(currentAdmin.role);
    };

    const canEditDelete = () => {
        if (!currentAdmin) return false;
        const allowedRoles = ["ADMIN", "Super Admin"];
        return allowedRoles.includes(currentAdmin.role);
    };

    const adminExists = () => {
        return users.some(user => user.role === "ADMIN");
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

        if (formData.role === "ADMIN" && adminExists()) {
            Swal.fire({
                icon: "error",
                title: "Admin Already Exists",
                text: "Only one ADMIN account is allowed."
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
        if (!pin || pin.length !== 6) {
            Swal.fire({
                icon: "warning",
                title: "Invalid PIN",
                text: "Please enter a 6-digit PIN."
            });
            return;
        }

        setIsCreatingPin(true);

        const userData = { ...pendingUser, pin };
        
        try {
            await saveUser(userData);
            setShowPinModal(false);
            setPin("");
            setPendingUser(null);
            setShowPin(false);
        } catch (err) {
            console.error("Error creating user with PIN:", err);
        } finally {
            setIsCreatingPin(false);
        }
    };

    const saveUser = async (userData) => {
        setIsSaving(true);
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + "/api/adminusers", userData);
            Swal.fire("Success", res.data.message, "success");
            setShowModal(false);
            setFormData({ username: "", email: "", password: "", role: "ADMIN" });
            setShowPassword(false);
            fetchUsers();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed to add admin user", "error");
            throw err;
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
        if (isCreatingPin) return;
        setShowPinModal(false);
        setPin("");
        setPendingUser(null);
        setShowPin(false);
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
                {canAddUser() && (
                    <button
                        className="adminuser-add-btn"
                        onClick={() => setShowModal(true)}
                        disabled={loading}
                    >
                        Add User
                    </button>
                )}
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
                            {canEditDelete() && (
                                <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
                            )}
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
                                    {canEditDelete() && (
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
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={canEditDelete() ? 6 : 5} style={{ textAlign: "center", padding: "20px" }}>
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
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                style={{ width: "100%", paddingRight: "35px" }}
                            />
                            <i 
                                className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    cursor: "pointer",
                                    color: "#666"
                                }}
                            />
                        </div>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="ADMIN">ADMIN (Requires PIN)</option>
                            <option value="REGISTRAR">REGISTRAR (Uses Admin PIN)</option>
                            <option value="ENCODER">ENCODER (Uses Admin PIN)</option>
                            <option value="EVALUATOR">EVALUATOR (Uses Admin PIN)</option>
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
                    <div className="adminuser-modal-content" style={{ textAlign: "center", maxWidth: "350px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h2 style={{ marginBottom: "10px", color: "#0a3d18", width: "100%" }}>Create Admin PIN</h2>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "25px", width: "100%" }}>
                            Create a 6-digit PIN for {pendingUser?.username}
                        </p>
                        <p style={{ color: "#999", fontSize: "12px", marginBottom: "25px", width: "100%" }}>
                            This PIN will be used by ADMIN, REGISTRAR, ENCODER, and EVALUATOR
                        </p>
                        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", marginBottom: "25px" }}>
                            <input
                                type={showPin ? "text" : "password"}
                                placeholder="••••••"
                                value={pin}
                                onChange={e => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setPin(value);
                                }}
                                maxLength={6}
                                disabled={isCreatingPin}
                                style={{
                                    textAlign: "center",
                                    fontSize: "24px",
                                    letterSpacing: "8px",
                                    padding: "15px",
                                    paddingRight: "45px",
                                    width: "180px",
                                    border: "2px solid #0a3d18",
                                    borderRadius: "8px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    opacity: isCreatingPin ? 0.6 : 1
                                }}
                            />
                            <i 
                                className={showPin ? "fas fa-eye-slash" : "fas fa-eye"}
                                onClick={() => setShowPin(!showPin)}
                                style={{
                                    position: "absolute",
                                    right: "calc(50% - 70px)",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#666",
                                    fontSize: "18px"
                                }}
                            />
                        </div>
                        <div className="adminuser-modal-buttons" style={{ justifyContent: "center", width: "100%" }}>
                            <button 
                                onClick={handlePinSave} 
                                disabled={isCreatingPin || pin.length !== 6}
                                style={{ 
                                    backgroundColor: "#0a3d18",
                                    padding: "12px 24px",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    opacity: isCreatingPin || pin.length !== 6 ? 0.6 : 1,
                                    cursor: isCreatingPin || pin.length !== 6 ? "not-allowed" : "pointer"
                                }}
                            >
                                {isCreatingPin ? "Creating..." : "Create PIN"}
                            </button>
                            <button 
                                onClick={closePinModal} 
                                disabled={isCreatingPin}
                                style={{ 
                                    backgroundColor: "#dc3545",
                                    padding: "12px 24px",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    opacity: isCreatingPin ? 0.6 : 1,
                                    cursor: isCreatingPin ? "not-allowed" : "pointer"
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}