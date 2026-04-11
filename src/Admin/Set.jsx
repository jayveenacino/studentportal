import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/sets.css";
import Swal from 'sweetalert2';
import { ChevronLeft, ChevronDown, Plus, X, MoreVertical, Calendar, Settings, Trash2 } from "lucide-react";

export default function Set() {
    const [departments, setDepartments] = useState([]);
    const [sets, setSets] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingSets, setLoadingSets] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [expandedYear, setExpandedYear] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const [showCapModal, setShowCapModal] = useState(false);
    const [selectedSet, setSelectedSet] = useState(null);
    const [newCapacity, setNewCapacity] = useState(20);

    // Loading states for actions
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingSet, setIsAddingSet] = useState(false);

    const perPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoadingSets(true);
            try {
                await fetchSets();
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSets(false);
            }
        };
        fetchData();
    }, []);

    const fetchSets = async () => {
        try {
            const deptRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/departments`).catch(() => ({ data: [] }));
            const setsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/sets`).catch(() => ({ data: [] }));
            setDepartments(deptRes.data);
            setSets(setsRes.data);
        } catch (err) {
            console.error("Failed to fetch sets:", err);
        }
    };

    const handleAddSet = async (deptName, year) => {
        if (isAddingSet) return;

        setIsAddingSet(true);

        const yearSets = sets.filter(s => s.department === deptName && s.year === year);
        const sortedSets = [...yearSets].sort((a, b) => a.letter.localeCompare(b.letter));
        const lastLetter = sortedSets.length > 0 ? sortedSets[sortedSets.length - 1].letter : "@";
        const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);

        if (nextLetter > "Z") {
            setIsAddingSet(false);
            Swal.fire("Limit Reached", "Cannot add more sets.", "warning");
            return;
        }

        const deptObj = departments.find(d => d.name === deptName);

        try {
            const payload = {
                departmentId: deptObj._id,
                departmentName: deptName,
                yearLevel: year,
                sets: [...yearSets.map(s => ({ letter: s.letter, capacity: s.capacity })), { letter: nextLetter, capacity: 20 }]
            };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/sets/bulk`, payload);
            await fetchSets();
            Swal.fire("Success", `Set ${nextLetter} added to ${year}`, "success");
        } catch (err) {
            Swal.fire("Error", "Failed to add set", "error");
        } finally {
            setIsAddingSet(false);
        }
    };

    const handleUpdateCapacity = async () => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            const yearSets = sets.filter(s => s.department === selectedSet.department && s.year === selectedSet.year);
            const updatedSets = yearSets.map(s =>
                s._id === selectedSet._id ? { ...s, capacity: newCapacity } : s
            );

            const deptObj = departments.find(d => d.name === selectedSet.department);

            await axios.post(`${import.meta.env.VITE_API_URL}/api/sets/bulk`, {
                departmentId: deptObj._id,
                departmentName: selectedSet.department,
                yearLevel: selectedSet.year,
                sets: updatedSets.map(s => ({ letter: s.letter, capacity: s.capacity }))
            });

            setShowCapModal(false);
            await fetchSets();
            Swal.fire("Updated", "Capacity changed successfully", "success");
        } catch (err) {
            Swal.fire("Error", "Update failed", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSet = async (setToDelete) => {
        if (isSaving) return;

        const yearSets = sets.filter(s => s.department === setToDelete.department && s.year === setToDelete.year);
        const sortedSets = [...yearSets].sort((a, b) => a.letter.localeCompare(b.letter));

        const isLastSet = sortedSets[sortedSets.length - 1]._id === setToDelete._id;

        if (!isLastSet) {
            Swal.fire("Cannot Delete", "Only the last set can be deleted.", "error");
            return;
        }

        const confirm = await Swal.fire({
            title: "Delete Set?",
            text: `Are you sure you want to delete Set ${setToDelete.letter}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#0a3d18",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel"
        });

        if (!confirm.isConfirmed) return;

        setIsSaving(true);

        try {
            const remainingSets = sortedSets.filter(s => s._id !== setToDelete._id);
            const deptObj = departments.find(d => d.name === setToDelete.department);

            await axios.post(`${import.meta.env.VITE_API_URL}/api/sets/bulk`, {
                departmentId: deptObj._id,
                departmentName: setToDelete.department,
                yearLevel: setToDelete.year,
                sets: remainingSets.map(s => ({ letter: s.letter, capacity: s.capacity }))
            });

            await fetchSets();
            setActiveMenuId(null);
            Swal.fire("Deleted", `Set ${setToDelete.letter} has been deleted.`, "success");
        } catch (err) {
            Swal.fire("Error", "Failed to delete set", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const isSetDeletable = (setItem) => {
        const yearSets = sets.filter(s => s.department === setItem.department && s.year === setItem.year);
        const sortedSets = [...yearSets].sort((a, b) => a.letter.localeCompare(b.letter));
        return sortedSets[sortedSets.length - 1]._id === setItem._id;
    };

    const filtered = departments.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));
    const current = filtered.slice((currentPage - 1) * perPage, (currentPage - 1) * perPage + perPage);

    return (
        <div className="set-container" onClick={() => setActiveMenuId(null)} style={{ position: "relative" }}>
            {/* Full Page Loading Overlay - Same UI as Departments */}
            {loadingSets && (
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
                        Loading Sets...
                    </p>
                </div>
            )}

            <div className="set-header">
                <h1>Set List</h1>
                <p>Manage and configure student sections per department.</p>
            </div>

            <div className="set-controls">
                <input className="set-search" placeholder="Search departments..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="set-table-container">
                <table className="set-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Department Name</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.map((dept, i) => (
                            <React.Fragment key={dept._id}>
                                <tr onClick={() => setExpandedId(expandedId === dept._id ? null : dept._id)} style={{ cursor: "pointer" }}>
                                    <td>{(currentPage - 1) * perPage + i + 1}</td>
                                    <td>{dept.name}</td>
                                    <td style={{ textAlign: "right" }}>
                                        {expandedId === dept._id ? <ChevronDown size={18} /> : <ChevronLeft size={18} />}
                                    </td>
                                </tr>

                                {expandedId === dept._id && (
                                    <tr>
                                        <td colSpan="3" className="expanded-row-content">
                                            <div className="horizontal-year-container">
                                                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(year => {
                                                    const yearSets = sets.filter(s => s.department === dept.name && s.year === year);
                                                    const isYearExpanded = expandedYear === `${dept._id}-${year}`;

                                                    return (
                                                        <div key={year} className="year-group">
                                                            <div className="year-header-row" onClick={() => setExpandedYear(isYearExpanded ? null : `${dept._id}-${year}`)}>
                                                                <div className="year-title">
                                                                    <Calendar size={14} color="#0a3d18" />
                                                                    <span>{year}</span>
                                                                    <small>({yearSets.length} Sets)</small>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                    {isYearExpanded && (
                                                                        <button
                                                                            className="add-set-corner-btn"
                                                                            onClick={(e) => { e.stopPropagation(); handleAddSet(dept.name, year); }}
                                                                            disabled={isAddingSet}
                                                                        >
                                                                            {isAddingSet ? (
                                                                                <>
                                                                                    <div className="btn-spinner" style={{ width: 14, height: 14, border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                                                                    Adding...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Plus size={14} /> Add Set
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    )}
                                                                    {isYearExpanded ? <ChevronDown size={14} /> : <ChevronLeft size={14} />}
                                                                </div>
                                                            </div>

                                                            {isYearExpanded && (
                                                                <div className="horizontal-sets-wrapper">
                                                                    {yearSets.sort((a, b) => a.letter.localeCompare(b.letter)).map((s) => (
                                                                        <div key={s._id} className="set-card-horizontal">
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                <span className="set-letter">{s.letter}</span>
                                                                                <span className="set-cap">{s.capacity} Max</span>
                                                                            </div>

                                                                            <MoreVertical
                                                                                size={14}
                                                                                className="three-dot-btn"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setActiveMenuId(activeMenuId === s._id ? null : s._id);
                                                                                }}
                                                                            />

                                                                            {activeMenuId === s._id && (
                                                                                <div className="dropdown-menu">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setSelectedSet(s);
                                                                                            setNewCapacity(s.capacity);
                                                                                            setShowCapModal(true);
                                                                                        }}
                                                                                        disabled={isSaving}
                                                                                    >
                                                                                        <Settings size={14} /> Change Capacity
                                                                                    </button>
                                                                                    <button
                                                                                        className="delete-btn"
                                                                                        onClick={() => handleDeleteSet(s)}
                                                                                        disabled={!isSetDeletable(s) || isSaving}
                                                                                    >
                                                                                        <Trash2 size={14} /> Delete This Set
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCapModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>Set {selectedSet?.letter} Capacity</h3>
                            <X style={{ cursor: 'pointer' }} onClick={() => !isSaving && setShowCapModal(false)} />
                        </div>
                        <p style={{ fontSize: '13px', color: '#666' }}>Select new maximum students for this set.</p>
                        <select
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}
                            value={newCapacity}
                            onChange={e => setNewCapacity(parseInt(e.target.value))}
                            disabled={isSaving}
                        >
                            {[20, 30, 40, 50, 60].map(c => <option key={c} value={c}>{c} Students Max</option>)}
                        </select>
                        <button
                            className="save-btn-final"
                            style={{ width: '100%' }}
                            onClick={handleUpdateCapacity}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <div className="btn-spinner-white" style={{ width: 16, height: 16, border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    Updating...
                                </span>
                            ) : (
                                "UPDATE CAPACITY"
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* CSS for spinner animation */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #006666;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}