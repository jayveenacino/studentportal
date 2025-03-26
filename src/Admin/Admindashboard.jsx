import React, { useState } from 'react';
import './admin css/admin.css';
import { Menu, X, Home, Settings, User, BarChart, Table, MessageSquare, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <header className="navbar">
                <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <Menu className="icon" />
                </button>
                <input type="text" className="search" placeholder="Search" />
                <div className="user-info">
                    <span className="notifications">🔔 4</span>
                    <span className="messages">💬 3</span>
                    <span className="profile">K. Anderson ▼</span>
                </div>
            </header>

            <div className="dashboard-body">
                {/* Sidebar */}
                <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h2 className="logo">NiceAdmin</h2>
                        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                            <X className="icon" />
                        </button>
                    </div>
                    <nav className="sidebar-nav">
                        <a href="#" className="active"><Home className="icon" /> Dashboard</a>
                        <a href="#"><BarChart className="icon" /> Components</a>
                        <a href="#"><Table className="icon" /> Tables</a>
                        <a href="#"><Settings className="icon" /> Charts</a>
                        <a href="#"><User className="icon" /> Profile</a>
                        <a href="#"><MessageSquare className="icon" /> F.A.Q</a>
                        <a href="#"><UserCheck className="icon" /> Register</a>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="main-content">
                    <h1>Dashboard Content Goes Here</h1>
                </div>
            </div>
        </div>
    );
}
