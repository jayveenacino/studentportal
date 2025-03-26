import React, {createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

export default function useAdmin() {
    return useContext(AdminContext)
}

export function AdminContextProvider({ children}) {
    const [admin, setAdmin] = useState({
        email: ""
    })

    useEffect(() => {
        const adminExist = localStorage.getItem('Admin')

        if (adminExist) {
            setAdmin(JSON.parse(adminExist))
        }
    }, [])

    return (
        <AdminContext.Provider value={{admin, setAdmin}}>
            {children}
        </AdminContext.Provider>
    )
}
