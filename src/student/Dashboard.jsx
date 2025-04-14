import React from 'react'

export default function Dashboard() {
    return (
        <div>
            <div className="premaintab"  draggable="false" style={{ pointerEvents: "none", userSelect: "none" }} >
                <div className="prenavtab">
                    <h2>Dashboard</h2>
                    <p>View metrics and other information</p>
                </div>
                <img src="public/img/knshdlogo.png" alt="Illustration"  draggable="false" style={{ pointerEvents: "none", userSelect: "none" }}  />
            </div>
            <div className="predash">
                <div className="predashtab">
                    <h2>Admission Status</h2>
                    <hr />
                    <table className="status-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th colSpan="2" style={{ width: '50%' }}>Choices</th>
                                <th style={{ width: '50%' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>First Choice:</td>
                                <td style={{ width: "35%" }}></td>
                                <td>Profiling not yet done</td>
                            </tr>
                            <tr>
                                <td>Second Choice:</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="predashtab">

                    <table className="status-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th colSpan="1" style={{ width: '10%' }}>Admission Status</th>
                                <th style={{ width: '50%' }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: "center" }}><strong>Not Specified</strong></td>
                                <td>You have not yet selected your program choices</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}><strong>1st Choice</strong></td>
                                <td>Currently being reviewed in the program you specified as your first choice</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}><strong>2nd Choice</strong></td>
                                <td>Currently being reviewed in the program you specified as your second choice</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}><strong>Waiting List</strong></td>
                                <td>One or both of your KNSAT entrance exam scores are below the threshold required for automatic evaluation. After all automatic evaluations for review are finished, the evaluation of applicants on the waiting list will begin.</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}><strong>NOT Accepted</strong></td>
                                <td>Somehow you've been denied admission in your chosen programs. Most common reason is that you have failed to pass the minimum requirement of the program.</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}><strong>Confirmed</strong></td>
                                <td>You have confirmed admission in the program</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center" }}><strong>Declined</strong></td>
                                <td>You have declined admission in the program</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
