import React from 'react'
import useAdmin from "../Admin/useAdmin";

export default function Welcome() {
    const { user, setUser } = useAdmin()
    return (
        <div>
            <div className="premaintab">
                <div className="prenavtab">
                    <h2>Kolehiyo Ng Subic Student Admission Portal</h2>
                    <p>Welcome, {user?.firstname || ""} {user?.middlename || ""} {user?.lastname || ""} {user?.extension || ""}</p>
                </div>
                <img src="public/img/knshdlogo.png" alt="Illustration" />
            </div>
            <div className="premainad">
                <div className="addatails">
                    <h2>Welcome to the Kolehiyo Ng Subic Admission Portal</h2>
                    <hr />
                    <p>Thank you for choosing Kolehiyo Ng Subic as your educational destination. We're excited to guide you through the admission process!</p>
                    <p>Here, you can submit your application, track your progress, and receive important updates regarding your interview and admission status</p>
                    <p style={{ fontWeight: "bold" }}>To get Started :</p>
                    <p> • Complete your application form with accurate details.</p>
                    <p> • Make sure to upload the required documents. Please take note that <strong>uploading of false documents and/or blank or incorrect documents is strictly prohibited</strong>  and will be subject to the <strong>immediate deletion of your account</strong> </p>
                    <p> • Keep track of important deadlines and communications through the <strong>Dashboard section</strong>  of this portal.</p>
                    <p> • You have 10 working days upon registration to accomplish all of the required documents otherwise your account will be moved to the archived list. </p>
                    <p>If you have any questions or need assistance, our Admission Team is here to help! Feel free to reach out to us at
                        <br />
                        <strong style={{ fontSize: "14px", color: "darkgreen" }}>@kolehiyongsubic01@gmail.com</strong>
                    </p>
                    <p>
                        We look forward to welcoming you to the Kolehiyo ng Subic family and wish you the best luck with your application
                    </p>
                </div>
                <div className="admissionsum">
                    <h2>Admission Applicant Summary</h2>
                    <hr />
                    <table className="status-table" style={{ width: '100%' }}>
                        <thead style={{ background: "white" }}>
                            <tr>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}>Courses</td>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}>Slot</td>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}>Status</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ background: "white" }}>
                                <td></td>
                                <td style={{ textAlign: 'center' }}>   </td>
                                <td style={{ textAlign: 'center' }}>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
