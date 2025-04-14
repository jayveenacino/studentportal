import React from 'react'
import Updocx from './Updocx'

export default function Upload() {
    return (
        <div>
            <div className="premaintab"  draggable="false" style={{ pointerEvents: "none", userSelect: "none" }} >
                <div className="prenavtab">
                    <h2>Uploads</h2>
                    <p>View/Change uploaded documents</p>
                </div>
                <img src="public/img/knshdlogo.png" alt="Illustration"  draggable="false" style={{ pointerEvents: "none", userSelect: "none" }} />
            </div>
            <Updocx/>
        </div>
    )
}
