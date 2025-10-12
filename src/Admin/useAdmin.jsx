import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export default function useAdmin() {
    return useContext(AdminContext);
}

export function AdminContextProvider({ children }) {
    const [admin, setAdmin] = useState({ email: "" });
    const [user, setUser] = useState({});
    const [acceptedStudent, setAcceptedStudent] = useState({});

    useEffect(() => {
        const adminExist = localStorage.getItem("Admin");
        if (adminExist) {
            try {
                setAdmin(JSON.parse(adminExist));
            } catch (err) {
                console.error("Failed to parse Admin from localStorage:", err);
            }
        }

        const userExist = localStorage.getItem("user");
        if (userExist) {
            try {
                setUser(JSON.parse(userExist || "{}"));
            } catch (err) {
                console.error("Failed to parse User from localStorage:", err);
            }
        }

        const acceptedExist = localStorage.getItem("acceptedStudent");
        if (acceptedExist) {
            try {
                const parsedStudent = JSON.parse(acceptedExist);
                setAcceptedStudent({
                    firstname: parsedStudent.firstName || parsedStudent.firstname || "",
                    middlename: parsedStudent.middleName || parsedStudent.middlename || "",
                    lastname: parsedStudent.lastName || parsedStudent.lastname || "",
                    extension: parsedStudent.extension || ""
                });
                console.log("Accepted student loaded:", parsedStudent);
            } catch (err) {
                console.error("Failed to parse acceptedStudent from localStorage:", err);
            }
        }
    }, []);

    return (
        <AdminContext.Provider value={{ admin, setAdmin, user, setUser, acceptedStudent, setAcceptedStudent }}>
            {children}
        </AdminContext.Provider>
    );
}
