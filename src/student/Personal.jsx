import React, { useState, useEffect } from 'react';
import useAdmin from '../Admin/useAdmin';
import axios from 'axios';
import Swal from 'sweetalert2';
import Education from "./Education";

export default function Personal() {
	const handleDisabilityChange = (e) => {
		const value = e.target.value;
		if (value === 'No') {
			setDisabilityDetails(' ');
			setDisabilityCategory('None');
		}

		setIsDisabled(value === 'No');

		updateUserDetails({
			email: user.email,
			disabilityDetails: ' ',
			disabilityCategory: 'None',
		});
	};

	const handleAddressChange = (e) => {
		const { name, value } = e.target;
		if (name === 'region') {
			setRegion(value);
			setProvince('');
			setCity('');
		} else if (name === 'province') {
			setProvince(value);
			setCity('');
		} else if (name === 'city') {
			setCity(value);
		}
		else if (name === 'barangay') {
			setBarangay(value)
		}
	};

	const updateUserDetails = (updatedDetails) => {
		console.log('Sending update to backend:', updatedDetails);

		fetch('/api/updateUserDetails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedDetails),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('User details updated:', data);
			})
			.catch((error) => {
				console.error('Error updating user details:', error);
			});
	};

	const [isDisabled, setIsDisabled] = useState(true);
	const [fillsection, setFillsection] = useState("data");
	const [fillSection, setFillSection] = useState('personal');
	const { user, setUser } = useAdmin();
	const [phone, setPhone] = useState(user?.phone || '');
	const [middlename, setMiddlename] = useState(user?.middlename || '');
	const [extension, setExtension] = useState(user?.extension || '');
	const [birthplace, setBirthplace] = useState(user?.birthplace || '');
	const [civil, setCivil] = useState(user?.civil || '');
	const [sex, setSex] = useState(user?.sex || '');
	const [orientation, setOrientation] = useState(user?.orientation || '');
	const [gender, setGender] = useState(user?.gender || '');
	const [citizenship, setCitizenship] = useState(user?.citizenship || '');
	const [religion, setReligion] = useState(user?.religion || '');
	const [region, setRegion] = useState(user?.region || '');
	const [province, setProvince] = useState(user?.province || '');
	const [city, setCity] = useState(user?.city || '');
	const [barangay, setBarangay] = useState(user?.barangay || '');
	const [disability, setDisability] = useState(user?.disability || '');
	const [disabilityCategory, setDisabilityCategory] = useState(
		user?.disabilityCategory || ''
	);
	const [disabilityDetails, setDisabilityDetails] = useState(
		user?.disabilityDetails || ''
	);

	useEffect(() => {
		const fetchUserProfile = async () => {
			if (!user || !user.email) return;

			try {
				const response = await axios.get(
					`http://localhost:2025/get-profile?email=${user.email}`
				);
				const profileData = response.data;

				setPhone(profileData.phone || '');
				setMiddlename(profileData.middlename || '');
				setExtension(profileData.extension || '');
				setBirthplace(profileData.birthplace || '');
				setCivil(profileData.civil || '');
				setSex(profileData.sex || '');
				setOrientation(profileData.orientation || '');
				setGender(profileData.gender || '');
				setCitizenship(profileData.citizenship || '');
				setReligion(profileData.religion || '');
				setRegion(profileData.region || '');
				setProvince(profileData.province || '');
				setCity(profileData.city || '');
				setBarangay(profileData.barangay || '');
				setDisability(profileData.disability || '');
				setDisabilityCategory(profileData.disabilityCategory || '');
				setDisabilityDetails(profileData.disabilityDetails || '');
			} catch (error) {
				console.error('Error fetching user profile:', error);
			}
		};

		fetchUserProfile();
	}, [user.email]);

	const [formErrors, setFormErrors] = useState({
		birthplace: false,
		civil: false,
		sex: false,
		orientation: false,
		gender: false,
		citizenship: false,
		religion: false,
		region: false,
		province: false,
		city: false,
		barangay: false,
	});

	const validateForm = () => {
		const errors = {};
		if (!birthplace) errors.birthplace = true;
		if (!civil) errors.civil = true;
		if (!sex) errors.sex = true;
		if (!orientation) errors.orientation = true;
		if (!gender) errors.gender = true;
		if (!citizenship) errors.citizenship = true;
		if (!religion) errors.religion = true;
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		const isValid = validateForm();

		if (!isValid) {
			const missingFields = Object.keys(formErrors).filter(
				(field) => formErrors[field]
			);
			Swal.fire({
				title: 'Please fill up the following fields:',
				html: `<ul style="text-align: left;">${missingFields.map((field) => `<li>${field}</li>`).join('')}</ul>`,
				icon: 'warning',
				confirmButtonText: 'OK',
			});
			return;
		}

		if (!user || !user.email) {
			Swal.fire({
				title: 'User Not Found!',
				text: 'No user is currently logged in or user email is missing.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return;
		}

		const updatedFields = {};
		if (phone) updatedFields.phone = phone;
		if (birthplace) updatedFields.birthplace = birthplace;
		if (civil) updatedFields.civil = civil;
		if (sex) updatedFields.sex = sex;
		if (orientation) updatedFields.orientation = orientation;
		if (gender) updatedFields.gender = gender;
		if (citizenship) updatedFields.citizenship = citizenship;
		if (religion) updatedFields.religion = religion;
		if (region) updatedFields.region = region;
		if (province) updatedFields.province = province;
		if (city) updatedFields.city = city;
		if (barangay) updatedFields.barangay = barangay;

		try {
			const response = await axios.put('http://localhost:2025/update-profile', {
				email: user.email,
				...updatedFields,
			});

			console.log('Response:', response.data);

			Swal.fire({
				title: 'Profile Updated!',
				text: 'Your profile has been updated successfully.',
				icon: 'success',
				showCancelButton: true,
				confirmButtonText: 'Continue to Education Section',
				cancelButtonText: 'Stay Here',
			}).then((result) => {
				if (result.isConfirmed) {
					setFillsection("education");
				}
			});
		} catch (error) {
			console.error('Error while updating profile:', error);
			if (error.response) {
				Swal.fire({
					title: 'Update Failed!',
					text: `Backend error: ${error.response.data.error}`,
					icon: 'error',
					confirmButtonText: 'OK',
				});
			} else {
				Swal.fire({
					title: 'Something went wrong!',
					text: 'Unable to update your profile. Please try again later.',
					icon: 'error',
					confirmButtonText: 'OK',
				});
			}
		}
	};

	return (
		<div
			className={`persofom-container ${fillSection === 'personal' ? 'show' : ''
				}`}>
			<div className="persofom-grid">
				<div className="uploads" style={{ marginBottom: '1rem', width: "100%" }}>
					<div>
						<h4 style={{ color: "#333" }}>Complete your personal information!	</h4>
						<p style={{ marginBottom: "20px", fontSize: "10px", fontStyle: "italic", marginTop: "10px", color: "orange" }}>
							This helps us keep your records accurate and up-to-date!
							<hr style={{ background: "grey" }} />
						</p>

						<div style={{ display: 'flex', flexDirection: 'row', gap: "3rem", width: '100%', justifyContent: "center" }}>

							<div className="persofom-group" style={{}}>
								<label>Personal Email Address*</label>
								<div className="persofom-input" style={{ color: 'lightgrey', background: "white", pointerEvents: "none", userSelect: "none" }}>
									{user?.email || ''}
								</div>
							</div>
							<div className="persofom-group" style={{}}>
								<label>Mobile Number*</label>
								<input
									type="text"
									className="persofom-input"
									value={user?.phone || extension || ''}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<div style={{ marginTop: "15px" }}>
						<div className="persofom-group name-container">
							{/* First Name */}
							<div className="persofom-group name">
								<label>First Name*</label>
								<div className="persofom-input-container">
									<div className="persofom-input" style={{ background: "white" }}>{user?.firstname || ''}</div>
									<i
										className="lock-icon fa fa-lock"
										title="This field is locked"></i>
								</div>
							</div>

							{/* Middle Name */}
							<div className="persofom-group name">
								<label>Middle Name</label>
								<input
									className="persofom-input"
									type="text"
									value={middlename}
									onChange={(e) => setMiddlename(e.target.value)}
								/>
							</div>

							{/* Last Name */}
							<div className="persofom-group name">
								<label>Last Name*</label>
								<div className="persofom-input-container">
									<div className="persofom-input" style={{ background: "white" }}>{user?.lastname || ''}</div>
									<i
										className="lock-icon fa fa-lock"
										title="This field is locked"></i>
								</div>
							</div>

							{/* Extension Name */}
							<div className="persofom-group ext">
								<label>Ext Name</label>
								<select
									className="persofom-input"
									value={extension || user?.extension || ''}
									onChange={(e) => {
										const selectedValue = e.target.value;
										setExtension(selectedValue);
										if (selectedValue === '') {
											setExtension('');
										}
									}}>
									<option value="" disabled hidden>
										Extension
									</option>
									<option value=" ">None</option>
									<option value="Sr">Sr</option>
									<option value="Jr">Jr</option>
									<option value="III">III</option>
									<option value="IV">IV</option>
									<option value="V">V</option>
								</select>
							</div>
						</div>
					</div>

				</div>

				<form onSubmit={handleUpdateProfile} className="persofom-grid">
					<div
						className="persofom-group name"
						style={{ width: '10%', marginRight: '15px' }}>
						<label>Birthdate*</label>
						<div className="persofom-input-container">
							<div className="persofom-input">{user?.birthdate || ''}</div>
							<i
								className="lock-icon fa fa-lock"
								title="This field is locked"></i>
						</div>
					</div>
					<div
						className="persofom-group name"
						style={{ width: '15    %', marginRight: '12px' }}>
						<label>Birth place*</label>
						<div className="persofom-input-container">
							<input
								className={`persofom-input ${formErrors.birthplace ? 'error' : ''
									}`}
								type="text"
								value={birthplace}
								onChange={(e) => setBirthplace(e.target.value)}
								style={{
									borderColor: formErrors.birthplace ? 'red' : '',
									fontSize: '15px',
								}}
							/>
						</div>
					</div>
					<div className="persofom-group ext" style={{ width: '10%' }}>
						<label>Civil Status</label>
						<select
							className={`persofom-input ${formErrors.civil ? 'error' : ''}`}
							value={civil || user?.civil || ''}
							onChange={(e) => setCivil(e.target.value)}>
							<option value="" disabled hidden>
								Select One
							</option>
							<option>Single</option>
							<option>Married</option>
							<option>Widowed</option>
							<option>Separated</option>
						</select>
					</div>

					<div className="persofom-group ext" style={{ width: '10%' }}>
						<label>Sex at Birth</label>
						<select
							className={`persofom-input ${formErrors.sex ? 'error' : ''}`}
							value={sex || user?.sex || ''}
							onChange={(e) => setSex(e.target.value)}>
							<option value="" disabled hidden>
								Select One
							</option>
							<option>Male</option>
							<option>Female</option>
						</select>
					</div>
					<div className="persofom-group ext" style={{ width: '20%' }}>
						<label>Sexual Orientation*</label>
						<select
							className={`persofom-input ${formErrors.orientation ? 'error' : ''
								}`}
							value={orientation || user?.orientation || ''}
							onChange={(e) => setOrientation(e.target.value)}>
							<option value="" disabled hidden>
								Select One
							</option>
							<option>Decline to Answer</option>
							<option>Straight</option>
							<option>Lesbian</option>
							<option>Gay</option>
							<option>Bisexual</option>
							<option>Queer</option>
							<option>Something Else</option>
						</select>
					</div>
					<div className="persofom-group ext" style={{ width: '16%' }}>
						<label>Gender Identity*</label>
						<select
							className={`persofom-input ${formErrors.gender ? 'error' : ''}`}
							value={gender || user?.gender || ''}
							onChange={(e) => setGender(e.target.value)}>
							<option value="" disabled hidden>
								Select One
							</option>
							<option>Male/Man</option>
							<option>Female/Woman</option>
							<option>Transmale/Transman</option>
							<option>Transfemale/Transwomen</option>
							<option>Something else</option>
							<option>Decline to Answer</option>
						</select>
					</div>
					<div className="persofom-group ext" style={{ width: '14%' }}>
						<label>Citizenship*</label>
						<select
							className={`persofom-input ${formErrors.citizenship ? 'error' : ''
								}`}
							value={citizenship || user?.citizenship || ''}
							onChange={(e) => setCitizenship(e.target.value)}>
							<option value="" disabled hidden>
								Select Citizenship
							</option>
							<option>Filipino</option>
							<option>American</option>
							<option>Chinese</option>
							<option>Indian</option>
							<option>Japanese </option>
							<option>Korean</option>
							<option>Others</option>
						</select>
					</div>
					<div
						className="persofom-group name"
						style={{ width: '15%', marginRight: '12px' }}>
						<label>Religion *</label>
						<div className="persofom-input-container">
							<input
								className={`persofom-input ${formErrors.religion ? 'error' : ''}`}
								value={religion}
								onChange={(e) => setReligion(e.target.value)}
							/>
						</div>
					</div>

					<div className="smalltitle">
						<hr style={{ marginTop: '20px', marginBottom: '20px' }} />
						<h2 style={{ fontSize: '12px', color: 'green' }}>
							Current Address
						</h2>
					</div>

					{/* Region */}
					<div className="persofom-group ext" style={{ width: '23.4%', marginTop: '-15px' }}>
						<label>Region*</label>
						<select
							name="region"
							className={`persofom-input ${formErrors.region ? 'error' : ''}`}
							value={region}
							onChange={handleAddressChange}
						>
							<option value="Region III">Region III (CENTRAL LUZON)</option>
						</select>
					</div>

					{/* Province */}
					<div className="persofom-group ext" style={{ width: '23.4%', marginTop: '-15px' }}>
						<label>Province*</label>
						<select
							name="province"
							className={`persofom-input ${formErrors.province ? 'error' : ''}`}
							value={province}
							onChange={handleAddressChange}
						>
							<option value="" disabled selected>Select One</option>
							<option value="Zambales">ZAMBALES</option>
							<option value="Zambales">OLONGAPO</option>
						
						</select>
					</div>
					{province === 'Zambales' && (
						<div className="persofom-group ext" style={{ width: '23.4%', marginTop: '-15px' }}>
							<label>City/Municipality*</label>
							<select
								name="city"
								className={`persofom-input ${formErrors.city ? 'error' : ''}`}
								value={city}
								onChange={handleAddressChange}
							>
								<option value="" disabled selected>Select One</option>
								<option value="Botolan">BOTOLAN</option>
								<option value="Cabangan">CABANGAN</option>
								<option value="Candelaria">CANDELARIA</option>
								<option value="Castillejos">CASTILLEJOS</option>
								<option value="Iba">IBA</option>
								<option value="Masinloc">MASINLOC</option>
								<option value="Olongapo">OLONGAPO CITY</option>
								<option value="Palauig">PALAUIG</option>
								<option value="San Antonio">SAN ANTONIO</option>
								<option value="San Felipe">SAN FELIPE</option>
								<option value="San Marcelino">SAN MARCELINO</option>
								<option value="San Narciso">SAN NARCISO</option>
								<option value="Santa Cruz">SANTA CRUZ</option>
								<option value="Subic">SUBIC</option>
							</select>
						</div>
					)}

					{/* Barangay */}
					{city === 'Subic' && (
						<div className="persofom-group ext" style={{ width: '23.4%', marginTop: '-15px' }}>
							<label>Barangay *</label>
							<select
								name="barangay"
								className={`persofom-input ${formErrors.barangay ? 'error' : ''}`}
								value={barangay}
								onChange={handleAddressChange}
							>
								<option value="" disabled selected>Select One</option>
								<option value="ANINGWAY-SACATIHAN">ANINGWAY-SACATIHAN</option>
								<option value="ASINAN PROPER">ASINAN PROPER</option>
								<option value="ASINAN PINES">ASINAN PINES</option>
								<option value="BARACA-CAMACHILE">BARACA-CAMACHILE</option>
								<option value="CALAPACUAN">CALAPACUAN</option>
								<option value="ILWAS">ILWAS</option>
								<option value="MANGALIT">MANGALIT</option>
								<option value="MATAIN">MATAIN</option>
								<option value="NAGBANGON">NAGBANGON</option>
								<option value="NATIONAL HIGHWAY">NATIONAL HIGHWAY</option>
								<option value="PAG-ASA">PAG-ASA</option>
								<option value="SAN ISIDRO">SAN ISIDRO</option>
								<option value="SAN RAFAEL">SAN RAFAEL</option>
								<option value="SANTO TOMAS">SANTO TOMAS</option>
								<option value="WAWANDUE">WAWANDUE</option>
							</select>
						</div>
					)}
				</form>
			</div>

			<hr style={{ marginTop: '20px', marginBottom: '20px' }} />
			<div className="smalltitle">
				<h2 style={{ fontSize: '12px', color: 'green' }}>
					Personal Disability Information
				</h2>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
				<div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
					<div className="persofom-group ext" style={{ width: '25%' }}>
						<label style={{ fontSize: '11px', color: 'orange' }}>
							Disability person?
						</label>
						<select
							className="persofom-input"
							onChange={(e) => handleDisabilityChange(e)}>
							<option value="No">No</option>
							<option value="Yes">Yes</option>
						</select>
					</div>
					<div className="persofom-group ext" style={{ width: '85%' }}>
						<label style={{ fontSize: '11px' }}>Disability Category</label>
						<select
							className="persofom-input"
							disabled={isDisabled}
							value={disabilityCategory || user?.disabilityCategory || ''}
							onChange={(e) => setDisabilityCategory(e.target.value)}>
							<option value="" disabled hidden>
								Select One
							</option>
							<option>None</option>
							<option>Physical Disability</option>
							<option>Visual Disability</option>
							<option>Deaf/Hard of Hearing</option>
							<option>Learning Disability</option>
							<option>Intellectual Disability</option>
							<option>Psychosocial Disability</option>
							<option>Mental Disability</option>
							<option>Speech Impairment</option>
							<option>Cancer</option>
							<option>Rare Disease</option>
						</select>
					</div>
				</div>
				<div className="persofom-group name" style={{ width: '100%' }}>
					<label style={{ fontSize: '11px' }}>Disability Details*</label>
					<div className="persofom-input-container">
						<textarea
							className="persofom-input"
							value={disabilityDetails || ''}
							onChange={(e) => setDisabilityDetails(e.target.value)}
							placeholder="Describe your disability here..."
							disabled={isDisabled}
							style={{
								width: '100%',
								minHeight: '50px',
								resize: 'vertical',
								fontSize: '11px',
							}}
						/>
					</div>
				</div>
			</div>
			<div className="unibtn" style={{ marginTop: '20px' }}>
				<button type="submit" onClick={handleUpdateProfile}>
					<i className="fa-solid fa-download"></i> Save
				</button>
			</div>
		</div>
	);
}
