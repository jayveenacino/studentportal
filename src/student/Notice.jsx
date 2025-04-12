import React from 'react';
import "./student css/notice.css";

export default function Notice() {
    return (
        <div className="notice-container">
            <div className="headernotice">
                <img src="/img/knshdlogo.png" alt="" className="logonotice" />
                <h1 style={{ color: "#006400", fontSize: "24px", margin: "0" }}>Kolehiyo Ng Subic</h1>
                <h2 style={{ fontSize: "18px", color: "#444" }}>General Privacy Notice</h2>
            </div>
            <hr style={{ background: "grey" }} />
            <p
                style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#333",
                    marginBottom: "20px",
                    marginLeft: "50px",
                    marginRight: "50px",
                }}
            >
                This is Kolehiyo Ng Subic general statement on its data processing activities to notify data subjects of
                categories of personal data processed and the purpose and extent of processing. This is not a consent form
                but an announcement on how Kolehiyo Ng Subic processes personal data. 

                <br/>
                <br/>
                Kolehiyo ng Subic respects your privacy and is committed to protecting the personal data of all students, employees, alumni, partners, 
                and other stakeholders in accordance with Republic Act No. 10173 or the Data Privacy Act of 2012.
                <br/>
                <br/>
                This Privacy Notice outlines how we collect, use, store, and protect your personal data.
            </p>

            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>1. Acts of Processing</h3>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>
                        Collected personal data is processed manually and/or electronically by authorized personnel. 
                        Access is limited to individuals who require the data to perform official functions and duties. 
                        Data is used solely for legitimate institutional purposes and not for unauthorized marketing or commercial use.</li>
                </ul>
            </div>
            <p style={{
                fontSize: "14px", lineHeight: "1.6",
                color: "#333",
                marginTop: "20px",
                marginLeft: "70px",
                marginRight: "70px",
            }}>
                The Kolehiyo Ng Subic website and web applications use cookies to prevent security risks, recognize that the
                user is logged in, customize the user’s browsing experience, store authorization tokens, and permit social
                media sharing.
            </p>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>2. Personal Data Collected</h3>
            <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>Kolehiyo ng Subic collects the following types of personal data:</p>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ marginLeft: "20px", paddingLeft: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px" }}>Basic Information:
                        <ul style={{ fontSize: "14", marginBottom: "5px" }}>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Full Name;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Place of Birth;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Date of Birth;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Civil Status;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Sex at Birth;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Sexual Orientation;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Gender Identity;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Citizenship;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Religion; and</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Address.</li>
                        </ul>
                    </li>
                </ul>
                <br/>
                <ul style={{ marginLeft: "20px", paddingLeft: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px" }}>Academic Records:
                        <ul style={{ fontSize: "14", marginBottom: "5px" }}>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Report Cards;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Academic History;</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>School Records; and</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Credentials.</li>
                        </ul>
                    </li>
                </ul>
                <br/>
                <ul style={{ marginLeft: "20px", paddingLeft: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px" }}>Identifiers:
                        <ul style={{ fontSize: "14", marginBottom: "5px" }}>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Birth Certificates (NSO/PSA);</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Government IDs; and/or</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Senior High School ID</li>
                        </ul>
                    </li>
                </ul>
                <br/>
                <ul style={{ marginLeft: "20px", paddingLeft: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px" }}>Health Information:
                        <ul style={{ fontSize: "14", marginBottom: "5px" }}>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>if the student may have a disability, they may input their disability information at the pre-registration page.</li>
                        </ul>
                    </li>
                </ul>
                <br/>
                <ul style={{ marginLeft: "20px", paddingLeft: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px" }}>Media Files:
                        <ul style={{ fontSize: "14", marginBottom: "5px" }}>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Pre-registration Documents; and</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Photos or Videos that may taken during school events and activities.</li>
                        </ul>
                    </li>
                </ul>
                <br/>
                <ul style={{ marginLeft: "20px", paddingLeft: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px" }}>Digital Information:
                        <ul style={{ fontSize: "14", marginBottom: "5px" }}>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Email Address.</li>
                        </ul>
                    </li>
                </ul>
            </div> 
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>3. Collection Method</h3>
            <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>Kolehiyo Ng Subic collect personal data through the following methods:</p>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Physical and online registration/enrollment forms</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px" }}>Direct submissions during admissions, scholarship applications, or employment</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Digital platforms (school portal, email, surveys)</li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>4. Timing of Collection</h3>
            <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>Personal data is collected at various points, including:</p>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Upon application for admission, employment, or other services</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px" }}>During enrollment and registration periods</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>While participating in school-sanctioned activities or programs</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Throughout the duration of one’s stay at the institution (and in some cases, after for alumni relations)</li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>5. Purpose of Collected Personal Data</h3>
            <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>Your personal data is collected and used for the following purposes:</p>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Academic administration and student records management</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px" }}>Communication and information dissemination</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Security, safety, and discipline enforcement</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Compliance with government regulations</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Alumni engagement and development</li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>6. Storage, Location, Transmission and Transfer of Personal Data </h3>
            <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>Your data is securely stored in:</p>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>On-site physical records (file cabinets, secured offices)</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px" }}>Local digital databases with access restrictions</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Cloud-based platforms used by KNS for academic and administrative purposes</li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>7. Method of Use </h3>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Collected personal data is processed manually and/or electronically by authorized personnel. Access is limited to individuals who require the data to perform official functions and duties. Data is used solely for legitimate institutional purposes and not for unauthorized marketing or commercial use.</li>
                </ul>
            </div>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>8. Retention Period</h3>
            <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>Your personal data is retained:</p>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>For as long as necessary to fulfill the declared purpose</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px" }}>In accordance with legal, regulatory, and academic requirements</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Retention periods for academic and employment records may vary but will not exceed the period allowed by law</li>
                </ul>
            </div>
<<<<<<< HEAD
            
=======
>>>>>>> c9165e5b230bf424b5b5bed5b32ec4aceaa3667c
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>9. Participation of Stakeholders</h3>
                <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>Data subjects have the right to:</p>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ fontSize: "14", marginBottom: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Be informed of the processing of their data</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px" }}>Access and request copies of their personal data</li>
                    <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Withdraw consent or object to processing</li>
                </ul>
            </div>
            <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>We encourage stakeholders to actively participate in safeguarding their own data by practicing secure data sharing and protecting their login credentials.</p>
            <h3 style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "80px",
                marginRight: "50px",
            }}>10. Inquiries </h3>
            <p style={{
                fontSize: "14px", lineHeight: "1.6", color: "#333",
                marginBottom: "20px",
                marginLeft: "90px",
                marginRight: "50px",
            }}>For questions, requests, or concerns about this Privacy Notice or the processing of your personal data, you may contact:</p>
            <div style={{
                fontSize: "16px", marginTop: "20px",
                color: "#333",
                marginLeft: "100px",
                marginRight: "50px",
            }}>
                <ul style={{ marginLeft: "20px", paddingLeft: "10px" }}>
                    <li style={{ fontSize: "14", marginBottom: "5px" }}>Kolehiyo ng Subic: Office of Student Affairs (OSA)
                        <ul style={{ fontSize: "14", marginBottom: "5px" }}>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Address: WFI Compound, Brgy Wawandue, Subic, Zambales</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Email: kolehiyongsubic01@gmail.com</li>
                            <li style={{ fontSize: "14", marginBottom: "5px", marginLeft: "20px", marginTop: "10px" }}>Office Hours:8:00 AM - 5:00 PM</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}
