import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./Deancss/deanschedule.css"
import { Plus, Pencil, Trash2, Clock, Calendar, MapPin, Users, Search } from "lucide-react"
import Swal from 'sweetalert2'

export default function DeanSchedule() {
    const [instructors, setInstructors] = useState([])
    const [subjects, setSubjects] = useState([])
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [subjectSearchQuery, setSubjectSearchQuery] = useState("")
    const [filteredSubjects, setFilteredSubjects] = useState([])
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)

    const deanData = JSON.parse(sessionStorage.getItem("Dean") || "{}")
    const deanDepartment = deanData?.name || ""

    const [formData, setFormData] = useState({
        instructorId: "",
        instructorName: "",
        subjectCode: "",
        subjectName: "",
        set: "",
        time: "",
        customTime: "",
        date: "MWF",
        room: "",
        deptCode: ""
    })

    const perPage = 5
    const dateOptions = ["Monday-Wednesday-Friday", "Monday-Thursday", "Wednesday", "Tuesday-Thursday","Tuesday-Friday", "Saturday"]
    const timeOptions = ["8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM"]

    useEffect(() => {
        fetchData()
    }, [deanDepartment])

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/instructors`)
            const filteredByDept = res.data.filter(i => i.department === deanDepartment)
            setInstructors(filteredByDept)
            console.log("Instructors loaded:", filteredByDept.length)

            const subjectsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/subjects`)
            console.log("Subjects API response:", subjectsRes.data)
            console.log("Subjects count:", subjectsRes.data?.length || 0)
            setSubjects(subjectsRes.data || [])

            const schedulesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/schedules`)
            const filteredSchedules = schedulesRes.data.filter(s => s.department === deanDepartment)
            setSchedules(filteredSchedules)
            console.log("Schedules loaded:", filteredSchedules.length)
        } catch (err) {
            console.error("Failed to fetch data:", err)
            console.error("Error details:", err.response?.data || err.message)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (subjectSearchQuery.trim() === "") {
            setFilteredSubjects([])
        } else {
            const filtered = subjects.filter(s =>
                s.code.toLowerCase().includes(subjectSearchQuery.toLowerCase()) ||
                s.name.toLowerCase().includes(subjectSearchQuery.toLowerCase())
            ).slice(0, 5)
            setFilteredSubjects(filtered)
        }
    }, [subjectSearchQuery, subjects])

    const filtered = schedules.filter(s =>
        s.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
        s.subjectName.toLowerCase().includes(search.toLowerCase()) ||
        s.instructorName.toLowerCase().includes(search.toLowerCase()) ||
        s.room.toLowerCase().includes(search.toLowerCase())
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

    const handleSubjectSelect = (subject) => {
        setFormData({
            ...formData,
            subjectCode: subject.code,
            subjectName: subject.name
        })
        setSubjectSearchQuery(subject.code)
        setShowSubjectDropdown(false)
    }

    const handleSubjectCodeChange = (e) => {
        const value = e.target.value
        setSubjectSearchQuery(value)
        setShowSubjectDropdown(true)
        setFormData({
            ...formData,
            subjectCode: value,
            subjectName: value === "" ? "" : formData.subjectName
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
            instructorId: schedule.instructorId,
            instructorName: schedule.instructorName,
            subjectCode: schedule.subjectCode,
            subjectName: schedule.subjectName,
            set: schedule.set || "",
            time: schedule.time,
            date: schedule.date,
            room: schedule.room,
            deptCode: schedule.deptCode
        })
        setSubjectSearchQuery(schedule.subjectCode)
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
        setSubjectSearchQuery("")
        setShowSubjectDropdown(false)
        setFilteredSubjects([])
        setFormData({
            instructorId: "",
            instructorName: "",
            subjectCode: "",
            subjectName: "",
            set: "",
            time: "",
            customTime: "",
            date: "MWF",
            room: "",
            deptCode: ""
        })
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.subject-search-container')) {
                setShowSubjectDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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
                <button className="deansched-add-btn" onClick={() => setShowModal(true)}>
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
                            <th style={{ width: "100px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((s, idx) => (
                            <tr key={s._id}>
                                <td>{start + idx + 1}</td>
                                <td><Users size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />{s.instructorName}</td>
                                <td><span className="deansched-code">{s.subjectCode}</span></td>
                                <td>{s.subjectName}</td>
                                <td>{s.set || "-"}</td>
                                <td><Clock size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />{s.time}</td>
                                <td><Calendar size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />{s.date}</td>
                                <td><MapPin size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />{s.room}</td>
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
                                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
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
                        </div>

                        <div className="deansched-modal-body">
                            <div className="deansched-form-group">
                                <label>Instructor <span className="deansched-required">*</span></label>
                                <select
                                    className="deansched-select"
                                    value={formData.instructorId}
                                    onChange={handleInstructorChange}
                                >
                                    <option value="" disabled>Select Instructor</option>
                                    {instructors.map(i => (
                                        <option key={i._id} value={i._id}>{i.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="deansched-form-row">
                                <div className="deansched-form-group subject-search-container" style={{ position: 'relative' }}>
                                    <label>Subject Code <span className="deansched-required">*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#666',
                                            pointerEvents: 'none'
                                        }} />
                                        <input
                                            type="text"
                                            className="deansched-input"
                                            placeholder="Search subject code..."
                                            value={subjectSearchQuery}
                                            onChange={handleSubjectCodeChange}
                                            onFocus={() => subjectSearchQuery && setShowSubjectDropdown(true)}
                                            style={{ paddingLeft: '40px' }}
                                        />
                                    </div>

                                    {showSubjectDropdown && filteredSubjects.length > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: 'white',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            marginTop: '4px',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            zIndex: 1000,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }}>
                                            {filteredSubjects.map((subject) => (
                                                <div
                                                    key={subject._id}
                                                    onClick={() => handleSubjectSelect(subject)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid #f0f0f0',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                    onMouseLeave={(e) => e.target.style.background = 'white'}
                                                >
                                                    <div style={{ fontWeight: '600', color: '#1a3a1a' }}>
                                                        {subject.code}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                                                        {subject.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {showSubjectDropdown && subjectSearchQuery && filteredSubjects.length === 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: 'white',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            marginTop: '4px',
                                            padding: '12px 16px',
                                            color: '#666',
                                            fontSize: '14px',
                                            zIndex: 1000
                                        }}>
                                            No subjects found
                                        </div>
                                    )}
                                </div>

                                <div className="deansched-form-group">
                                    <label>Subject Name <span className="deansched-required">*</span></label>
                                    <input
                                        type="text"
                                        className="deansched-input"
                                        placeholder="Auto-populated from subject code"
                                        value={formData.subjectName}
                                        readOnly
                                        style={{
                                            backgroundColor: formData.subjectName ? '#f0f8f0' : '#f5f5f5',
                                            cursor: 'default',
                                            fontWeight: formData.subjectName ? '500' : 'normal'
                                        }}
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
                                    {formData.time === "custom" ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                className="deansched-input"
                                                placeholder="e.g., 1:00 PM - 3:00 PM"
                                                value={formData.customTime}
                                                onChange={e => setFormData({ ...formData, customTime: e.target.value })}
                                                style={{ flex: 1 }}
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                className="deansched-btn-secondary"
                                                onClick={() => setFormData({ ...formData, time: "", customTime: "" })}
                                                style={{ padding: '8px 12px', fontSize: '12px' }}
                                            >
                                                Back to List
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            className="deansched-select"
                                            value={formData.time}
                                            onChange={e => {
                                                if (e.target.value === "custom") {
                                                    setFormData({ ...formData, time: "custom", customTime: "" })
                                                } else {
                                                    setFormData({ ...formData, time: e.target.value })
                                                }
                                            }}
                                        >
                                            <option value="" disabled>Set Time</option>
                                            {timeOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                            <option value="custom">Custom Time</option>
                                        </select>
                                    )}
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
                                        <option value="" disabled>Set Date</option>
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