import React from 'react'
import Nav from './Nav'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'

export default function Root() {
    const location = useLocation()

    return (
        <>

            {(location.pathname !== "/signup" && location.pathname !== "/signup/create" && location.pathname !== "/login" && location.pathname !== "/adminlogin" && location.pathname !== "/login/notice" && location.pathname !== "/admindashboard" && location.pathname !== "/preregister") &&
                <Nav />
            }

            <Outlet />
            {(location.pathname !== "/signup" && location.pathname !== "/signup/create" && location.pathname !== "/login" && location.pathname !== "/adminlogin" && location.pathname !== "/login/notice" && location.pathname !== "/admindashboard" && location.pathname !== "/preregister") &&
                <Footer />
            }

        </>
    )
}
