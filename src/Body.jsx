import React from 'react';
import { Link } from 'react-router-dom';
import "./student/student css/notice.css";

export default function Body({ setPage }) {

  return (
    <div> 
      <div className="details">
        <h2 style={{fontSize:"37px",marginTop:"20px",marginBottom:"20px"}}>
          Online Application For Kolehiyo Ng Subic Admission Test (KNSAT) <br />
          First Semester A.Y 2025 - 2026
        </h2>
      </div>
      <img className="imgnotice" src="/img/Untitled-1.png" alt="" style={{ display:"block", margin: "0 auto",pointerEvents:"none",userSelect:"none  "}} />
      <div className="info">
        <h3 style={{
                fontSize: "25px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>PLEASE BE ADVISED THAT ALL APPLICATIONS WILL BE SENT ONLINE.</h3>
        <h3 style={{
                fontSize: "20px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>STEP BY STEP INSTRUCTIONS FOR REGISTERING STUDENTS:</h3>
        <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>Step 1: CREATE A PRE-REGISTRATION ACCOUNT </h3>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>
                      Go to the Kolehiyo ng Subic Admmision Portal Login Page &nbsp; <Link to="signup" target='_blank' style={{color:"green"}}>
                      ( localhost:30001/signup )</Link>
                    </li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Click <strong>"Create Account" </strong> </li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Type your Email Address, First Name, Last Name, Date of Birth, Contact Number, Desired Password, and 
                    Select Type of Student <br/><br/> (NEW STUDENT, TRANSFEREE, SECOND COURSER) </li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Click <strong>"Register"</strong></li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>TAKE NOTE: </h3>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
                fontWeight:"bold",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>A valid and existing email address is required in this process. </li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Ensure the all information are true as accounts with false information will be deleted.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Do not create multiple accounts as this will be grounds for disapproval of application.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Do not forget your email and password.</li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>STEP 2: LOG ON TO YOUR ACCOUNT</h3>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Go to the <strong>Portal Login Page</strong>. </li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Type your previously registered email address and password, then click <strong>"Log in"</strong></li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>You will be directed to the portal Dashboard.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>The Dashboard displays the status of your application.</li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>STEP 3: PROFILING</h3>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After logging in, you will be redirected at the Welcome Page. Here you will see the available slots of each department for the semester </li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>On the Left Side of the page, click "Profile". The Profile page is where you will input your Basic Information.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>On the upper left side of the page, click "Upload Photo" to upload your photo. <strong>Use 2x2 picture with White Background.</strong></li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After uploading your 2x2 Picture, Please read the Data Privacy Statement you may also read the full notice by clicking the link.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After reading the statement, click <strong>"Accept and Continue"</strong></li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After clicking, the Basic Information Page will pop out, this is where you fill out your personal information. After filling out click <strong>"Save"</strong></li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After filling out your Basic Information, Fill out your Educational Background, and click <strong>"Save"</strong> after filling out.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After filling out your Educational Background, Enter your Family Background, click <strong>"Save"</strong> after filling out.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After filling out your Family Background, Upload your Documents at the Upload Documents Page, you will see the documents that are needed to upload.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>After uploading your documents, you may now finalize your enlisment by clicking <strong>"Finalize Enlistment"</strong></li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>TAKE NOTE: </h3>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
                fontWeight:"bold",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Double Check your information before finalizing.</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Ensure that there are no typos or errors in your information as it may affect your enlistment.</li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "20px", marginTop: "25px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>That's All! Please wait for the confirmation email sent to you by the school for your entrance exam schedule. Welcome to Kolehiyo ng Subic!</h3>
      </div>
    </div>
  );
}
