import React from 'react'

export default function Updocx() {
    return (
        <div className="ipreprofile">
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
                            <td style={{ textAlign: 'center' }}> ✔️  </td>
                            <td style={{ textAlign: 'center' }}>
                                <button style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}>
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}></i>
                                </button>
                            </td>
                        </tr>
                        <tr style={{ background: "white" }}>
                            <td>Valid ID Card/Senior High School ID Card *	</td>
                            <td style={{ textAlign: 'center' }}> ❌ </td>
                            <td style={{ textAlign: 'center' }}>
                                <button style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}>
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}></i>
                                </button>
                            </td>
                        </tr>
                        <tr style={{ background: "white" }}>
                            <td>NSO/PSA Birth Certificate *		</td>
                            <td style={{ textAlign: 'center' }}> ❌ </td>
                            <td style={{ textAlign: 'center' }}>
                                <button style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}>
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}></i>
                                </button>
                            </td>
                        </tr>
                        <tr style={{ background: "white" }}>
                            <td>Certificate of Good Moral Character *</td>
                            <td style={{ textAlign: 'center' }}> ❌ </td>
                            <td style={{ textAlign: 'center' }}>
                                <button style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}>
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}></i>
                                </button>
                            </td>
                        </tr>
                        <tr style={{ background: "white" }}>
                            <td>Academic Records  ** <br />
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • First Semester Report Card (for SHS Graduating)</p>
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • Complete Report Card SF9 (for SHS Graduates) </p>
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • Complete Report Card F-138 (for  Old BEC Graduates)</p>
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • ALS Certificate of Rating (For ALS Passers)</p>
                                <p style={{ fontSize: "14px", marginLeft: "20px" }}> • Transcript of Records or Certificate of Grades (For Transferees) </p>
                            </td>
                            <td style={{ textAlign: 'center' }}> ❌ </td>
                            <td style={{ textAlign: 'center' }}>
                                <button style={{ border: 'none', borderRadius: "3px", backgroundColor: 'orange', padding: '6px' }}>
                                    <i className="fa-solid fa-upload" style={{ fontSize: "15px" }}></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>- requirements to take KNSAT  <br />
                - requirements for evaluation and interview
                </p>
            </div>

        </div>
    )
}
