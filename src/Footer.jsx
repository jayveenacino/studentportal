import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
	return (
		<div className="footer border border-red-500 ">
			<div className="grid grid-cols-3 grid-rows-3 grid-flow-col h-full max-h-[600px] p-6 pb-0 gap-6">
				<div className="h-full max-h-[180px] border-b">
					<h1 className="text-lg font-semibold">About KNS</h1>
					<p className="font-light">
						Kolehiyo ng Subic, or known as KNS, is the first community college
						in the province of Zambales. Mayor Jeffrey D. Khonghun, the
						President Emeritus, is the acknowledged founder and father of the
						school.
					</p>
				</div>
				<div className="h-full max-h-[180px] border-b">
					<h1 className="text-lg font-semibold">Contact Us!</h1>
					<p className="font-light">
						<i className="fa-solid fa-phone" style={{ fontSize: '15px' }}></i>{' '}
						(047) 232 4897
					</p>
					<p className="font-light">
						<i
							className="fa-solid fa-envelope"
							style={{ fontSize: '15px' }}></i>{' '}
						Kolehiyongsubic01@gmail.com
					</p>
					<p className="font-light">
						<i
							className="fa-solid fa-location-dot"
							style={{ fontSize: '15px' }}></i>{' '}
						6GJ+WPX, Burgos St, Baraca, Subic, 2209 Zambales
					</p>
				</div>
				<div className="h-full max-h-[180px] ">
					<p className="font-light">Citizen's Charter</p>
					<p className="font-light">Website Policy</p>
					<p className="font-light">Data Privacy Policy</p>
					<p className="font-light">Rights of Data Subjects </p>
					<p className="font-light">Responsibilities of Data Subjects</p>
				</div>

				<div className="h-full max-h-[180px] border-b">
					<h1 className="text-lg font-semibold">Student Resources</h1>
					<p> KNSLamp</p>
					<Link to="login" style={{ textDecoration: 'None' }}>
						<a>
							<p
								style={{
									transition: 'color 0.3s ease',
								}}
								onMouseEnter={(e) => (e.target.style.color = 'orange')}
								onMouseLeave={(e) => (e.target.style.color = 'white')}>
								Student Portal
							</p>
						</a>
					</Link>
					<Link to="signup" style={{ textDecoration: 'None' }}>
						<a>
							<p
								style={{
									transition: 'color 0.3s ease',
								}}
								onMouseEnter={(e) => (e.target.style.color = 'orange')}
								onMouseLeave={(e) => (e.target.style.color = 'white')}>
								KNS Admission
							</p>
						</a>
					</Link>

					<Link to="/" style={{ textDecoration: 'None' }}>
						<a>
							<p
								style={{
									transition: 'color 0.3s ease',
								}}
								onMouseEnter={(e) => (e.target.style.color = 'orange')}
								onMouseLeave={(e) => (e.target.style.color = 'white')}>
								Register
							</p>
						</a>
					</Link>
				</div>

				<div className="h-full max-h-[180px] border-b">
					<h1 className="text-lg font-semibold">Faculty Resources</h1>
					<p className="font-light">KNS Lamp</p>
					<p className="font-light">KNS Health Check</p>
					<p className="font-light">KNS Registrar</p>
					<p className="font-light">KNS Teachers Portal</p>
					<p className="font-light">KNS Deans Portal</p>
				</div>

				<div className="h-full max-h-[180px] col-start-3 border-b">
					<h1 className="text-lg font-semibold">Connect With Us!</h1>
					<div className="social-icons">
						<button className="social-btn">
							<i
								className="fa-brands fa-square-facebook"
								style={{ fontSize: '15px' }}></i>{' '}
							Facebook
						</button>
						<button className="social-btn">
							<i
								className="fa-brands fa-square-x-twitter"
								style={{ fontSize: '15px' }}></i>{' '}
							Twitter
						</button>
						<button className="social-btn">
							<i
								className="fa-brands fa-youtube"
								style={{ fontSize: '15px' }}></i>{' '}
							YouTube
						</button>
					</div>
				</div>

				<div className="footer-logo h-full max-h-[180px] col-start-3">
					<img src="/img/knshdlogo.png" alt="KNS LOGO" />
				</div>
			</div>
			<div className="footer-bottom">
				<p>
					Copyright © 2025{' '}
					<span className="" style={{ color: '#00ff00', fontWeight: 'bold' }}>
						Kolehiyo Ng Subic
					</span>
					. All rights reserved.
				</p>
			</div>
		</div>
	);
}
