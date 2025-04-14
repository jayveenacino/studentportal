import React from 'react'

export default function Announcement() {
    return (
        <div>
            <div className="premaintab">
                <div className="prenavtab"  draggable="false" style={{ pointerEvents: "none", userSelect: "none" }} >
                    <h2>Bulletin</h2>
                    <p>Visual bulletin boards, reminders, and posted announcements</p>
                </div>
                <img src="public/img/knshdlogo.png" alt="Illustration"  draggable="false" style={{ pointerEvents: "none", userSelect: "none" }} />
            </div>
        </div>
    )
}
