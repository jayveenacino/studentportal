import React from 'react'

export default function Adminuser() {
    return (
        <div>
            <div className="label-container1">
                
                <h2><i class="fa-solid fa-user" style={{fontSize:"15px"}}></i> List of Users </h2>
                <button className="back-btn1" onClick={() => setCreatead(true)}><i class="fa-solid fa-plus"></i> Add User</button>
            </div>
            <hr />
        </div>
    )
}
