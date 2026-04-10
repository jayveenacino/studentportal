import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./Deancss/deanschedule.css"
import { Plus, Pencil, Trash2, Clock, Calendar, MapPin, Users } from "lucide-react"
import Swal from 'sweetalert2'

export default function DeanSchedule() {
    const [instructors, setInstructors] = useState([])
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    const deanData = JSON.parse(sessionStorage.getItem("Dean") || "{}")
    const deanDepartment = deanData?.name || ""
    
    console.log("Dean Department:", deanDepartment)
    console.log("Dean Data:", deanData)

    const [formData, setFormData] = useState({
        instructorId: "",
        instructorName: "",
        subjectCode: "",
        subjectName: "",
        set: "",
        time: "",
        date: "MWF",
        room: "",
        deptCode: ""
    })

    const perPage = 5
    const dateOptions = ["MWF", "TTH", "MW", "FS", "S"]

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [instructorsRes, schedulesRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/instructors`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/schedules`)
            ])

            console.log("All instructors from API:", instructorsRes.data)
            console.log("Dean Department for filtering:", deanDepartment)
            
            const filteredInstructors = instructorsRes.data.filter(i => {
                const match = i.department === deanDepartment
                console.log(`Checking instructor ${i.name}: dept=${i.department}, match=${match}`)
                return match
            })
            
            console.log("Filtered instructors:", filteredInstructors)
            
            const filteredSchedules = schedulesRes.data.filter(s => s.department === deanDepartment)

            setInstructors(filteredInstructors)
            setSchedules(filteredSchedules)
        } catch (err) {
            console.error("Failed to fetch data:", err)
        } finally {
            setLoading(false)
        }
    }

    const filtered = schedules.filter(s =>
        s.subjectCode?.toLowerCase().includes(search.toLowerCase()) ||
        s.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
        s.instructorName?.toLowerCase().includes(search.toLowerCase()) ||
        s.room?.toLowerCase().includes(search.toLowerCase())
    )

    const pageCount = Math.ceil(filtered.length / perPage)
    const start = (currentPage - 1) * perPage
    const current = filtered.slice(start, start + perPage)

    const handleInstructorChange = (e) => {
        const selected = instructors.find(i => i._id === e.target.value)
        setFormData({
            ...formData,
            instructorId: e.target.value,
            instructorName: selected ? selected.name : ""
        })
    }

    const handleSubmit = async () => {
        if (!formData.instructorId || !formData.subjectCode || !formData.subjectName || !formData.time || !formData.room || !formData.deptCode) {
            return Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill out all required fields.'
            })
        }

        setIsSaving(true)
        const payload = {
            ...formData,
            department: deanDepartment
        }

        try {
            if (editMode) {
                const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/schedules/${editId}`, payload)
                setSchedules(prev => prev.map(s => s._id === editId ? res.data : s))
                Swal.fire({ icon: 'success', title: 'Updated!', text: 'Schedule updated successfully.' })
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/schedules`, payload)
                setSchedules([res.data, ...schedules])
                Swal.fire({ icon: 'success', title: 'Created!', text: 'Schedule created successfully.' })
            }
            resetForm()
        } catch (err) {
            console.error("Save error:", err)
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not save schedule.' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleEdit = (schedule) => {
        setFormData({
            instructorId: schedule.instructorId || "",
            instructorName: schedule.instructorName || "",
            subjectCode: schedule.subjectCode || "",
            subjectName: schedule.subjectName || "",
            set: schedule.set || "",
            time: schedule.time || "",
            date: schedule.date || "MWF",
            room: schedule.room || "",
            deptCode: schedule.deptCode || ""
        })
        setEditId(schedule._id)
        setEditMode(true)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This schedule will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        })

        if (!result.isConfirmed) return

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/schedules/${id}`)
            setSchedules(prev => prev.filter(s => s._id !== id))
            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Schedule has been deleted.' })
        } catch (err) {
            console.error("Delete failed:", err)
            Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not delete schedule.' })
        }
    }

    const resetForm = () => {
        setShowModal(false)
        setEditMode(false)
        setEditId(null)
        setFormData({
            instructorId: "",
            instructorName: "",
            subjectCode: "",
            subjectName: "",
            set: "",
            time: "",
            date: "MWF",
            room: "",
            deptCode: ""
        })
    }

    const openCreateModal = () => {
        if (instructors.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Instructors',
                text: `No instructors found in ${deanDepartment || 'your'} department.`
            })
            return
        }
        resetForm()
        setShowModal(true)
    }

    return (
        <div className="deansched-container" style={{ position: "relative" }}>
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
                    <div className="deansched-spinner" />
                    <p style={{ marginTop: 15, fontWeight: "bold", color: "#1a3a1a" }}>
                        Loading Schedules...
                    </p>
                </div>
            )}

            <div className="deansched-header">
                <h1>Class Schedules</h1>
                <p>Manage class schedules for instructors in {deanDepartment || "your department"}.</p>
            </div>

            <div className="deansched-controls">
                <input
                    className="deansched-search"
                    placeholder="Search by subject, instructor, or room..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                    }}
                />
                <button className="deansched-add-btn" onClick={openCreateModal}>
                    Create Schedule
                </button>
            </div>

            <div className="deansched-table-container">
                <table className="deansched-table">
                    <thead>
                        <tr>
                            <th style={{ width: "50px" }}>#</th>
                            <th style={{ width: "15%" }}>Instructor</th>
                            <th style={{ width: "12%" }}>Subject Code</th>
                            <th style={{ width: "18%" }}>Subject Name</th>
                            <th style={{ width: "8%" }}>Set</th>
                            <th style={{ width: "12%" }}>Time</th>
                            <th style={{ width: "10%" }}>Date</th>
                            <th style={{ width: "10%" }}>Room</th>
                            <th style={{ width: "10%" }}>Dept Code</th>
                            <th style={{ width: "100px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((s, idx) => (
                            <tr key={s._id}>
                                <td>{start + idx + 1}</td>
                                <td><Users size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />{s.instructorName || "Unknown"}</td>
                                <td><span className="deansched-code">{s.subjectCode}</span></td>
                                <td>{s.subjectName}</td>
                                <td>{s.set || "-"}</td>
                                <td><Clock size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />{s.time}</td>
                                <td><Calendar size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />{s.date}</td>
                                <td><MapPin size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />{s.room}</td>
                                <td><span className="deansched-deptcode">{s.deptCode}</span></td>
                                <td>
                                    <button className="deansched-action-btn deansched-edit" onClick={() => handleEdit(s)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="deansched-action-btn deansched-delete" onClick={() => handleDelete(s._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {current.length === 0 && !loading && (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                                    {search ? "No schedules found matching your search." : "No schedules created yet."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pageCount > 1 && (
                <div className="deansched-pagination-controls">
                    {Array.from({ length: pageCount }, (_, idx) => (
                        <button
                            key={idx}
                            className={`deansched-pagination-btn ${currentPage === idx + 1 ? "deansched-pagination-active" : ""}`}
                            onClick={() => setCurrentPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="deansched-modal-overlay" onClick={resetForm}>
                    <div className="deansched-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="deansched-modal-header">
                            <h2>{editMode ? "Edit Schedule" : "Create Schedule"}</h2>
                            <span className="deansched-modal-close" onClick={resetForm}>&times;</span>
                        </div>

                        <div className="deansched-modal-body">
                            <div className="deansched-form-group">
                                <label>Instructor <span className="deansched-required">*</span></label>
                                <select
                                    className="deansched-select"
                                    value={formData.instructorId}
                                    onChange={handleInstructorChange}
                                >
                                    <option value="">-- Select Instructor --</option>
                                    {instructors.length === 0 ? (
                                        <option value="" disabled>No instructors available</option>
                                    ) : (
                                        instructors.map(i => (
                                            <option key={i._id} value={i._id}>{i.name}</option>
                                        ))
                                    )}
                                </select>
                                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                    Available instructors: {instructors.length} | Department: {deanDepartment || 'Not set'}
                                </small>
                            </div>

                            <div className="deansched-form-row">
                                <div className="deansched-form-group">
                                    <label>Subject Code <span className="deansched-required">*</span></label>
                                    <input
                                        type="text"
                                        className="deansched-input"
                                        placeholder="e.g., CS101"
                                        value={formData.subjectCode}
                                        onChange={e => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="deansched-form-group">
                                    <label>Subject Name <span className="deansched-required">*</span></label>
                                    <input
                                        type="text"
                                        className="deansched-input"
                                        placeholder="e.g., Programming 1"
                                        value={formData.subjectName}
                                        onChange={e => setFormData({ ...formData, subjectName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="deansched-form-row">
                                <div className="deansched-form-group">
                                    <label>Set</label>
                                    <input
                                        type="text"
                                        className="deansched-input"
                                        placeholder="e.g., A, B, 1"
                                        value={formData.set}
                                        onChange={e => setFormData({ ...formData, set: e.target.value })}
                                    />
                                </div>
                                <div className="deansched-form-group">
                                    <label>Time <span className="deansched-required">*</span></label>
                                    <input
                                        type="text"
                                        className="deansched-input"
                                        placeholder="e.g., 8:00 AM - 10:00 AM"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="deansched-form-row">
                                <div className="deansched-form-group">
                                    <label>Date <span className="deansched-required">*</span></label>
                                    <select
                                        className="deansched-select"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    >
                                        {dateOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="deansched-form-group">
                                    <label>Room <span className="deansched-required">*</span></label>
                                    <input
                                        type="text"
                                        className="deansched-input"
                                        placeholder="e.g., Room 101"
                                        value={formData.room}
                                        onChange={e => setFormData({ ...formData, room: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="deansched-form-group">
                                <label>Dept Code <span className="deansched-required">*</span></label>
                                <input
                                    type="text"
                                    className="deansched-input"
                                    placeholder="e.g., CS1E"
                                    value={formData.deptCode}
                                    onChange={e => setFormData({ ...formData, deptCode: e.target.value.toUpperCase() })}
                                />
                            </div>
                        </div>

                        <div className="deansched-modal-footer">
                            <button
                                className="deansched-btn-primary"
                                onClick={handleSubmit}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : (editMode ? "Update" : "Create")}
                            </button>
                            <button className="deansched-btn-secondary" onClick={resetForm} disabled={isSaving}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}