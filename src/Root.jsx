import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';

export default function Root() {
	const location = useLocation();

	//COMMENT: Bad practice to use pathname to determine the component to render
	//COMMENT: Use a better way to determine the component to render

	return (
		<>
			{location.pathname !== '/signup' &&
				location.pathname !== '/signup/create' &&
				location.pathname !== '/login' &&
				location.pathname !== '/adminlogin' &&
				location.pathname !== '/login/notice' &&
				location.pathname !== '/admindashboard' &&
				location.pathname !== '/preregister' &&
				location.pathname !== '/preregister/notice' && <Nav />}

			<Outlet />
			{location.pathname !== '/signup' &&
				location.pathname !== '/signup/create' &&
				location.pathname !== '/login' &&
				location.pathname !== '/adminlogin' &&
				location.pathname !== '/login/notice' &&
				location.pathname !== '/admindashboard' &&
				location.pathname !== '/preregister' &&
				location.pathname !== '/preregister/notice' && <Footer />}
		</>
	);
}
