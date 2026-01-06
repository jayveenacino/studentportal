import React from 'react';
import "./Admincss/subjects.css";

const Subjects = () => {
    return (
        <div className='subjects-container'>
            <div className="subjects-header">
                <h1>Subjects Manager</h1>
                <p>This is where you can manage available subjects.</p>
            </div>

            <div className="subjects-controls">
                <button className="subjects-add-btn" onClick={() => {
                }}>
                    + Add Subject
                </button>
            </div>

            <div className="subjects-table-container">
                <table className="subjects-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Subject Name</th>
                            <th>Department</th>
                            <th style={{ textAlign: "right", paddingRight: "55px" }}>Actions</th>
                        </tr>
                    </thead>

                </table>
            </div>

        </div>

    );
}
export default Subjects;