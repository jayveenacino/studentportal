import React from 'react';
import { Link } from 'react-router-dom';

export default function Body({ setPage }) {


  return (
    <div>
      <div className="details">
        <h2>
          Online Application For Kolehiyo Ng Subic Admission Test (KNSAT) <br />
          First Semester A.Y 2025 - 2026
        </h2>
      </div>
      <div className="info">
        <p>
          Please be informed that all applications shall be submitted online to prevent line and waiting.
        </p>

        <p className="steps">STEP 1. CREATE ONLINE PORTAL ACCOUNT</p>
        <p>
          - Go to Kolehiyo Ng Subic Admission Portal Login page
          <Link to="Signup" target='_blank'>
            (Create Account)
          </Link>

        </p>
        <p>- Click "Create Account"</p>
        <p>
          - Type your email address, given name, last name, date of birth, contact number, desired password, and
          select type of student (NEW STUDENT, TRANSFEREE, SECOND COURSER)
        </p>
        <p>- Click "Register"</p>

        <p>NOTES:</p>
        <p> ○ A valid and existing email address is required in this process.</p>
        <p> ○ Do not create multiple accounts as this will be grounds for disapproval of application.</p>
        <p> ○ Do not forget your email and password.</p>

        <p className="steps">STEP 2. LOG ON TO YOUR ACCOUNT</p>
        <p>- Go to the portal login page</p>
        <p>- Type your previously registered email address and password, then click "Log in"</p>
        <p>You will be directed to the portal Dashboard.</p>
        <p>The Dashboard displays the status of your application.</p>

        <p className="steps">STEP 3. PROFILING</p>
        <p>- On the upper left side of the page, click "Upload Photo" to upload your recent photo.</p>

        <p>GUIDE:</p>
        <p> ○ 2X2 colored picture, white background</p>
        <p> ○ Picture should be taken not later than one week prior to filing of application.</p>
        <p>- On the Menu, click "Profile"</p>
        <p>- Completely and accurately fill out forms (Personal Information, Family Background, and Desired Programs)</p>
        <p>- Read the Kolehiyo Ng Subic General Data Privacy Notice and click the CHECKBOX.</p>
        <p>- Review the form and Click "Submit"</p>
      </div>
    </div>
  );
}
