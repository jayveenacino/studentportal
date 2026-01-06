import React, { useState, useEffect, use } from "react";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";


export default function Welcome() {
    const { user, setUser } = useAdmin()
    const [courses, setCourses] = useState([]);

    const [openChat, setOpenChat] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        { from: "admin", text: "Hi 👋 How can we help you?" }
    ]);


    useEffect(() => {
        axios.get("http://localhost:2025/api/courses")
            .then(res => setCourses(res.data))
            .catch(err => console.error("Course fetch error:", err));
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
                                            <>

                                            </>
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
                onClick={() => setOpenChat(true)}
            >
                💬
            </button>
            {openChat && (
                <div className="chat-modal">
                    <div className="chat-header">
                        <img className="chat-logo" src="/public/img/knshdlogo.png" alt="" />
                        <span>Admissions Chat</span>
                        <button onClick={() => setOpenChat(false)}>✕</button>
                    </div>

                    <div className="chat-body">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`chat-message ${msg.from === "user" ? "user" : "admin"}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="chat-footer">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && message.trim()) {
                                    setMessages([...messages, { from: "user", text: message }]);
                                    setMessage("");
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                if (!message.trim()) return;
                                setMessages([...messages, { from: "user", text: message }]);
                                setMessage("");
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}
