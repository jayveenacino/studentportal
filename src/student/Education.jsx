import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAdmin from '../Admin/useAdmin';
import Swal from 'sweetalert2';

export default function Education() {

    const { user, setUser } = useAdmin();
    const [scholar, setScholar] = useState(user?.scholar || '');
    const [otherScholar, setOtherScholar] = useState(user?.otherScholar || '');
    const [elementary, setElementary] = useState(user?.elementary || '');
    const [elemYear, setElemYear] = useState(user?.elemYear || '')
    const [highschool, setHighschool] = useState(user?.highschool || '');
    const [highYear, setHighYear] = useState(user?.highYear || '');
    const [schoolType, setSchoolType] = useState(user?.schoolType || '');
    const [strand, setStrand] = useState(user?.strand || '');
    const [lrn, setLrn] = useState(user?.lrn || '');
    const [honor, setHonor] = useState(user?.honor || '');
    const [college, setCollege] = useState(user?.college || '');
    const [technical, setTechnical] = useState(user?.technical || '');
    const [certificate, setCertificate] = useState(user?.certificate || '');
    const [course, setCourse] = useState(user?.course || '');
    const [year, setYear] = useState(user?.year || '');
    const [program, setProgram] = useState(user?.program || '');
    const [yearCom, setYearCom] = useState(user?.yearCom || '');
    const [achivements, setAchivments] = useState(user?.achivements || '');
    

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.email) return;

            try {
                const response = await axios.get(
                    `http://localhost:2025/get-profile?email=${user.email}`
                )
                const profileData = response.data;

                setScholar(profileData.scholar || '')
                setOtherScholar(profileData.otherScholar || '')
                setElementary(profileData.elementary || '')
                setElemYear(profileData.elemYear || '')
                setElemYear(profileData.highYear || '')
                setHighYear(profileData.highschool || '')
                setSchoolType(profileData.schoolType || '')
                setStrand(profileData.strand || '')
                setLrn(profileData.lrn || '')
                setHonor(profileData.honor || '')
                setCollege(profileData.college || '')
                setCourse(profileData.course || '')
                setYear(profileData.year || '')
                setProgram(profileData.program || '')
                setTechnical(profileData.technical || '')
                setCertificate(profileData.certificate || '')
                setYearCom(profileData.yearCom || '')
                setAchivments(profileData.achivements || '')

            } catch (error) {
                console.error('Error fetching user Profile', error);
            }
        };
    }, [user.email]);

    const [formErrors, setFormErrors] = useState({
        scholar: false,
        elementary: false,
        elemYear: false,
        highYear: false,
        highschool: false,
        schoolType: false,
        strand: false,
        lrn: false,
    });

    const validateForm = () => {
        const errors = {};
        if (!scholar) errors.scholar = true;
        if (!elementary) errors.elementary = true;
        if (!elemYear) errors.elemYear = true;
        if (!highYear) errors.highYear = true;
        if (!highschool) errors.highschool = true;
        if (!schoolType) errors.schoolType = true;
        if (!strand) errors.strand = true;
        if (!lrn) errors.lrn = true;
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        if (!isValid) {
            const missingFields = Object.keys(formErrors).filter(
                (field) => formErrors[field]
            );
            Swal.fire({
                title: 'Please fill up the following fields:',
                html: `<ul style="text-align: left;">${missingFields.map((field) => `<li>${field}</li>`).join('')}</ul>`,
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (!user || !user.email) {
            Swal.fire({
                title: 'User Not Found!',
                text: 'No user is currently logged in or user email is missing.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        const updatedFields = {};
        if (scholar) updatedFields.scholar = scholar;
        if (elementary) updatedFields.elementary = elementary;
        if (elemYear) updatedFields.elemYear = elemYear;
        if (highschool) updatedFields.highschool = highschool;
        if (highYear) updatedFields.highYear = highYear;
        if (schoolType) updatedFields.schoolType = schoolType;
        if (strand) updatedFields.strand = strand;
        if (lrn) updatedFields.lrn = lrn;
        if (honor) updatedFields.honor = honor;
        if (college) updatedFields.college =college;
        if (course) updatedFields.course =course;
        if (year) updatedFields.year =year;
        if (technical) updatedFields.technical =technical;
        if (program) updatedFields.program =program;
        if (yearCom) updatedFields.yearCom =yearCom;
        if (certificate) updatedFields.certificate =certificate;
        if (achivements) updatedFields.achivements =achivements;


        try {
            const response = await axios.put('http://localhost:2025/update-profile', {
                email: user.email,
                ...updatedFields,
            });

            console.log('Response:', response.data);

            Swal.fire({
                title: 'Profile Updated!',
                text: 'Your profile has been updated successfully.',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Continue to Family Section',
                cancelButtonText: 'Stay Here',
            }).then((result) => {
                if (result.isConfirmed) {
                    setFillsection("education");
                }
            });
        } catch (error) {
            console.error('Error while updating profile:', error);
            if (error.response) {
                Swal.fire({
                    title: 'Update Failed!',
                    text: `Backend error: ${error.response.data.error}`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Something went wrong!',
                    text: 'Unable to update your profile. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const [otherScholarship, setOtherScholarship] = useState('');
    const handleScholarChange = (e) => {
        const selected = e.target.value;
        setScholar(selected);

        if (selected === 'FGE') {
            setOtherScholarship('Free Government Education');
        } else if (selected === 'SPS') {
            setOtherScholarship('Non - Scholar Paying Student');
        } else {
            setOtherScholarship('');
        }
    };


    return (
        <form>
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
                            <select
                                value={scholar || user?.scholar || ''}
                                onChange={(e) => setScholar(e.target.value)}
                                className={`persofom-input ${formErrors.scholar ? 'error' : ''}`}
                            >

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
                                    value={scholar}
                                    onChange={(e) => setOtherScholarship(e.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', width: '100%', margin: "20px" }}>
                        <div className="persofom-group name" style={{ width: '77%' }}>
                            <label>Elementary School *</label>
                            <div className="persofom-input-container">
                                <input
                                    className={`persofom-input ${formErrors.elementary ? 'error' : ''}`}
                                    value={elementary || ''}
                                    onChange={(e) => setElementary(e.target.value)}
                                    placeholder='Elementary School Graduated'
                                    type="text"
                                    style={{ fontSize: '15px' }}
                                />
                            </div>
                        </div>
                        <div className="persofom-group name" style={{ width: '13%' }}>
                            <label>Year Graduated *</label>
                            <div className="persofom-input-container">
                                <input
                                    className={`persofom-input ${formErrors.elemYear ? 'error' : ''}`}
                                    placeholder='Ex. 2015'
                                    value={elemYear || ''}
                                    onChange={(e) => setElemYear(e.target.value)}
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
                                    onChange={(e) => setHighschool(e.target.value)}
                                    placeholder='School where you graduated SHS / HS'
                                    className={`persofom-input ${formErrors.highschool ? 'error' : ''}`}
                                    value={highschool || ''}
                                    type="text"
                                    style={{ fontSize: '15px' }}
                                />
                            </div>
                        </div>
                        <div className="persofom-group name" style={{ width: '13%' }}>
                            <label>Year Graduated *</label>
                            <div className="persofom-input-container">
                                <input
                                    value={highYear || ''}
                                    onChange={(e) => setHighYear(e.target.value)}
                                    placeholder='Ex. 2020'
                                    className={`persofom-input ${formErrors.highYear ? 'error' : ''}`}
                                    type="text"
                                    style={{ fontSize: '15px' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", margin: "20px", marginTop: "-10px" }}>
                        <div className="persofom-group ext" style={{ width: '20%' }}>
                            <label>School type of SHS/HS *</label>
                            <select
                                className={`persofom-input ${formErrors.schoolType ? 'error' : ''}`}
                                value={schoolType || user?.schoolType || ''}
                                onChange={(e) => setSchoolType(e.target.value)}
                            >
                                <option value="" disabled selected>Select One</option>
                                <option value="public">Public School</option>
                                <option value="private">Private School</option>
                            </select>
                        </div>
                        <div className="persofom-group ext" style={{ width: '60%' }}>
                            <label>SHS Strand *</label>
                            <select
                                className={`persofom-input ${formErrors.strand ? 'error' : ''}`}
                                value={strand || user?.strand || ''}
                                onChange={(e) => setStrand(e.target.value)}
                            >
                                <option value="" disabled selected>Select One</option>
                                <option value="ABM" >Accountancy, Business, and Management (ABM)</option>
                                <option value="GAS" >General Academic Strand (GAS)</option>
                                <option value="HUMSS" >Humanities and Social Sciences (HUMSS)</option>
                                <option value="STEM" >Science, Technology, Engineering, and Mathematics (STEM)</option>
                                <option value="AFA" >Agri-Fishery Arts (TVL-AFA)</option>
                                <option value="HE" >Home Economics (TVL-HE)</option>
                                <option value="IA" >Industrial Arts (TVL-IA)</option>
                                <option value="ICT" >Information and Communication Technology (TVL-ICT)</option>
                                <option value="MS" >Maritime Specialization (TVL-MS)</option>
                                <option value="SMAW" >Shielded Metal Arc Welding (TVL-SMAW) (TVL-MS)</option>
                                <option value="NONE" >Did Not Take Senior High School Program</option>
                            </select>
                        </div>
                        <div className="persofom-group name" style={{ width: '13%' }}>
                            <label>LRN *</label>
                            <div className="persofom-input-container">
                                <input
                                    className={`persofom-input ${formErrors.lrn ? 'error' : ''}`}
                                    value={lrn || ''}
                                    onChange={(e) => setLrn(e.target.value)}
                                    type="text"
                                    style={{ fontSize: '15px' }}
                                    placeholder='LRN'
                                />
                            </div>
                        </div>
                    </div>
                    <div className="persofom-group name" style={{ width: '93%', margin: "20px", marginTop: "-10px" }}>
                        <label style={{ fontSize: '11px' }}>Achivements / Honors *</label>
                        <div className="persofom-input-container">
                            <textarea
                                className={`persofom-input ${formErrors.honor ? 'error' : ''}`}
                                value={honor || ''}
                                onChange={(e) => setHonor(e.target.value)}
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
                                    onChange={(e) => setCollege(e.target.value)}
                                    value={college || ''}
                                    placeholder='College / University Graduated'
                                    className={`persofom-input ${formErrors.college ? 'error' : ''}`}
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
                                    value={course || ''}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className={`persofom-input ${formErrors.course ? 'error' : ''}`}
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
                                    value={year || ''}
                                    onChange={(e) => setYear(e.target.value)}
                                    className={`persofom-input ${formErrors.year ? 'error' : ''}`}
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
                                    value={technical || ''}
                                    onChange={(e) => setTechnical(e.target.value)}
                                    className={`persofom-input ${formErrors.technical ? 'error' : ''}`}
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
                                    value={program || ''}
                                    onChange={(e) => setProgram(e.target.value)}
                                    className={`persofom-input ${formErrors.program ? 'error' : ''}`}
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
                                    value={yearCom || ''}
                                    onChange={(e) => setYearCom(e.target.value)}
                                    className={`persofom-input ${formErrors.yearCom ? 'error' : ''}`}
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
                                    value={certificate || ''}
                                    onChange={(e) => setCertificate(e.target.value)}
                                    className={`persofom-input ${formErrors.certificate ? 'error' : ''}`}
                                    type="text"
                                    style={{ fontSize: '15px' }}
                                />
                            </div>
                        </div>
                        <div className="persofom-group name" style={{ width: '22%' }}>
                            <label>NC Level *</label>
                            <div className="persofom-group ext" style={{ width: '190%' }}>
                                <select
                                    className={`persofom-input ${formErrors.achivements ? 'error' : ''}`}
                                    value={achivements || user?.achivements || ''}
                                    onChange={(e) => setAchivments(e.target.value)}>
                                    <option value="" disabled selected>Select One</option>
                                    <option value="nc1">National Certificate I</option>
                                    <option value="nc2">National Certificate II</option>
                                    <option value="nc3">National Certificate III</option>
                                    <option value="nc4">National Certificate IV</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="unibtn" style={{ marginTop: '20px' }}>
                        <button type="submit" onClick={handleUpdateProfile}>
                            <i className="fa-solid fa-download"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        </form>

    )
}
