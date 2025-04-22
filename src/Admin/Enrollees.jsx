import React from 'react'

export default function Enrollees() {
    return (
        <div className="enrollment-form">
            <h2>Enrollees</h2>
            <p>Enter the name or the student number</p>
            <hr />
            <div className="ensearch">
                <label >Search </label>
                <input className="enrolsearch" type="text" placeholder="student name / student no" />
            </div>
            <div className="enrolgrid">
                <table>
                    <th>
                        <td>Id</td>
                        <td>Name</td>
                        <td>Birthday</td>
                        <td>Phone Number</td>
                        <td>Registering As</td>
                        <td>Status</td>
                        <td>Details</td>
                    </th>
                </table>
            </div>
        </div>
    )
}
