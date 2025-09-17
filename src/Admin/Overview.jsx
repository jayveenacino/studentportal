import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from "recharts";
import "./Admincss/overview.css";

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        students: 0,
        enrollees: 0,
        departments: 0,
        instructors: 0,
    });

    const [departmentData, setDepartmentData] = useState([]);

    // fixed color mapping
    const COLORS = {
        "Business Education": "#FFD700",   // Yellow
        "Hospitality Mgmt": "#FF0000",     // Red
        "Computer Studies": "#800080",     // Purple
        "Teacher Education": "#0000FF",    // Blue
    };

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:2025/api/overview");
            setStats(res.data.stats);
            setDepartmentData(res.data.departments);
        } catch {
            // fallback demo data
            setStats({
                students: 1200,
                enrollees: 340,
                departments: 4,
                instructors: 45,
            });
            setDepartmentData([
                { name: "Business Education", students: 320 },
                { name: "Hospitality Mgmt", students: 180 },
                { name: "Computer Studies", students: 450 },
                { name: "Teacher Education", students: 260 },
            ]);
        }
    };

    useEffect(() => {
        fetchData(); // only load once
    }, []);

    return (
        <div className="overview-container">
            <div className="overview-header">
                <h1>Dashboard Overview</h1>
                <p>Quick insights into your school’s activities.</p>
            </div>

            {/* Stats Cards */}
            <div className="overview-stats">
                <div className="overview-card">
                    <h2>{stats.students}</h2>
                    <p>Total Students</p>
                </div>
                <div className="overview-card">
                    <h2>{stats.enrollees}</h2>
                    <p>Current Enrollees</p>
                </div>
                <div className="overview-card">
                    <h2>{stats.departments}</h2>
                    <p>Departments</p>
                </div>
                <div className="overview-card">
                    <h2>{stats.instructors}</h2>
                    <p>Instructors</p>
                </div>
            </div>

            {/* Students per Department Chart */}
            <div className="overview-chart-container">
                <h2>Students Enrolled per Department</h2>
                <ResponsiveContainer width="50%" height={200}>
                    <BarChart
                        data={departmentData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                        barSize={28}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar dataKey="students" name="Enrolled Students" radius={[6, 6, 0, 0]}>
                            {departmentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#999999"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div>
    );
}
