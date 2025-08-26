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
        "/preregister/",
        "/student",
        "/signup/notice"
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
