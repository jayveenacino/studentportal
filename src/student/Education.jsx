import React from 'react'

export default function Education() {
    return (
        <div className="preprofile">
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className="uploads" style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: "#333" }}>Select a Program to Enroll</h4>
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
                        <div className="persofom-group ext" style={{ width: '50%' }}>
                            <label>Second Choice *</label>
                            <select className="persofom-input">
                                <option value="" disabled hidden>Select One</option>
                            </select>
                        </div>
                    </div>
                </div>
                <hr />
                <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: "center" }}>
                    <div className="persofom-group ext" style={{ width: '30%' }}>
                        <label>Scholarship Type *</label>
                        <select className="persofom-input">
                        <option value="" disabled selected>Select One</option>
                            <option value="FGE" >Free Goverment Education</option>
                            <option value="SPS" >Non - Scholar Paying Student</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className="persofom-group name" style={{ width: '30%' }}>
                        <label>Other Scholarship *</label>
                        <div className="persofom-input-container">
                            <input
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', width: '100%', margin: "20px" }}>
                    <div className="persofom-group name" style={{ width: '77%' }}>
                        <label>Elementary School *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='Elementary School Graduated'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: '13%' }}>
                        <label>Year Graduated *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='Ex. 2015'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', width: '100%', margin: "20px", marginTop: "-10px" }}>
                    <div className="persofom-group name" style={{ width: '77%' }}>
                        <label>SHS/HS Graduated *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='School where you graduated SHS / HS'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: '13%' }}>
                        <label>Year Graduated *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='Ex. 2020'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", margin: "20px", marginTop: "-10px" }}>
                    <div className="persofom-group ext" style={{ width: '20%' }}>
                        <label>School type of SHS/HS *</label>
                        <select className="persofom-input">
                            <option value="" disabled hidden>Select One</option>
                        </select>
                    </div>
                    <div className="persofom-group ext" style={{ width: '60%' }}>
                        <label>SHS Strand *</label>
                        <select className="persofom-input">
                            <option value="" disabled hidden>Select One</option>
                        </select>
                    </div>
                    <div className="persofom-group name" style={{ width: '13%' }}>
                        <label>LRN *</label>
                        <div className="persofom-input-container">
                            <input
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                </div>
                <div className="persofom-group name" style={{ width: '93%', margin: "20px", marginTop: "-10px" }}>
                    <label style={{ fontSize: '11px' }}>Achivements / Honors *</label>
                    <div className="persofom-input-container">
                        <textarea
                            className="persofom-input"
                            style={{
                                width: '100%',
                                minHeight: '50px',
                                resize: 'vertical',
                                fontSize: '11px',
                            }}
                        />
                    </div>
                </div>
                <hr />
                <h4 style={{ color: "orange", fontSize: "12px", margin: "20px", marginTop: "10px" }}>For transferees and second courser only.</h4>
                <div style={{ display: 'flex', gap: '2rem', width: '100%', margin: "20px", marginTop: "-10px" }}>
                    <div className="persofom-group name" style={{ width: '50%' }}>
                        <label>College *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='College / University Graduated'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: '22%' }}>
                        <label>Course / Program *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='Ex. BSCS, BSEd, BSHM, BSBA'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: '15%' }}>
                        <label>Year Graduated *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='Ex. 2015'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', width: '100%', margin: "20px", marginTop: "-10px" }}>
                    <div className="persofom-group name" style={{ width: '50%' }}>
                        <label>Technical / Vocational School *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='College / University Graduated'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: '22%' }}>
                        <label>Course / Program *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='Ex. Computer System Service'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: '15%' }}>
                        <label>Year Completed *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='Ex. 2015'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', width: '100%', margin: "20px", marginTop: "-10px" }}>
                    <div className="persofom-group name" style={{ width: '50%' }}>
                        <label>National Certificate *</label>
                        <div className="persofom-input-container">
                            <input
                                placeholder='Ex. Computer System Servicing, Animation'
                                className="persofom-input"
                                type="text"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: '22%' }}>
                        <label>NC Level *</label>
                        <div className="persofom-group ext" style={{ width: '190%' }}>
                            <select className="persofom-input">
                                <option value="" disabled selected>Select One</option>
                                <option value="nc1">National Certificate I</option>
                                <option value="nc2">National Certificate II</option>
                                <option value="nc3">National Certificate III</option>
                                <option value="nc4">National Certificate IV</option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}
