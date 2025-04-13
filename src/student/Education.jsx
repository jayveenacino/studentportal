import React from 'react'

export default function Education() {
    return (
        <div className="preprofile">
            <div className="uploads">
                <h4 >Select a Program to Enroll</h4 >
                <p style={{ marginBottom: "20px", fontSize: "10px", fontStyle: "italic", marginTop: "10px", color: "orange" }}>
                    Please choose wisely. Once you have selected a program you will not be able to change it once you have confirmed your enlistment
                    <hr style={{ background: "grey" }} />
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="persofom-group ext" style={{ width: '50%' }}>
                        <label>First Choice *</label>
                        <select className="persofom-input">
                            <option value="" disabled hidden>Select One</option>

                        </select>
                    </div>
                    <div className="persofom-group ext" style={{ width: '50%', height: "50%" }}>
                        <label>Second Choice *</label>
                        <select className="persofom-input">
                            <option value="" disabled hidden>Select One</option>

                        </select>
                    </div>
                </div>
            </div>

        </div>
    )
}
