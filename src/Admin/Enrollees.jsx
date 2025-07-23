import React from 'react'

export default function Enrollees() {
    return (
        <div>
            <div className="admaintab">
                <div
                    className="addnavtab"
                    draggable="false"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                >
                    <h2>
                        <i className="fa-solid fa-calendar" style={{ color: "#313131" }}></i>{" "}
                        Enrollees List
                    </h2>
                </div>

                <div className="search-enrollee-container">
                    <input
                        type="text"
                        className="search-enrollee-input"
                        placeholder="Search enrollees..."
                    />
                </div>
            </div>

            <hr style={{ width: "95%", margin: "0 auto", background: "#313131" }} />

            <div className="premainad">

            </div>
        </div>

    )
}
