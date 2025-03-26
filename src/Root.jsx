import React from 'react'
import Nav from './Nav'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'

export default function Root() {
    const location = useLocation()
    console.log(location.pathname)
    return (
        <>
            {(location.pathname !== "/Signup" && location.pathname !== "/Signup/Create" && location.pathname !== "/Login" && location.pathname !== "/Adminlogin" && location.pathname !== "/Login/Notice" && location.pathname !== "/AdminDashboard" )&&
                <Nav />
            }

            <Outlet />
            {(location.pathname !== "/Signup" && location.pathname !== "/Signup/Create" && location.pathname !== "/Login"  && location.pathname !== "/Adminlogin" && location.pathname !== "/Adminlogin" && location.pathname !== "/Login/Notice" && location.pathname !== "/AdminDashboard")&&
                <Footer />
            }

        </>
    )
}
