import React, { useState, useEffect } from "react";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";

export default function Welcome() {
    const { user, setUser } = useAdmin()
    const [courses, setCourses] = useState([]);

    const [openChat, setOpenChat] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [hasUnreadAdminMessages, setHasUnreadAdminMessages] = useState(false);

    const checkAdminMessages = async () => {
        if (!user?._id) return;
        try {
            const res = await axios.get(`http://localhost:2025/api/chats/${user._id}`);
            const unreadAdmin = res.data.messages.filter(msg => msg.sender === "admin" && !msg.readByStudent);
            if (unreadAdmin.length > 0) setHasUnreadAdminMessages(true);
        } catch (err) {
            console.error("Failed to load chat", err);
        }
    };


    const openStudentChat = async () => {
        setOpenChat(true);

        try {
            const res = await axios.get(`http://localhost:2025/api/chats/${user._id}`);
            const adminOnly = res.data.messages.filter(msg => msg.sender === "admin");
            setMessages(adminOnly);

            await axios.post(`http://localhost:2025/api/chats/${user._id}/read`);

            const updated = await axios.get(`http://localhost:2025/api/chats/${user._id}`);
            const updatedAdmin = updated.data.messages.filter(msg => msg.sender === "admin" && !msg.readByStudent);
            setHasUnreadAdminMessages(updatedAdmin.length > 0 ? true : false);

        } catch (err) {
            console.error("Failed to load chat", err);
        }
    };

    useEffect(() => {
        axios.get("http://localhost:2025/api/courses")
            .then(res => setCourses(res.data))
            .catch(err => console.error("Course fetch error:", err));

        checkAdminMessages();
    }, []);

    return (
        <div>
            <div className="premaintab">
                <div className="prenavtab" draggable="false" style={{ pointerEvents: "none", userSelect: "none" }}  >
                    <h2>Kolehiyo Ng Subic Student Admission Portal</h2>
                    <p>Welcome, {user?.firstname || ""} {user?.middlename || ""} {user?.lastname || ""} {user?.extension || ""}</p>
                </div>
                <img src="public/img/knshdlogo.png" alt="Illustration" draggable="false" style={{ pointerEvents: "none", userSelect: "none" }} />
            </div>
            <div className="premainad">
                <div className="addatails">
                    <h2>Welcome to Kolehiyo Ng Subic Admission Portal</h2>
                    <hr />
                    <p>Thank you for choosing Kolehiyo Ng Subic as your educational destination. We're excited to guide you through the admission process!</p>
                    <p>Here, you can submit your application, track your progress, and receive important updates regarding your interview and admission status</p>
                    <p style={{ fontWeight: "bold" }}>To get Started :</p>
                    <p style={{ marginLeft: "20px" }}> • Complete your application form with accurate details.</p>
                    <p style={{ marginLeft: "20px" }}> • Make sure to upload the required documents. Please take note that <strong>uploading of false documents and/or blank or incorrect documents is strictly prohibited</strong>  and will be subject to the <strong>immediate deletion of your account</strong> </p>
                    <p style={{ marginLeft: "20px" }}> • Keep track of important deadlines and communications through the <strong>Dashboard section</strong>  of this portal.</p>
                    <p style={{ marginLeft: "20px" }}> • You have 10 working days upon registration to accomplish all of the required documents otherwise your account will be moved to the archived list. </p>
                    <p>Need help or have questions about your application?
                        Our dedicated Admission Team is here to support you every step of the way! Whether you're unsure about the requirements, deadlines, or the application process itself, don’t hesitate to get in touch with us at &nbsp;
                        <strong style={{ fontSize: "14px", color: "darkgreen" }}>@kolehiyongsubic01@gmail.com</strong>
                    </p>
                    <p>
                        We understand that starting your college journey can feel overwhelming—but you’re not alone. We’re here to guide you, answer your concerns, and make the process as smooth as possible.
                    </p>
                    <p>
                        We look forward to welcoming you to the Kolehiyo ng Subic family and can't wait to see all the great things you’ll achieve. Wishing you the very best of luck with your application!
                    </p>
                    <p><strong>Sincerely,</strong> </p> <br />
                    <p style={{ marginLeft: "20px", marginTop: "-20px" }}> Kolehiyo ng Subic Admissions Team</p>
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
                            {courses.map((course, index) => (
                                <tr key={index} style={{ background: "white" }}>
                                    <td>
                                        {course.title}{" "}
                                        {course.department && (
                                            <></>
                                        )}
                                    </td>

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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button
                className="chat-fab"
                onClick={openStudentChat}
            >
                💬
                {hasUnreadAdminMessages && !openChat && (
                    <span
                        style={{
                            position: "absolute",
                            top: "-2px",
                            right: "-2px",
                            width: "10px",
                            height: "10px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            border: "1px solid white",
                        }}
                    ></span>
                )}
            </button>

            {openChat && (
                <div className="chat-modal">
                    <div className="chat-header">
                        <img className="chat-logo" src="/public/img/knshdlogo.png" alt="" />
                        <span>Admissions Chat</span>
                        <button onClick={() => setOpenChat(false)}>✕</button>
                    </div>

                    <div className="chat-body">
                        {messages.length === 0 && (
                            <p style={{ textAlign: "center", opacity: 0.6 }}>No messages yet</p>
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
    )
}
