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
            try {
                setAdmin(JSON.parse(adminExist));
            } catch (err) {
                console.error("Failed to parse Admin from localStorage:", err);
            }
        }

        if (userExist) {
            try {
                const parsedUser = JSON.parse(userExist || "{}"); // fallback to empty object
                console.log("User loaded:", parsedUser);
                setUser(parsedUser);
            } catch (err) {
                console.error("Failed to parse User from localStorage:", err);
            }
        }
    }, []);

    return (
        <AdminContext.Provider value={{ admin, setAdmin, user, setUser }}>
            {children}
        </AdminContext.Provider>
    )
}
