import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

export default function useAdmin() {
    return useContext(AdminContext)
}

export function AdminContextProvider({ children }) {
    const [admin, setAdmin] = useState({
        email: ""
    })

    const [user, setUser] = useState({})

    useEffect(() => {
        const adminExist = localStorage.getItem("Admin");
        const userExist = localStorage.getItem("user");
    
        if (adminExist) {
            setAdmin(JSON.parse(adminExist));
        }
    
        if (userExist) {
            console.log("User loaded:", JSON.parse(userExist));
            setUser(JSON.parse(userExist));
        }
    }, []);
    return (
        <AdminContext.Provider value={{ admin, setAdmin, user, setUser }}>
            {children}
        </AdminContext.Provider>
    )
}
