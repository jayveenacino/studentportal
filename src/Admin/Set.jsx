import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincss/sets.css";
import Swal from 'sweetalert2';
import { ChevronLeft, ChevronDown, Plus, X, MoreVertical, Trash2 } from "lucide-react";

export default function Set() {
    const [departments, setDepartments] = useState([]);
    const [sets, setSets] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingData, setLoadingData] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [activeDept, setActiveDept] = useState(null);
    const [yearLevel, setYearLevel] = useState("1st Year");
    const [modalSets, setModalSets] = useState([]);
    const [openMenuIdx, setOpenMenuIdx] = useState(null);

    const perPage = 5;

    const getDefaultSets = (deptName, year) => {
        let count = 4;
        if (year === "1st Year") count = 6;
        if (year === "3rd Year") count = 4;
        if (year === "4th Year") count = 2;

        if (deptName?.includes("Engineering")) count += 2;
        if (deptName?.includes("Nursing")) count = 5;

        const newSets = [];
        for (let i = 0; i < count; i++) {
            newSets.push({ letter: String.fromCharCode(65 + i), capacity: 20 });
        }
        return newSets;
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (showModal && activeDept) {
            setModalSets(getDefaultSets(activeDept.name, yearLevel));
        }
    }, [showModal, activeDept]);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const deptRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/departments`).catch(() => ({ data: [] }));
            const setsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/sets`).catch(() => ({ data: [] }));
            setDepartments(deptRes.data);
            setSets(setsRes.data);
        } catch (err) {
            console.error("General Error:", err);
        } finally {
            setLoadingData(false);
        }
    };

    const toggleRow = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleAddMoreSet = () => {
        const lastLetter = modalSets.length > 0 ? modalSets[modalSets.length - 1].letter : "@";
        const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
        if (nextLetter <= "Z") {
            setModalSets([...modalSets, { letter: nextLetter, capacity: 20 }]);
        }
    };

    const removeSet = (index) => {
        const updated = modalSets.filter((_, i) => i !== index);
        const remapped = updated.map((s, i) => ({
            ...s,
            letter: String.fromCharCode(65 + i)
        }));
        setModalSets(remapped);
        setOpenMenuIdx(null);
    };

    const handleSave = async () => {
        try {
            const payload = {
                departmentId: activeDept._id,
                departmentName: activeDept.name,
                yearLevel,
                sets: modalSets
            };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/sets/bulk`, payload);
            Swal.fire("Success", "Sets created successfully", "success");
            setShowModal(false);
            fetchData();
        } catch (err) {
            Swal.fire("Error", "Could not save sets", "error");
        }
    };

    const filtered = departments.filter(d =>
        d.name?.toLowerCase().includes(search.toLowerCase())
    );

    const pageCount = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    return (
        <div className="set-container" style={{ position: "relative" }} onClick={() => setOpenMenuIdx(null)}>
            {loadingData && (
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, flexDirection: "column" }}>
                    <div className="set-spinner" />
                    <p style={{ marginTop: 15, fontWeight: "bold", color: "#006666" }}>Loading...</p>
                </div>
            )}

            <div className="set-header">
                <h1>Set List</h1>
                <p>Manage and configure student sections per department.</p>
            </div>

            <div className="set-controls">
                <input
                    className="set-search"
                    placeholder="Search departments..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                />
            </div>

            <div className="set-table-container">
                <table className="set-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Department Name</th>
                            <th style={{ textAlign: "right", paddingRight: "25px" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current.length > 0 ? current.map((dept, i) => (
                            <React.Fragment key={dept._id}>
                                <tr onClick={() => toggleRow(dept._id)} style={{ cursor: "pointer" }}>
                                    <td>{start + i + 1}</td>
                                    <td>{dept.name}</td>
                                    <td style={{ textAlign: "right", paddingRight: "20px" }}>
                                        {expandedId === dept._id ? <ChevronDown size={18} /> : <ChevronLeft size={18} />}
                                    </td>
                                </tr>

                                {expandedId === dept._id && (
                                    <tr>
                                        <td colSpan="3" style={{ background: "#fdfdfd", padding: "15px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: "100%" }}>
                                                <div style={{ textAlign: "right", borderRight: "4px solid #006666", paddingRight: "15px", minWidth: "250px" }}>
                                                    {sets.filter(s => s.department === dept.name).length > 0 ? (
                                                        sets.filter(s => s.department === dept.name)
                                                            .sort((a, b) => a.name.localeCompare(b.name))
                                                            .map(s => (
                                                            <div key={s._id} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
                                                                <span style={{ fontWeight: "600", color: "#333" }}>{s.name}</span>
                                                                <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "10px" }}>({s.year})</span>
                                                            </div>
                                                        ))
                                                    ) : <p style={{ fontSize: '0.8rem', color: '#999' }}>No sets added yet.</p>}

                                                    <button
                                                        className="set-add-btn"
                                                        style={{ marginTop: "15px", fontSize: "0.8rem", padding: "8px 14px" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDept(dept);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <Plus size={14} style={{ marginRight: "5px" }} />
                                                        Configure Sets
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>No Departments Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '12px', width: '450px', maxWidth: '90%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                            <div>
                                <h2 style={{ color: '#0a3d18', fontSize: '1.2rem', margin: 0 }}>Configure Sections</h2>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>{activeDept?.name}</p>
                            </div>
                            <X style={{ cursor: 'pointer', color: '#666' }} onClick={() => setShowModal(false)} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '8px' }}>Target Year Level</label>
                            <select
                                value={yearLevel}
                                onChange={(e) => setYearLevel(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '0.9rem' }}
                            >
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                            </select>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #ddd' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>Section</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', marginRight: '40px' }}>Max Students</span>
                            </div>

                            {modalSets.map((s, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', position: 'relative' }}>
                                    <span style={{ fontWeight: 'bold', color: '#333', fontSize: '0.95rem' }}>Set {s.letter}</span>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <select
                                            value={s.capacity}
                                            onChange={(e) => {
                                                const updated = [...modalSets];
                                                updated[idx].capacity = parseInt(e.target.value);
                                                setModalSets(updated);
                                            }}
                                            style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '0.85rem' }}
                                        >
                                            {[20, 30, 35, 40, 45, 50, 60].map(cap => (
                                                <option key={cap} value={cap}>{cap} Limit</option>
                                            ))}
                                        </select>

                                        <div style={{ position: 'relative' }}>
                                            <MoreVertical 
                                                size={18} 
                                                style={{ cursor: 'pointer', color: '#888' }} 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuIdx(openMenuIdx === idx ? null : idx);
                                                }}
                                            />
                                            {openMenuIdx === idx && (
                                                <div style={{ position: 'absolute', right: 0, top: '25px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 10 }}>
                                                    <button 
                                                        onClick={() => removeSet(idx)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
                                                    >
                                                        <Trash2 size={14} /> Remove Set
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '15px' }}>
                            <button
                                onClick={handleAddMoreSet}
                                style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: '#0a3d18', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', padding: '5px 0' }}
                            >
                                <Plus size={16} style={{ marginRight: "4px" }} /> 
                                Add Set {String.fromCharCode((modalSets[modalSets.length - 1]?.letter.charCodeAt(0) || 64) + 1)}
                            </button>
                        </div>

                        <button
                            className="set-add-btn"
                            style={{ width: '100%', marginTop: '25px', padding: '12px', fontSize: '0.9rem', justifyContent: 'center' }}
                            onClick={handleSave}
                        >
                            SAVE CONFIGURATION
                        </button>
                    </div>
                </div>
            )}

            {pageCount > 1 && (
                <div className="set-pagination-controls">
                    {Array.from({ length: pageCount }, (_, idx) => (
                        <button
                            key={idx}
                            className={`set-pagination-btn ${currentPage === idx + 1 ? "active" : ""}`}
                            onClick={() => setCurrentPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}