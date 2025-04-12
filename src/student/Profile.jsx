import React, { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";
import Data from "./Data";
import Personal from "./Personal";
import Education from "./Education";
import Updocx from "./Updocx";


export default function Profile() {

    const { user, setUser } = useAdmin()
    const [profilepfp, setProfilepfp] = useState(false);
    const [fillsection, setFillsection] = useState("data");

    //IMAGE  CONST
    const [image, setImage] = useState(null);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            Swal.fire({
                title: 'Error!',
                text: 'No file selected!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!image) {
            Swal.fire({
                title: 'Error!',
                text: 'Image is missing! Please select an image.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (!user.email) {
            Swal.fire({
                title: 'Error!',
                text: 'Email is missing! Please log in.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:2025/upload", {
                email: user.email,
                image
            });

            setUser(prev => ({ ...prev, image: response.data.student.image }));
            setProfilepfp(false);

            Swal.fire({
                title: 'Success!',
                text: 'Image uploaded successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error("Upload error:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || "Failed to upload image.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const email = localStorage.getItem("userEmail");
            if (!email) return;

            try {
                const res = await axios.get("http://localhost:2025/getuser", {
                    params: { email }
                });

                if (res.data && res.data.student) {
                    setUser(res.data.student);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            <div className="premaintab">
                <div className="prenavtab">
                    <h2>Profile</h2>
                    <p>View / Edit personal information</p>
                </div>
                <img src="public/img/knshdlogo.png" alt="Illustration" />
            </div>
            <div className="preprofile">
                <div className="preprofiledetails">
                    <div className="profile-image">
                        <img onClick={() => setProfilepfp(true)} src={user.image || "/img/prof.jpg"} alt="Profile" />
                        <p className="change-text" style={{ fontSize: "10px" }}>Click/tap to change image</p>
                    </div>
                    {profilepfp && (
                        <div className="preforgot">
                            <div className="forgotbg">
                                <h2 style={{ color: "#303030" }}>Upload your 2x2 Picture</h2>
                                <p style={{ color: "red", fontSize: "12px" }}>
                                    Upload your 2x2 picture with WHITE background. For seamless uploading, it is recommended that the file size should be 2MB (20800KB) or less. Valid formats are .png, .jpg/jpeg.
                                </p>
                                <hr />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                    {image && (
                                        <div style={{
                                            width: '150px',
                                            height: '150px',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>

                                <div className="button-container" style={{ marginTop: '20px' }}>
                                    <button style={{ border: "none" }} onClick={() => setProfilepfp(false)}>Cancel</button>
                                    <button
                                        onClick={handleUpload}
                                        style={{
                                            border: "1px solid #006666",
                                            background: "#006666",
                                            color: "white",
                                            padding: '10px 20px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="status-table" style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: "13px", width: '20%' }}><strong>Registration Number</strong></td>
                                <td style={{ fontSize: "13px" }}>{user?._id || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}><strong>Fullname</strong></td>
                                <td style={{ fontSize: "13px", textTransform: "uppercase" }}> {user?.lastname || ""}, {user?.firstname || ""}, {user?.middlename || ""} {user?.extension || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}><strong>College/Program</strong></td>
                                <td style={{ fontSize: "13px" }}>/</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}><strong>Email Address</strong></td>
                                <td style={{ fontSize: "13px" }}>{user?.email || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}><strong>Contact Number</strong></td>
                                <td style={{ fontSize: "13px" }}>+63 {user?.phone || ""}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="fulldetails">

                {/* Data Privacy Section */}
                <div className={`datafill ${fillsection === "data" ? "active" : ""}`} onClick={() => setFillsection("data")}>
                    <div className={`fillhead ${fillsection === "data" ? "active" : ""}`}>
                        <span className="step-icon">{fillsection === "data" ? <i className="fa-solid fa-lock"></i> : "1"}</span>
                        <h2 style={{ fontSize: "12px" }}>DATA PRIVACY STATEMENT</h2>
                    </div>

                    {fillsection === "data" && (
                        <>
                            <Data />
                            <div className="unibtn" style={{ marginTop: "9px", marginBottom: "20px", marginRight: "20px" }}>
                                <button onClick={(e) => { e.stopPropagation(); setFillsection("personal"); }}>
                                    <i className="fa-solid fa-forward-step"></i> Accept and Continue
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Personal Information Section */}
                <div className={`datafill ${fillsection === "personal" ? "active" : ""}`} onClick={() => setFillsection("personal")}>
                    <div className={`fillhead ${fillsection === "personal" ? "active" : ""}`}>
                        <span className="step-icon">{fillsection === "personal" ? <i className="fa-solid fa-pen"></i> : "2"}</span>
                        <h2 style={{ fontSize: "12px" }}>PERSONAL INFORMATION</h2>
                    </div>

                    {fillsection === "personal" && (
                        <>
                            <Personal />

                        </>
                    )}
                </div>

                <div className={`datafill ${fillsection === "education" ? "active" : ""}`} onClick={() => setFillsection("education")}>
                    <div className={`fillhead ${fillsection === "education" ? "active" : ""}`}>
                        <span className="step-icon">{fillsection === "education" ? <i className="fa-solid fa-pen"></i> : "3"}</span>
                        <h2 style={{ fontSize: "12px" }}>EDUCATION</h2>
                    </div>

                    {fillsection === "education" && (
                        <>
                            <Education />
                        </>
                    )}
                </div>

                <div className={`datafill ${fillsection === "family" ? "active" : ""}`} onClick={() => setFillsection("family")}>
                    <div className={`fillhead ${fillsection === "family" ? "active" : ""}`}>
                        <span className="step-icon">{fillsection === "family" ? <i className="fa-solid fa-pen"></i> : "4"}</span>
                        <h2 style={{ fontSize: "12px" }}>FAMILY</h2>
                    </div>

                    {fillsection === "family" && (
                        <>

                        </>
                    )}
                </div>

                <div className={`datafill ${fillsection === "upload" ? "active" : ""}`} onClick={() => setFillsection("upload")}>
                    <div className={`fillhead ${fillsection === "upload" ? "active" : ""}`}>
                        <span className="step-icon">{fillsection === "upload" ? <i className="fa-solid fa-pen"></i> : "6"}</span>
                        <h2 style={{ fontSize: "12px" }}>UPLOAD DOCUMENTS</h2>
                    </div>
                    {fillsection === "upload" && (
                        <>
                            <Updocx />
                        </>
                    )}
                </div>

                <div className={`datafill ${fillsection === "confirmation" ? "active" : ""}`} onClick={() => setFillsection("confirmation")}>
                    <div className={`fillhead ${fillsection === "confirmation" ? "active" : ""}`}>
                        <span className="step-icon">{fillsection === "confirmation" ? <i className="fa-solid fa-pen"></i> : "7"}</span>
                        <h2 style={{ fontSize: "12px" }}>CONFIRMATION</h2>
                    </div>

                    {fillsection === "confirmation" && (
                        <div className="preprofile">
                            <div className="uploads">
                                <h4 >You are almost done!</h4 >
                                <p style={{ marginBottom: "20px", fontSize: "15px", fontStyle: "italic", marginTop: "10px" }}>Thank you for filling out the form! The next step is to upload the remaining
                                    images or scanned copies of the required documents. Just click the button below to complete your enlistment.
                                    Please note that your exam schedule will be provided by the admission office once your enlistment is finalized.
                                </p>
                                <div className="unibtn">
                                    <button>
                                        <i className="fa-solid fa-forward-step"></i> Finalized Enlistment
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
