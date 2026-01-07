import React from 'react'
import Nav from './Nav'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'

export default function Root() {
    const location = useLocation()
    const hiddenPaths = [
        "/signup",
        "/signup/create",
        "/login",
        "/adminlogin",
        "/login/notice",
        "/admindashboard",
        "/preregister",
        "/preregister/notice",
        "/auth/secure-access/admin-portal",
        "/auth/secure-access/admin-portal/",
        "/preregister/",
        "/auth/secure-access/admin-portal/admindashboard",
        "/auth/secure-access/admin-portal/admindashboard/",
        "/auth/secure-access/admin-portal/login",
        "/body/signup",
        "/studentmain",
        "/signup/notice",
        "/signup/create/notice",
        "/pages/NotFound"
    ]

    const shouldShowLayout = !hiddenPaths.includes(location.pathname)
    return (
        <>
            {shouldShowLayout && <Nav />}
            <Outlet />
            {shouldShowLayout && <Footer />}
        </>
    )
}
