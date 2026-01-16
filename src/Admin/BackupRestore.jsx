import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/backuprestore.css";
import Swal from "sweetalert2";

export default function BackupRestore() {
    // const [backups, setBackups] = useState([]);
    // const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     fetchBackups();
    // }, []);

    // const fetchBackups = async () => {
    //     try {
    //         const res = await axios.get(import.meta.env.VITE_API_URL + "/api/backups");
    //         setBackups(res.data);
    //     } catch (err) {
    //         console.error("Failed to fetch backups:", err);
    //     }
    // };


    // const handleBackup = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await axios.post(import.meta.env.VITE_API_URL + "/api/backups/create");
    //         Swal.fire("Success", res.data.message, "success");
    //         fetchBackups();
    //     } catch (err) {
    //         Swal.fire("Error", "Failed to create backup", "error");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleRestore = async (filename) => {
    //     Swal.fire({
    //         title: "Are you sure?",
    //         text: `Restore database from ${filename}? This will overwrite current data.`,
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Yes, restore it!",
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             try {
    //                 await axios.post(`http://localhost:2025/api/backups/restore/${filename}`);
    //                 Swal.fire("Restored!", "Database restored successfully.", "success");
    //             } catch (err) {
    //                 console.error(err);
    //                 Swal.fire("Error", "Failed to restore database.", "error");
    //             }
    //         }
    //     });
    // };

    // const handleDownload = (filename) => {
    //     window.open(`http://localhost:2025/api/backups/download/${filename}`, "_blank");
    // };

    // const handleDelete = async (filename) => {
    //     Swal.fire({
    //         title: "Delete Backup?",
    //         text: `This will permanently remove ${filename}`,
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Delete",
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             try {
    //                 await axios.delete(`http://localhost:2025/api/backups/${filename}`);
    //                 Swal.fire("Deleted!", "Backup removed.", "success");
    //                 fetchBackups();
    //             } catch (err) {
    //                 console.error(err);
    //                 Swal.fire("Error", "Failed to delete backup.", "error");
    //             }
    //         }
    //     });
    // };

    // return (
    //     <div className="backuprestore-container">
    //         <div className="backuprestore-header">
    //             <h1>Backup & Restore</h1>
    //             <p>Manage your database backups and restore points.</p>
    //         </div>

    //         <div className="backuprestore-controls" style={{ justifyContent: "flex-end" }}>
    //             <button
    //                 className="backuprestore-add-btn"
    //                 onClick={handleBackup}
    //                 disabled={loading}
    //             >
    //                 {loading ? "Backing up..." : "+ Create Backup"}
    //             </button>
    //         </div>

    //         <div className="backuprestore-table-container">
    //             <table className="backuprestore-table">
    //                 <thead>
    //                     <tr>
    //                         <th>#</th>
    //                         <th>Filename</th>
    //                         <th>Date</th>
    //                         <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {backups.length > 0 ? (
    //                         backups.map((b, i) => (
    //                             <tr key={b.filename}>
    //                                 <td>{i + 1}</td>
    //                                 <td>{b.filename}</td>
    //                                 <td>{new Date(b.date).toLocaleString()}</td>
    //                                 <td style={{ textAlign: "right" }}>
    //                                     <button
    //                                         className="backup-action-btn edit"
    //                                         onClick={() => handleRestore(b.filename)}
    //                                     >
    //                                         Restore
    //                                     </button>
    //                                     <button
    //                                         className="backup-action-btn"
    //                                         onClick={() => handleDownload(b.filename)}
    //                                     >
    //                                         Download
    //                                     </button>
    //                                     <button
    //                                         className="backup-action-btn delete"
    //                                         onClick={() => handleDelete(b.filename)}
    //                                     >
    //                                         Delete
    //                                     </button>
    //                                 </td>
    //                             </tr>
    //                         ))
    //                     ) : (
    //                         <tr>
    //                             <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
    //                                 No backups available.
    //                             </td>
    //                         </tr>
    //                     )}
    //                 </tbody>
    //             </table>
    //         </div>
    //     </div>
    return (
        <div style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h1>Backup & Restore Under Investigation! 😒</h1>
        </div>
    );
}
