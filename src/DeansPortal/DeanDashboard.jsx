import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Deancss/deanmain.css";
import DeanInstructor from './DeanInstructor';
import DeanSchedule from './DeanSchedules';

export default function DeanDashboard() {
    const navigate = useNavigate();
    const [deanData, setDeanData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('dashboard');

    useEffect(() => {
        const storedDean = sessionStorage.getItem("Dean");
        if (!storedDean) {
            navigate("/deans-portal", { replace: true });
            return;
        }
        setDeanData(JSON.parse(storedDean));
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("Dean");
        navigate("/", { replace: true });
    };

    const handleNavClick = (nav) => {
        setActiveNav(nav);
    };

    // Render content based on active navigation
    const renderContent = () => {
        switch (activeNav) {
            case 'instructors':
                return <DeanInstructor />;
                case 'schedules':
                    return <DeanSchedule />;
            case 'dashboard':
            default:
                return <DashboardContent deanData={deanData} />;
        }
    };

    if (!deanData) return null;

    return (
        <div className="dean-container-unique">
            <nav className={`dean-sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* ... sidebar content stays the same ... */}
                <div className="dean-brand">
                    <img src="/img/knshdlogo.png" alt="Logo" className="dean-logo" />
                    <div className="dean-brand-text">
                        <span className="dean-school-name">Kolehiyo Ng Subic</span>
                        <span className="dean-dept-name">{deanData.name}</span>
                    </div>
                </div>

                <ul className="dean-nav-list">
                    <li
                        className={`dean-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleNavClick('dashboard')}
                    >
                        <i className="fa-solid fa-gauge-high"></i> Dashboard
                    </li>
                    <li
                        className={`dean-nav-item ${activeNav === 'schedules' ? 'active' : ''}`}
                        onClick={() => handleNavClick('schedules')}
                    >
                        <i className="fa-solid fa-calendar-check"></i> Schedules
                    </li>
                    <li
                        className={`dean-nav-item ${activeNav === 'instructors' ? 'active' : ''}`}
                        onClick={() => handleNavClick('instructors')}
                    >
                        <i className="fa-solid fa-chalkboard-user"></i> Instructors
                    </li>
                    {/* ... other nav items ... */}
                    <li
                        className={`dean-nav-item ${activeNav === 'students' ? 'active' : ''}`}
                        onClick={() => handleNavClick('students')}
                    >
                        <i className="fa-solid fa-user-graduate"></i> Students
                    </li>
                    <li
                        className={`dean-nav-item ${activeNav === 'evaluation' ? 'active' : ''}`}
                        onClick={() => handleNavClick('evaluation')}
                    >
                        <i className="fa-solid fa-user-check"></i> Evaluation
                    </li>
                    <li
                        className={`dean-nav-item ${activeNav === 'subjects' ? 'active' : ''}`}
                        onClick={() => handleNavClick('subjects')}
                    >
                        <i className="fa-solid fa-book-open"></i> Subjects
                    </li>

                    <li
                        className={`dean-nav-item ${activeNav === 'reports' ? 'active' : ''}`}
                        onClick={() => handleNavClick('reports')}
                    >
                        <i className="fa-solid fa-chart-pie"></i> Reports
                    </li>
                    <li
                        className={`dean-nav-item ${activeNav === 'settings' ? 'active' : ''}`}
                        onClick={() => handleNavClick('settings')}
                    >
                        <i className="fa-solid fa-gear"></i> Settings
                    </li>
                </ul>

                <div className="dean-sidebar-footer">
                    <div className="dean-logout-btn" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Logout</span>
                    </div>
                </div>
            </nav>

            <main className="dean-main-content">
                {/* ... header stays the same ... */}
                <header className="dean-top-header">
                    <i
                        className="fa-solid fa-bars dean-menu-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    ></i>

                    <div className="dean-header-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Search anything..." />
                    </div>

                    <div className="dean-header-actions">
                        <div className="dean-notification">
                            <i className="fa-solid fa-bell"></i>
                            <span className="dean-badge">3</span>
                        </div>

                        <div className="dean-user-profile">
                            <div className="dean-avatar">
                                {deanData.head?.charAt(0) || 'D'}
                            </div>
                            <div className="dean-user-info">
                                <span className="dean-user-name">{deanData.head}</span>
                                <span className="dean-user-role">Department Dean</span>
                            </div>
                            <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', color: '#a0aec0' }}></i>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Area - This switches between Dashboard and Instructors */}
                <section className="dean-page-body">
                    {renderContent()}
                </section>
            </main>
        </div>
    )
}

// Dashboard content extracted as separate component
function DashboardContent({ deanData }) {
    return (
        <>
            <div className="dean-welcome-section">
                <div className="dean-welcome-card">
                    <h1>Welcome back, {deanData?.head || 'Dean'}!</h1>
                    <p>Here's what's happening in {deanData?.name} today. You have 3 new notifications and 2 pending approvals requiring your attention.</p>
                </div>
            </div>

            <div className="dean-stats-grid">
                <div className="dean-stat-card">
                    <div className="dean-stat-icon blue">
                        <i className="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <div className="dean-stat-content">
                        <h3>24</h3>
                        <p>Total Instructors</p>
                    </div>
                </div>
                <div className="dean-stat-card">
                    <div className="dean-stat-icon green">
                        <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <div className="dean-stat-content">
                        <h3>1,247</h3>
                        <p>Enrolled Students</p>
                    </div>
                </div>
                <div className="dean-stat-card">
                    <div className="dean-stat-icon orange">
                        <i className="fa-solid fa-book"></i>
                    </div>
                    <div className="dean-stat-content">
                        <h3>56</h3>
                        <p>Active Subjects</p>
                    </div>
                </div>
                <div className="dean-stat-card">
                    <div className="dean-stat-icon purple">
                        <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="dean-stat-content">
                        <h3>12</h3>
                        <p>Pending Loadings</p>
                    </div>
                </div>
            </div>

            <div className="dean-content-grid">
                <div className="dean-card">
                    <div className="dean-card-header">
                        <h3 className="dean-card-title">
                            <i className="fa-solid fa-bolt"></i>
                            Recent Activity
                        </h3>
                    </div>
                    <div className="dean-card-body">
                        <ul className="dean-activity-list">
                            <li className="dean-activity-item">
                                <span className="dean-activity-dot success"></span>
                                <div className="dean-activity-content">
                                    <p>New instructor <strong>Prof. Maria Santos</strong> has been added to the department</p>
                                    <span className="dean-activity-time">2 hours ago</span>
                                </div>
                            </li>
                            <li className="dean-activity-item">
                                <span className="dean-activity-dot warning"></span>
                                <div className="dean-activity-content">
                                    <p>Subject loading request from <strong>Prof. John Doe</strong> requires your approval</p>
                                    <span className="dean-activity-time">4 hours ago</span>
                                </div>
                            </li>
                            <li className="dean-activity-item">
                                <span className="dean-activity-dot info"></span>
                                <div className="dean-activity-content">
                                    <p>Semester schedule has been published for review</p>
                                    <span className="dean-activity-time">Yesterday</span>
                                </div>
                            </li>
                            <li className="dean-activity-item">
                                <span className="dean-activity-dot success"></span>
                                <div className="dean-activity-content">
                                    <p>Student enrollment period has opened for 2nd Semester</p>
                                    <span className="dean-activity-time">2 days ago</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="dean-card">
                    <div className="dean-card-header">
                        <h3 className="dean-card-title">
                            <i className="fa-solid fa-rocket"></i>
                            Quick Actions
                        </h3>
                    </div>
                    <div className="dean-card-body">
                        <div className="dean-quick-actions">
                            <div className="dean-action-btn">
                                <i className="fa-solid fa-user-plus"></i>
                                <span>Add Instructor</span>
                            </div>
                            <div className="dean-action-btn">
                                <i className="fa-solid fa-file-import"></i>
                                <span>Import Data</span>
                            </div>
                            <div className="dean-action-btn">
                                <i className="fa-solid fa-file-export"></i>
                                <span>Export Report</span>
                            </div>
                            <div className="dean-action-btn">
                                <i className="fa-solid fa-envelope"></i>
                                <span>Send Notice</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}