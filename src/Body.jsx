import React from 'react';
import { Link } from 'react-router-dom';
import "./student/student css/notice.css";

export default function Body({ setPage }) {

    return (
        <div style={{ pointerEvents: "none", userSelect: "none" }}>
            <div className="details" >
                <h2 className="headtitle">
                    Online Application For Kolehiyo Ng Subic Admission Test (KNSAT) <br />
                    First Semester A.Y 2025 - 2026
                </h2>
            </div>
            <img
                className="imgnotice"
                src="/img/Untitled-1.png"
                alt=""
                draggable="false"
                style={{ margin: "0 auto", pointerEvents: "none", userSelect: "none" }}
            />
            <div className="info">
                <h3 className='infoheader3'>PLEASE BE ADVISED THAT ALL APPLICATIONS WILL BE SENT ONLINE.</h3>
                <h3 className='stepsheader'>Step 1: CREATE A PRE-REGISTRATION ACCOUNT </h3>
                <div className='instructionsTB'>
                    <ul>
                        <li>
                            Go to the Kolehiyo ng Subic Admission Portal Login Page &nbsp;
                            <Link
                                to="signup"
                                target="_blank"
                                style={{ color: "green", pointerEvents: "auto", userSelect: "none" }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "orange";
                                    e.target.style.fontSize = "1.03rem";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = "green";
                                    e.target.style.fontSize = "1rem";
                                }}
                                onTouchStart={(e) => {
                                    e.target.style.color = "orange";
                                }}
                                onTouchEnd={(e) => {
                                    setTimeout(() => {
                                        e.target.style.color = "green";
                                    });
                                }}
                            >
                                ( localhost:30001/signup )
                            </Link>

                        </li>
                        <li>Click <strong>"Create Account"</strong></li>
                        <li>
                            Type your Email Address, First Name, Last Name, Date of Birth, Contact Number, Desired Password, and Select Type of Student
                            <br /><br />
                            (NEW STUDENT, TRANSFEREE, SECOND COURSER)
                        </li>
                        <li>Click <strong>"Register"</strong></li>
                    </ul>
                </div>

                <h3 className='stepsheader'>TAKE NOTE: </h3>
                <div className='instructions'>
                    <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>A valid and existing email address is required in this process. </li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Ensure the all information are true as accounts with false information will be deleted.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Do not create multiple accounts as this will be grounds for disapproval of application.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Do not forget your email and password.</li>
                    </ul>
                </div>
                <h3 className='stepsheader'>STEP 2: LOG ON TO YOUR ACCOUNT</h3>
                <div className='instructions'>
                    <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Go to the <strong>Portal Login Page</strong>. </li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Type your previously registered email address and password, then click <strong>"Log in"</strong></li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>You will be directed to the portal Dashboard.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>The Dashboard displays the status of your application.</li>
                    </ul>
                </div>
                <h3 className='stepsheader'>STEP 3: PROFILING</h3>
                <div className='instructions'>
                    <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After logging in, you will be redirected at the Welcome Page. Here you will see the available slots of each department for the semester </li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>On the Left Side of the page, click "Profile". The Profile page is where you will input your Basic Information.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>On the upper left side of the page, click "Upload Photo" to upload your photo. <strong>Use 2x2 picture with White Background.</strong></li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After uploading your 2x2 Picture, Please read the Data Privacy Statement you may also read the full notice by clicking the link.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After reading the statement, click <strong>"Accept and Continue"</strong></li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After clicking, the Basic Information Page will pop out, this is where you fill out your personal information. After filling out click <strong>"Save"</strong></li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After filling out your Basic Information, Fill out your Educational Background, and click <strong>"Save"</strong> after filling out.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After filling out your Educational Background, Enter your Family Background, click <strong>"Save"</strong> after filling out.</li>
                    </ul>
                </div>
                <h3 className='stepsheader'>STEP 4: DOCUMENT UPLOADS </h3>
                <div className='instructions'>
                    <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>At the profile page, you may scroll down and click the <strong>"Upload Documents"</strong> section.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>This page is where you will upload the necessary documents that are needed for your enrollment.</li>
                    </ul>
                </div>
                <h3 className='instructions'>Prepare the Following Documents: </h3>
                <div className='instructions'>
                    <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>2x2 Picture with White Background</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Government Issued ID or Senior High School ID (<strong>Must be Recently Graduated if you are using a Senior High School ID</strong>)</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>NSO/PSA Birth Certificate</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Certficate of Good Moral </li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}><strong>Academic Records:</strong></li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>First Semester Report Card (for SHS Graduating)</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Complete Report Card SF9 (for SHS Graduates)</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Complete Report Card F-138 (for Old BEC Graduates)</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>ALS Certificate of Rating (For ALS Passers)</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Transcript of Records or Certificate of Grades (For Transferees)</li>
                    </ul>

                </div>
                <h3 className='instructions' >Make sure that the documents that you are uploading are clear and readable as blurred photos may affect the readability of your documents and your enrollment.</h3>
                <h3 className='stepsheader'>STEP 5: CONFIRMATION</h3>
                <div className='instructions'>
                    <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After filling out the needed information forms you may now click the <strong>"Finalize Enlisment"</strong> button</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After clicking the button, please wait for the confirmation email of your KNS Admission Test Schedule that is sent to you by the school. </li>
                    </ul>
                </div>
                <h3 className='Tnote'>TAKE NOTE : </h3>
                <div className='instructions' style={{ fontWeight: "bold" }}>
                    <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Double Check your information before finalizing.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Ensure that there are no typos or errors in your information as it may affect your enlistment.</li>
                        <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Be sure that the uploaded documents are clear and readable.</li>
                    </ul>
                    <hr />
                </div>

            </div>
        </div>
    );
}
