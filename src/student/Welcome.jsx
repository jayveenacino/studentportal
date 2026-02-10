import React, { useState, useEffect } from "react";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";

export default function Welcome() {
    const { user, setUser } = useAdmin();
    const [courses, setCourses] = useState([]);
    
    // NEW: Loading state for courses
    const [loadingCourses, setLoadingCourses] = useState(true);

    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [hasUnreadAdminMessages, setHasUnreadAdminMessages] = useState(false);

    const checkAdminMessages = async () => {
        if (!user?._id) return;
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${user._id}`);
            const unreadAdmin = res.data.messages.filter(msg => msg.sender === "admin" && !msg.readByStudent);
            if (unreadAdmin.length > 0) setHasUnreadAdminMessages(true);
        } catch (err) {
            console.error("Failed to load chat", err);
        }
    };

    const openStudentChat = async () => {
        setOpenChat(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${user._id}`);
            const adminOnly = res.data.messages.filter(msg => msg.sender === "admin");
            setMessages(adminOnly);

            await axios.post(`${import.meta.env.VITE_API_URL}/api/chats/${user._id}/read`);

            const updated = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${user._id}`);
            const updatedAdmin = updated.data.messages.filter(msg => msg.sender === "admin" && !msg.readByStudent);
            setHasUnreadAdminMessages(updatedAdmin.length > 0);
        } catch (err) {
            console.error("Failed to load chat", err);
        }
    };

    useEffect(() => {
        // FETCH COURSES
        axios.get(import.meta.env.VITE_API_URL + "/api/courses")
            .then(res => {
                setCourses(res.data);
                setLoadingCourses(false); // Stop loading when data is received
            })
            .catch(err => {
                console.error("Course fetch error:", err);
                setLoadingCourses(false); // Stop loading even on error
            });

        checkAdminMessages();
    }, []);

    return (
        <div>
            <div className="premaintab">
                <div className="prenavtab" style={{ pointerEvents: "none", userSelect: "none" }}>
                    <h2>Kolehiyo Ng Subic Student Admission Portal</h2>
                    <p>Welcome, {user?.firstname || ""} {user?.middlename || ""} {user?.lastname || ""} {user?.extension || ""}</p>
                </div>
                <img src="/img/knshdlogo.png" alt="Illustration" style={{ pointerEvents: "none", userSelect: "none" }} />
            </div>

            <div className="premainad">
                <div className="addatails">
                    <h2>Welcome to Kolehiyo Ng Subic Admission Portal</h2>
                    <hr />
                    <p>Thank you for choosing Kolehiyo Ng Subic as your educational destination. We're excited to guide you through the admission process!</p>
                    <p>Here, you can submit your application, track your progress, and receive important updates regarding your interview and admission status</p>
                    <p style={{ fontWeight: "bold" }}>To get Started :</p>
                    <p style={{ marginLeft: "20px" }}> • Complete your application form with accurate details.</p>
                    <p style={{ marginLeft: "20px" }}> • Make sure to upload the required documents. Please take note that <strong>uploading of false documents is strictly prohibited</strong> and will result in <strong>account deletion</strong>.</p>
                    <p style={{ marginLeft: "20px" }}> • Keep track of deadlines in the <strong>Dashboard section</strong>.</p>
                    <p style={{ marginLeft: "20px" }}> • You have 10 working days to accomplish all requirements.</p>
                    <p>Need help? Contact us at <strong style={{ fontSize: "14px", color: "darkgreen" }}>kolehiyongsubic.ph@gmail.com</strong></p>
                    <p><strong>Sincerely,</strong></p> 
                    <p style={{ marginLeft: "20px" }}> Kolehiyo ng Subic Admissions Team</p>
                </div>

                <div className="admissionsum">
                    <h2>Admission Applicant Summary</h2>
                    <hr />
                    <table className="status-table" style={{ width: '100%' }}>
                        <thead style={{ background: "white" }}>
                            <tr>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}>Courses</td>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}>Status</td>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingCourses ? (
                                // SHOW THIS WHILE LOADING
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", padding: "20px", color: "gray", fontStyle: "italic" }}>
                                        <i className="fa-solid fa-spinner fa-spin"></i> Loading courses...
                                    </td>
                                </tr>
                            ) : (
                                // SHOW THIS ONCE DATA IS LOADED
                                courses.map((course, index) => (
                                    <tr key={index} style={{ background: "white" }}>
                                        <td>{course.title}</td>
                                        <td
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: course.status === 'Active' ? 'green' : 'red'
                                            }}
                                        >
                                            {course.status === 'Active' ? 'Open' : 'Closed'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Chat button and Modal remain the same */}
            <button className="chat-fab" onClick={openStudentChat}>
                💬
                {hasUnreadAdminMessages && !openChat && (
                    <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "10px", height: "10px", backgroundColor: "red", borderRadius: "50%", border: "1px solid white" }}></span>
                )}
            </button>

            {openChat && (
                <div className="chat-modal">
                    <div className="chat-header">
                        <img className="chat-logo" src="/img/knshdlogo.png" alt="" />
                        <span>Admissions Chat</span>
                        <button onClick={() => setOpenChat(false)}>✕</button>
                    </div>
                    <div className="chat-body">
                        {messages.length === 0 && (
                            <p style={{ textAlign: "center", opacity: 0.6, fontSize: "13px", marginTop: "150px" }}>No messages yet</p>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-message admin">
                                {msg.text.split("\n").map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}