import React, { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";

export default function Iupdocx() {

    const { user, setUser } = useAdmin()
    const [profilepfp, setProfilepfp] = useState(false);
    const [fillsection, setFillsection] = useState("data");
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:2025/api/courses")
            .then(res => setCourses(res.data))
            .catch(err => console.error("Course fetch error:", err));
    }, []);

    //!DOCXS
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [birthCertModalOpen, setBirthCertModalOpen] = useState(false);
    const [goodMoralModalOpen, setGoodMoralModalOpen] = useState(false);
    const [academicModalOpen, setAcademicModalOpen] = useState(false);

    const [image, setImage] = useState(null);
    const [idimage, setIdImage] = useState(null);
    const [birthCertImage, setBirthCertImage] = useState(null);
    const [goodMoralImage, setGoodMoralImage] = useState(null);
    const [academicImage, setAcademicImage] = useState(null);

    const [uploadStatus, setUploadStatus] = useState({
        profileImage: '❌',
        validId: '❌',
        birthCert: '❌',
        goodMoral: '❌',
        academic: '❌',
    });

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:2025/get-upload-status/${user.email}`)
                .then(res => {
                    setUploadStatus({
                        profileImage: res.data.profileImage ? '✔️' : '❌',
                        validId: res.data.validId ? '✔️' : '❌',
                        birthCert: res.data.birthCert ? '✔️' : '❌',
                        goodMoral: res.data.goodMoral ? '✔️' : '❌',
                        academic: res.data.academic ? '✔️' : '❌',
                    });
                })
                .catch(err => console.error("Status fetch failed", err));
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setIdImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    //! SHS
    const idHandleUpload = async () => {
        if (!idimage || !user?.email) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Required',
                text: 'Please select a valid ID image before submitting.',
                confirmButtonColor: '#006666'
            });
            return;
        }

        try {
            const res = await axios.post("http://localhost:2025/upload-id-image", {
                email: user.email,
                idimage: idimage
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uploaded Successfully',
                    text: 'Your valid ID has been uploaded!',
                    confirmButtonColor: '#006666'
                });

                setUploadStatus(prev => ({ ...prev, validId: '✔️' }));
                setUploadModalOpen(false);
                setIdImage(null);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus(prev => ({ ...prev, validId: '❌' }));

            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Something went wrong. Please try again.',
                confirmButtonColor: '#006666'
            });
        }
    };

    //! BIRTH CERT
    const birthCertHandleUpload = async () => {
        if (!birthCertImage || !user?.email) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Required',
                text: 'Please upload your Birth Certificate before submitting.',
                confirmButtonColor: '#006666'
            });
            return;
        }

        try {
            const res = await axios.post("http://localhost:2025/upload-birthcert-image", {
                email: user.email,
                birthCertImage
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uploaded Successfully',
                    text: 'Your Birth Certificate has been uploaded!',
                    confirmButtonColor: '#006666'
                });

                setUploadStatus(prev => ({ ...prev, birthCert: '✔️' }));
                setBirthCertModalOpen(false);
                setBirthCertImage(null);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus(prev => ({ ...prev, birthCert: '❌' }));

            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Birth Certificate upload failed. Please try again.',
                confirmButtonColor: '#006666'
            });
        }
    };

    //! GOOD MORAL
    const goodMoralHandleUpload = async () => {
        if (!goodMoralImage || !user?.email) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Required',
                text: 'Please upload your Good Moral Certificate before submitting.',
                confirmButtonColor: '#006666'
            });
            return;
        }

        try {
            const res = await axios.post("http://localhost:2025/upload-goodmoral-image", {
                email: user.email,
                goodMoralImage
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uploaded Successfully',
                    text: 'Your Good Moral Certificate has been uploaded!',
                    confirmButtonColor: '#006666'
                });

                setUploadStatus(prev => ({ ...prev, goodMoral: '✔️' }));
                setGoodMoralModalOpen(false);
                setGoodMoralImage(null);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus(prev => ({ ...prev, goodMoral: '❌' }));

            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Good Moral upload failed. Please try again.',
                confirmButtonColor: '#006666'
            });
        }
    };

    //! ACADEMIC RECORDS
    const academicHandleUpload = async () => {
        if (!academicImage || !user?.email) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Required',
                text: 'Please upload your Academic Records before submitting.',
                confirmButtonColor: '#006666'
            });
            return;
        }

        try {
            const res = await axios.post("http://localhost:2025/upload-academic-image", {
                email: user.email,
                academicImage
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uploaded Successfully',
                    text: 'Your Academic Records have been uploaded!',
                    confirmButtonColor: '#006666'
                });

                setUploadStatus(prev => ({ ...prev, academic: '✔️' }));
                setAcademicModalOpen(false);
                setAcademicImage(null);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus(prev => ({ ...prev, academic: '❌' }));

            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Academic Records upload failed. Please try again.',
                confirmButtonColor: '#006666'
            });
        }
    };

    //!IMAGE
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
    return (
        <div className="mainpreprofile">
            <div className="uploads">
                <h1>PLEASE READ!</h1>
                <p style={{ marginBottom: "20px", fontSize: "15px" }}>Here are the documents you'll need for admission. Please make sure to upload everything that's required so we can get started on processing your application.</p>
                <table className="status-table" style={{ width: '100%' }}>
                    <thead style={{ background: "white" }}>
                        <tr>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>Documents</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>Status</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>Upload</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ background: "white" }}>
                            <td>2x2 Picture with white background *</td>
                            <td style={{ textAlign: 'center' }}>
                                {uploadStatus.profileImage === '✔️' ? '✔️' : '❌'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}>
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }} onClick={() => setProfilepfp(true)}  ></i>
                                </button>
                            </td>
                        </tr>
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

                        <tr style={{ background: "white" }}>
                            <td>Valid ID Card / Senior High School ID Card *</td>

                            <td style={{ textAlign: 'center' }}>
                                {uploadStatus.validId === '✔️' ? '✔️' : '❌'}
                            </td>

                            <td style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => setUploadModalOpen(true)}
                                    style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}
                                >
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}></i>
                                </button>
                            </td>
                        </tr>

                        {uploadModalOpen && (
                            <div className="preforgot">
                                <div className="forgotbg">
                                    <h2 style={{ color: "#303030" }}>Upload Valid ID</h2>
                                    <p style={{ color: "red", fontSize: "12px" }}>
                                        Upload a valid government or school ID. Max 2MB, accepted formats: .jpg, .jpeg, .png.
                                    </p>
                                    <hr />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => {
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setIdImage(reader.result);
                                                };
                                                if (file) reader.readAsDataURL(file);
                                            }}
                                        />
                                    </div>
                                    <div className="button-container" style={{ marginTop: '20px' }}>
                                        <button onClick={() => setUploadModalOpen(false)}
                                            style={{
                                                background: 'transparent',
                                                color: '#006666',
                                                border: '1px solid #ffffffff',
                                                padding: '10px 20px',
                                                cursor: 'pointer',
                                                transition: 'background 0.3s, color 0.3s',
                                            }}
                                            onMouseOver={e => {
                                                e.target.style.background = '#006666';
                                                e.target.style.color = '#fff';
                                            }}
                                            onMouseOut={e => {

                                                e.target.style.background = 'transparent';
                                                e.target.style.color = '#757575ff';
                                            }}>Close</button>
                                        <button
                                            onClick={idHandleUpload}
                                            style={{
                                                border: "1px solid #006666",
                                                background: "#006666",
                                                color: "white",
                                                padding: '10px 20px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <tr style={{ background: "white" }}>
                            <td>NSO/PSA Birth Certificate *</td>
                            <td style={{ textAlign: 'center' }}>
                                {uploadStatus.birthCert === '✔️' ? '✔️' : '❌'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => setBirthCertModalOpen(true)}
                                    style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}
                                >
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}></i>
                                </button>
                            </td>
                        </tr>

                        {birthCertModalOpen && (
                            <div className="preforgot">
                                <div className="forgotbg">
                                    <h2 style={{ color: "#303030" }}>Upload Birth Certificate</h2>
                                    <p style={{ color: "red", fontSize: "12px" }}>
                                        Upload a scanned copy of your PSA Birth Certificate. Max 2MB, formats: .jpg, .jpeg, .png.
                                    </p>
                                    <hr />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => {
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setBirthCertImage(reader.result);
                                                };
                                                if (file) reader.readAsDataURL(file);
                                            }}
                                        />
                                    </div>
                                    <div className="button-container" style={{ marginTop: '20px' }}>
                                        <button onClick={() => setBirthCertModalOpen(false)} style={{ background: 'transparent', color: '#006666', border: '1px solid #ffffffff', padding: '10px 20px', cursor: 'pointer'}}>Close</button>
                                        <button onClick={birthCertHandleUpload} style={{ border: "1px solid #006666", background: "#006666", color: "white", padding: '10px 20px', cursor: 'pointer' }}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <tr style={{ background: "white" }}>
                            <td>Certificate of Good Moral Character *</td>
                            <td style={{ textAlign: 'center' }}>
                                {uploadStatus.goodMoral === '✔️' ? '✔️' : '❌'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => setGoodMoralModalOpen(true)}
                                    style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}>
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}></i>
                                </button>
                            </td>
                        </tr>

                        {goodMoralModalOpen && (
                            <div className="preforgot">
                                <div className="forgotbg">
                                    <h2 style={{ color: "#303030" }}>Upload Good Moral Certificate</h2>
                                    <p style={{ color: "red", fontSize: "12px" }}>
                                        Upload a scanned copy of your Good Moral Certificate. Max 2MB, formats: .jpg, .jpeg, .png.
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setGoodMoralImage(reader.result);
                                            };
                                            if (file) reader.readAsDataURL(file);
                                        }}
                                    />
                                    <div className="button-container" style={{ marginTop: '20px' }}>
                                        <button onClick={() => setGoodMoralModalOpen(false)}
                                            style={{ background: 'transparent', color: 'grey', border: '1px solid #fff', padding: '10px 20px' }}>
                                            Close
                                        </button>
                                        <button
                                            onClick={goodMoralHandleUpload}
                                            style={{ border: "1px solid #006666", background: "#006666", color: "white", padding: '10px 20px' }}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <tr style={{ background: "white" }}>
                            <td>Academic Records  ** <br />
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • First Semester Report Card (for SHS Graduating)</p>
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • Complete Report Card SF9 (for SHS Graduates) </p>
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • Complete Report Card F-138 (for  Old BEC Graduates)</p>
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • ALS Certificate of Rating (For ALS Passers)</p>
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • Transcript of Records or Certificate of Grades (For Transferees) </p>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                {uploadStatus.academic === '✔️' ? '✔️' : '❌'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}>
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}
                                        onClick={() => setAcademicModalOpen(true)}></i>

                                </button>
                            </td>
                        </tr>
                        {academicModalOpen && (
                            <div className="preforgot">
                                <div className="forgotbg">
                                    <h2 style={{ color: "#303030" }}>Upload Academic Records  Certificate</h2>
                                    <p style={{ color: "red", fontSize: "12px" }}>
                                        Upload a scanned copy of your Academic Records Certificate. Max 2MB, formats: .jpg, .jpeg, .png.
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setAcademicImage(reader.result);
                                            };
                                            if (file) reader.readAsDataURL(file);
                                        }}
                                    />
                                    <div className="button-container" style={{ marginTop: '20px' }}>
                                        <button onClick={() => setAcademicModalOpen(false)}
                                            style={{ background: 'transparent', color: 'grey', border: '1px solid #fff', padding: '10px 20px' }}>
                                            Close
                                        </button>
                                        <button
                                            onClick={academicHandleUpload}
                                            style={{ border: "1px solid #006666", background: "#006666", color: "white", padding: '10px 20px' }}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </tbody>
                </table>
                <p>- requirements to take KNSAT  <br />
                    - requirements for evaluation and interview
                </p>
            </div>

        </div>
    )
}
