import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAdmin from '../Admin/useAdmin'
import Swal from 'sweetalert2'
import { set } from 'mongoose';

export default function Family() {

    const { user, setUser } = useAdmin();
    const [fatName, setFatName] = useState(user?.fatName || '');
    const [fatMidName, setFatMidName] = useState(user?.fatMidName || '');
    const [fatLastName, setFatLastName] = useState(user?.fatLastName || '');
    const [fatExt, setFatExt] = useState(user?.fatExt || '');
    const [motName, setMotName] = useState(user?.motName || '');
    const [motMidName, setMotMidName] = useState(user?.motMidName || '');
    const [motLastName, setMotLastName] = useState(user?.motLastName || '');
    const [broNum, setBroNum] = useState(user?.broNum || '');
    const [sisNum, setSisNum] = useState(user?.sisNum || '');
    const [guarName, setGuarName] = useState(user?.guarName || '');
    const [guarRelationship, setGuarRelationship] = useState(user?.guarRelationship || '');
    const [guarAddress, setGuarAddress] = useState(user?.guarAddress || '');
    const [guarEmail, setGuarEmail] = useState(user?.guarEmail || '');
    const [guarTel, setGuarTel] = useState(user?.guarTel || '');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.email) return;

            try {
                const response = await axios.get(
                    `http://localhost:2025/get-profile?email=${user.email}`
                )
                const profileData = response.data;

                setFatName(profileData.fatName || '');
                setFatMidName(profileData.fatMidName || '');
                setFatLastName(profileData.fatLastName || '');
                setFatExt(profileData.fatExt || '');
                setMotName(profileData.motName || '');
                setMotMidName(profileData.motMidName || '');
                setMotLastName(profileData.motLastName || '');
                setBroNum(profileData.broNum || '');
                setSisNum(profileData.sisNum || '');
                setGuarName(profileData.guarName || '');
                setGuarRelationship(profileData.guarRelationship || '');
                setGuarAddress(profileData.guarAddress || '');
                setGuarEmail(profileData.guarEmail || '');
                setGuarTel(profileData.guarTel || '');
            }
            catch (error) {
                console.error('Error fetching user Profile', error);
            }
        };
    }, [user.email]);
    return (
        <div className="preprofile">
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className="uploads" style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: "#333" }}>Family Information</h4>
                    <p style={{ marginBottom: "20px", fontSize: "10px", fontStyle: "italic", marginTop: "10px", color: "orange" }}>
                        Please provide your family details below. This helps us understand your background and ensure proper support when needed.
                        <hr style={{ background: "grey" }} />
                    </p>
                    <h4 style={{ color: "#333", fontSize: "12px" }}>Tell us a bit about your family! This information helps us get to know you better and provide the right support throughout your journey at Kolehiyo ng Subic.
                    </h4>
                </div>
                <hr />
                <div style={{ marginTop: "15px" }}>
                    <h4 style={{ color: "#333" }}>Father's Information</h4>
                    <hr />
                    <div className="persofom-group name-container">
                        <div className="persofom-group name">
                            <label>First Name*</label>
                            <div className="persofom-input-container">
                                <input
                                    className="persofom-input"
                                />
                            </div>
                        </div>
                        <div className="persofom-group name">
                            <label>Middle Name</label>
                            <input
                                className="persofom-input"
                            />
                        </div>
                        <div className="persofom-group name">
                            <label>Last Name*</label>
                            <div className="persofom-input-container">
                                <input
                                    className="persofom-input"
                                />
                            </div>
                        </div>
                        <div className="persofom-group ext">
                            <label>Ext Name</label>
                            <select
                                className="persofom-input"
                            >
                                <option value="" disabled hidden>
                                    Extension
                                </option>
                                <option value=" ">None</option>
                                <option value="Sr">Sr</option>
                                <option value="Jr">Jr</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                                <option value="V">V</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "15px" }}>
                    <h4 style={{ color: "#333" }}>Mother's Information</h4>
                    <hr />
                    <div className="persofom-group name-container">
                        <div className="persofom-group name">
                            <label>First Name*</label>
                            <div className="persofom-input-container">
                                <input
                                    className="persofom-input"
                                />
                            </div>
                        </div>
                        <div className="persofom-group name">
                            <label>Middle Name</label>
                            <input
                                className="persofom-input"
                            />
                        </div>
                        <div className="persofom-group name">
                            <label>Last Name*</label>
                            <div className="persofom-input-container">
                                <input
                                    className="persofom-input"
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <div style={{ marginTop: "15px" }}>
                    <h4 style={{ color: "orange" }}>Brothers and Sisters</h4>
                    <hr />
                    <div className="persofom-group name-container">
                        <div className="persofom-group name">
                            <label>Number of Brother *</label>
                            <div className="persofom-input-container">
                                <input
                                    type='number'
                                    className="persofom-input"
                                />
                            </div>
                        </div>
                        <div className="persofom-group name">
                            <label>Number of Sister *</label>
                            <input
                                type='number'
                                className="persofom-input"
                            />
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "15px" }}>
                    <h4 style={{ color: "green" }}>Guardian's Profile</h4>
                    <hr />
                    <div className="persofom-group name-container">
                        <div className="persofom-group name">
                            <label>Guardian Name *</label>
                            <div className="persofom-input-container">
                                <input
                                    placeholder='Ex. Juan M. Dela Cruz Jr'
                                    className="persofom-input"
                                    style={{ width: "700px" }}
                                />
                            </div>
                        </div>
                        <div className="persofom-group name">
                            <label>Relationship *</label>
                            <div className="persofom-input-container">
                                <input
                                    placeholder='Mother, Father, Sister, ect'
                                    className="persofom-input"
                                />
                            </div>
                        </div>

                    </div>
                    <div className="persofom-group name-container" style={{ marginTop: "15px", marginBottom: "20px" }}>
                        <div className="persofom-group name">
                            <label>Guardian Address (House No. Street, Barangay, City/municipality) *</label>
                            <div className="persofom-input-container">
                                <input
                                    placeholder='Ex. WFI Compound, Wawandue, Subic Zambales'
                                    className="persofom-input"
                                    style={{ width: "420px" }}
                                />
                            </div>
                        </div>
                        <div className="persofom-group name">
                            <label>Guardian's Email Address *</label>
                            <div className="persofom-input-container">
                                <input
                                    placeholder='Guardians Email'
                                    className="persofom-input"
                                />
                            </div>
                        </div>
                        <div className="persofom-group name">
                            <label>Mobile Number *</label>
                            <div className="persofom-input-container">
                                <input
                                    placeholder='+63 xxx-xxxx-xxx'
                                    className="persofom-input"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
