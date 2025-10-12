import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Admincss/overview.css";

export default function Dashboard() {
    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);

    useEffect(() => {
        if (lineChartRef.current) lineChartRef.current.destroy();
        if (barChartRef.current) barChartRef.current.destroy();

        const ctx1 = document.getElementById("enrollmentGraph").getContext("2d");
        lineChartRef.current = new Chart(ctx1, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [
                    {
                        label: "Enrollments",
                        data: [45, 60, 80, 75, 100, 130, 120],
                        fill: true,
                        backgroundColor: "rgba(40,167,69,0.1)",
                        borderColor: "#28a745",
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "#28a745",
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { ticks: { stepSize: 20 } },
                },
            },
        });

        const ctx2 = document.getElementById("departmentChart").getContext("2d");
        barChartRef.current = new Chart(ctx2, {
            type: "bar",
            data: {
                labels: ["BSBA", "BSHM", "BSCS", "BSED"],
                datasets: [
                    {
                        label: "Students",
                        data: [320, 180, 450, 260],
                        backgroundColor: [
                            "#F4D03F",
                            "#EC7063",
                            "#A569BD",
                            "#3498DB"
                        ],
                    },
                ],
            }
            ,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true },
                },
            },
        });
    }, []);

    return (
        <div className="overview-container">
            <div className="overview-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, Admin! Here’s what’s happening today.</p>
                </div>
                <div className="active-semester-badge">
                    <span className="dot"></span>
                    Active Semester: <strong>1st Semester</strong>
                </div>
            </div>

            {/* Stats */}
            <div className="overview-stats">
                <div className="overview-card">
                    <h2>1,250</h2>
                    <p>Registered Students</p>
                </div>
                <div className="overview-card">
                    <h2>320</h2>
                    <p>Pending Applications</p>
                </div>
                <div className="overview-card">
                    <h2>58</h2>
                    <p>New Enrollments</p>
                </div>
                <div className="overview-card">
                    <h2>12</h2>
                    <p>Courses Offered</p>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-container">
                <div className="graph-card">
                    <div className="graph-card-header">
                        <h3>Enrollment Trends</h3>
                        <div className="graph-controls">
                            <select>
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>This Year</option>
                            </select>
                            <button>Export</button>
                        </div>
                    </div>
                    <canvas id="enrollmentGraph"></canvas>
                </div>

                <div className="graph-card">
                    <div className="graph-card-header">
                        <h3>Students by Department</h3>
                    </div>
                    <canvas id="departmentChart"></canvas>
                </div>
            </div>

            <div className="updates-container">
                <div className="updates-header">
                    <h1>Recent Updates</h1>
                    <p>Latest changes in the system</p>
                </div>

                <div className="updates-table-container">
                    <table className="updates-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Update</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>New course added to Computer Studies</td>
                                <td>Aug 05, 2025</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Registration deadline moved to Aug 15</td>
                                <td>Aug 02, 2025</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>25 new students enrolled today</td>
                                <td>Aug 01, 2025</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
