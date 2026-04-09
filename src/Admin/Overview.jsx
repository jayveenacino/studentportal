import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./Admincss/overview.css";

export default function Dashboard() {
    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);

    const [displayDate, setDisplayDate] = useState(new Date());

    const today = new Date();

    const currentYear = displayDate.getFullYear();
    const currentMonth = displayDate.getMonth();
    const monthName = displayDate.toLocaleString('default', { month: 'long' });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarGrid = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarGrid.push("");
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarGrid.push(i.toString());
    }

    const prevMonth = () => {
        const newDate = new Date(currentYear, currentMonth - 1, 1);
        if (newDate.getFullYear() >= 2021) {
            setDisplayDate(newDate);
        }
    };

    const nextMonth = () => {
        const newDate = new Date(currentYear, currentMonth + 1, 1);
        if (newDate <= new Date(today.getFullYear(), 11, 31)) {
            setDisplayDate(newDate);
        }
    };

    const isToday = (date) => {
        const dateNum = Number(date);
        return dateNum === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
    };

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
            },
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

    const events = [
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet"
    ];

    return (
        <div className="overview-container">
            <div className="main-content">
                <div className="overview-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back, Admin! Here's what's happening today.</p>
                    </div>
                </div>

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

                <div className="updates-container-inner">
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

            <div className="right-sidebar">
                <div className="calendar-card">
                    <div className="calendar-header">
                        <h3>{monthName} {currentYear}</h3>
                        <div className="calendar-nav">
                            <button onClick={prevMonth}>‹</button>
                            <button onClick={nextMonth}>›</button>
                        </div>
                    </div>
                    <div className="calendar-days">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                    </div>
                    <div className="calendar-dates">
                        {calendarGrid.map((date, index) => (
                            <span
                                key={index}
                                className={`${date === "" ? "empty" : ""} ${isToday(date) ? "today-dot" : ""}`}
                            >
                                {date}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="events-card">
                    <h3>Notification</h3>
                    <ul className="events-list">
                        {events.map((event, index) => (
                            <li key={index}>
                                <div className="event-line"></div>
                                <div className="event-content">
                                    <p>{event}</p>
                                    <p className="event-time">Lorem ipsum dolor sit amet</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}