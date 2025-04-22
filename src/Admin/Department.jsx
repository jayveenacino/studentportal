import React from 'react'

export default function Department() {
    return (
        <div>
            <h2>Department</h2>
            <p>Enter new department entry</p>
            <hr />
            <div className="deptsearch">
                <label >Search </label>
                <input className="enrolsearch" type="text" placeholder="Search Department" />
                <button>Create New Department</button>
            </div>
            <div className="deptgrid">
                <table>
                    <thead> 
                        <tr>
                            <th>Id</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )
}
