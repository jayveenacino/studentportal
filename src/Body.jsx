import React from 'react';
import { Link } from 'react-router-dom';

export default function Body() {
	const steps = [
		{
			title: 'STEP 1. CREATE ONLINE PORTAL ACCOUNT',
			content: [
				<>
					- Go to Kolehiyo Ng Subic Admission Portal Login page{' '}
					<Link to="signup" target="_blank">
						(Create Account)
					</Link>
				</>,
				'1. Click "Create Account"',
				'2. Type your email address, given name, last name, date of birth, contact number, desired password, and select type of student (NEW STUDENT, TRANSFEREE, SECOND COURSER)',
				'3. Click "Register"',
				'NOTES:',
				'○ A valid and existing email address is required in this process.',
				'○ Do not create multiple accounts as this will be grounds for disapproval of application.',
				'○ Do not forget your email and password.',
			],
		},
		{
			title: 'STEP 2. LOG ON TO YOUR ACCOUNT',
			content: [
				'1. Go to the portal login page',
				'2. Type your previously registered email address and password, then click "Log in"',
				'You will be directed to the portal Dashboard.',
				'The Dashboard displays the status of your application.',
			],
		},
		{
			title: 'STEP 3. PROFILING',
			content: [
				'1. On the upper left side of the page, click "Upload Photo" to upload your recent photo.',
				'GUIDE:',
				'2. 2X2 colored picture, white background',
				'3. Picture should be taken not later than one week prior to filing of application.',
				'4. On the Menu, click "Profile"',
				'5. Completely and accurately fill out forms (Personal Information, Family Background, and Desired Programs)',
				'6. Read the Kolehiyo Ng Subic General Data Privacy Notice and click the CHECKBOX.',
				'7. Review the form and Click "Submit"',
			],
		},
	];

	return (
		<div>
			<div className="details text-center p-4">
				<h2 className="font-medium text-2xl text-zinc-900">
					Online Application For Kolehiyo Ng Subic Admission Test (KNSAT) <br />
					First Semester A.Y 2025 - 2026
				</h2>
				<p className="text-xs text-zinc-500 mt-2">
					Please be informed that all applications shall be submitted online to
					prevent line and waiting.
				</p>
			</div>

			<div className="info grid grid-cols-3 gap-4">
				{steps.map((step, index) => (
					<div
						key={index}
						className="border border-zinc-200 p-4 rounded-lg shadow-xs bg-white flex flex-col gap-2">
						<h1 className="font-semibold">{step.title}</h1>
						{step.content.map((item, i) => (
							<p key={i} className="">
								{item}
							</p>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
