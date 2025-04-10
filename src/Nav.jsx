import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Nav = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	// const toggleMenu = () => {
	//     setMenuOpen(!menuOpen);
	// };

	return (
		<div className="NavWarp">
			<div className="nav-container flex p-4 gap-3 justify-center items-center">
				<Link to="Home">
					<img
						className="h-full max-h-[60px] w-auto object-contain"
						src="/img/knshdlogo.png"
						alt="KNS Logo"
					/>
				</Link>

				<div className="flex flex-col items-center">
					<Link to="Home">
						<h1 className="text-4xl font-semibold">KOLEHIYO NG SUBIC</h1>
					</Link>
					<Link to="Home">
						<p className="text-white font-light">
							Educasyon Tungo sa Kaunlaran
						</p>
					</Link>
				</div>
				{/* Hamburger Menu Button */}
				<div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
					☰
				</div>
			</div>

			{/* Mobile Menu */}
			<div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
				<p>Home</p>
				<p>About</p>
				<p>Programs</p>
				<p>Contact</p>
			</div>
		</div>
	);
};

export default Nav;
