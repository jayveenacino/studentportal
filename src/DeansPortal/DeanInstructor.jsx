    import React, { useEffect, useState, useRef } from 'react'
    import axios from 'axios'
    import "./Deancss/instructordean.css"
    import { Eye } from "lucide-react"

    export default function Instructor() {
        const [instructors, setInstructors] = useState([])
        const [loading, setLoading] = useState(true)
        const [search, setSearch] = useState("")
        const [currentPage, setCurrentPage] = useState(1)
        const [showViewModal, setShowViewModal] = useState(false)
        const [viewInstructor, setViewInstructor] = useState(null)

        const deanData = JSON.parse(sessionStorage.getItem("Dean") || "{}")
        const deanDepartment = deanData?.name || ""

        const perPage = 5

        useEffect(() => {
            const fetchInstructors = async () => {
                setLoading(true)
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/instructors`)
                    const filteredByDept = res.data.filter(i => i.department === deanDepartment)
                    setInstructors(filteredByDept)
                } catch (err) {
                    console.error("Failed to fetch instructors:", err)
                } finally {
                    setLoading(false)
                }
            }

            fetchInstructors()
        }, [deanDepartment])

        const filtered = instructors.filter(i =>
            i.name.toLowerCase().includes(search.toLowerCase())
        )

        const pageCount = Math.ceil(filtered.length / perPage)
        const start = (currentPage - 1) * perPage
        const current = filtered.slice(start, start + perPage)

        const handleView = (instructor) => {
            setViewInstructor(instructor)
            setShowViewModal(true)
        }

        return (
            <div className="dean-instructor-container" style={{ position: "relative" }}>
                {loading && (
                    <div style={{
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
                    }}>
                        <div className="dean-instructor-spinner" />
                        <p style={{ marginTop: 15, fontWeight: "bold", color: "#1a3a1a" }}>
                            Loading Instructors...
                        </p>
                    </div>
                )}

                <div className="dean-instructor-header">
                    <h1>Instructors</h1>
                    <p>Manage faculty members in {deanDepartment || "your department"}.</p>
                </div>

                <div className="dean-instructor-controls">
                    <input
                        className="dean-instructor-search"
                        placeholder="Search instructors..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>

                <div className="dean-instructor-table-container">
                    <table className="dean-instructor-table" style={{ width: "100%", tableLayout: "fixed" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "60px" }}>#</th>
                                <th style={{ width: "80px" }}>Profile</th>
                                <th style={{ width: "25%" }}>Name</th>
                                <th style={{ width: "20%" }}>Department</th>
                                <th style={{ width: "25%" }}>Details</th>
                                <th style={{ width: "100px" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.map((i, idx) => (
                                <tr key={i._id || i.id} style={{ cursor: "pointer" }} onClick={() => handleView(i)}>
                                    <td>{start + idx + 1}</td>
                                    <td>
                                        {i.profileImage ? (
                                            <img
                                                src={i.profileImage}
                                                alt={i.name}
                                                style={{ width: "50px", height: "50px", borderRadius: "10%", objectFit: "cover" }}
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
                                        )}
                                    </td>
                                    <td style={{ fontSize: "16px", fontWeight: "bold" }}>{i.name}</td>
                                    <td>{i.department}</td>
                                    <td style={{ color: "#666", fontSize: "14px" }}>
                                        Click to view details <Eye size={14} style={{ verticalAlign: "middle", marginLeft: "5px" }} />
                                    </td>
                                    <td>
                                        <span className={i.status === "Active" ? "dean-instructor-status-active" : "dean-instructor-status-inactive"}>
                                            {i.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {current.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                        {search ? "No instructors found matching your search." : "No instructors in this department."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pageCount > 1 && (
                    <div className="dean-instructor-pagination-controls">
                        {Array.from({ length: pageCount }, (_, idx) => (
                            <button
                                key={idx}
                                className={`dean-instructor-pagination-btn ${currentPage === idx + 1 ? "dean-instructor-pagination-active" : ""}`}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                )}

                {showViewModal && viewInstructor && (
                    <div className="dean-instructor-modal-overlay" onClick={() => setShowViewModal(false)}>
                        <div className="dean-instructor-modal-content dean-instructor-modal-view" onClick={e => e.stopPropagation()}>
                            <div className="dean-instructor-modal-header">
                                <h2>Instructor Details</h2>
                                <span className="dean-instructor-modal-close" onClick={() => setShowViewModal(false)}>&times;</span>
                            </div>

                            <div className="dean-instructor-modal-body" style={{ textAlign: "center" }}>
                                {viewInstructor.profileImage ? (
                                    <img
                                        src={viewInstructor.profileImage}
                                        alt={viewInstructor.name}
                                        style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "20px" }}
                                    />
                                ) : (
                                    <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                        <span style={{ color: "#888" }}>No Image</span>
                                    </div>
                                )}

                                <div className="dean-instructor-view-details">
                                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>{viewInstructor.name}</p>
                                    <p><strong>Department:</strong> {viewInstructor.department}</p>
                                    <p><strong>Status:</strong>
                                        <span className={viewInstructor.status === "Active" ? "dean-instructor-status-active" : "dean-instructor-status-inactive"}>
                                            {viewInstructor.status}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="dean-instructor-modal-footer">
                                <button className="dean-instructor-modal-btn-primary" onClick={() => setShowViewModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }