import React, { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import useAdmin from "../Admin/useAdmin";
import axios from "axios";
import Data from "./Data";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useAdmin();

    const [profilepfp, setProfilepfp] = useState(false);
    const [fillsection, setFillsection] = useState("data");
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:2025/api/courses")
            .then((res) => setCourses(res.data))
            .catch((err) => console.error("Course fetch error:", err));
    }, []);

    //? LOCK SECTION
    const formSections = [
        "personal",
        "education",
        "family",
        "uploads",
        "confirmation",
    ];

    const [unlockedSections, setUnlockedSections] = useState(() => {
        return JSON.parse(localStorage.getItem("unlockedSections")) || ["personal"];
    });

    //!DOCXS FUNCTION
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [birthCertModalOpen, setBirthCertModalOpen] = useState(false);
    const [goodMoralModalOpen, setGoodMoralModalOpen] = useState(false);
    const [academicModalOpen, setAcademicModalOpen] = useState(false);

    const [image, setImage] = useState(null);
    const [idimage, setIdImage] = useState(null);
    const [birthCertImage, setBirthCertImage] = useState(null);
    const [goodMoralImage, setGoodMoralImage] = useState(null);
    const [academicImage, setAcademicImage] = useState(null);

    const [uploadStatus, setUploadStatus] = useState({
        profileImage: "❌",
        validId: "❌",
        birthCert: "❌",
        goodMoral: "❌",
        academic: "❌",
    });

    useEffect(() => {
        if (user?.email) {
            axios
                .get(`http://localhost:2025/get-upload-status/${user.email}`)
                .then((res) => {
                    setUploadStatus({
                        profileImage: res.data.profileImage ? "✔️" : "❌",
                        validId: res.data.validId ? "✔️" : "❌",
                        birthCert: res.data.birthCert ? "✔️" : "❌",
                        goodMoral: res.data.goodMoral ? "✔️" : "❌",
                        academic: res.data.academic ? "✔️" : "❌",
                    });
                })
                .catch((err) => console.error("Status fetch failed", err));
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setIdImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const idHandleUpload = async () => {
        if (!idimage || !user?.email) {
            Swal.fire({
                icon: "error",
                title: "Upload Required",
                text: "Please select a valid ID image before submitting.",
                confirmButtonColor: "#006666",
            });
            return;
        }

        try {
            const res = await axios.post("http://localhost:2025/upload-id-image", {
                email: user.email,
                idimage: idimage,
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Uploaded Successfully",
                    text: "Your valid ID has been uploaded!",
                    confirmButtonColor: "#006666",
                });

                setUploadStatus((prev) => ({ ...prev, validId: "✔️" }));
                setUploadModalOpen(false);
                setIdImage(null);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus((prev) => ({ ...prev, validId: "❌" }));

            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Something went wrong. Please try again.",
                confirmButtonColor: "#006666",
            });
        }
    };

    //! BIRTH CERT
    const birthCertHandleUpload = async () => {
        if (!birthCertImage || !user?.email) {
            Swal.fire({
                icon: "error",
                title: "Upload Required",
                text: "Please upload your Birth Certificate before submitting.",
                confirmButtonColor: "#006666",
            });
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:2025/upload-birthcert-image",
                {
                    email: user.email,
                    birthCertImage,
                }
            );

            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Uploaded Successfully",
                    text: "Your Birth Certificate has been uploaded!",
                    confirmButtonColor: "#006666",
                });

                setUploadStatus((prev) => ({ ...prev, birthCert: "✔️" }));
                setBirthCertModalOpen(false);
                setBirthCertImage(null);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus((prev) => ({ ...prev, birthCert: "❌" }));

            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Birth Certificate upload failed. Please try again.",
                confirmButtonColor: "#006666",
            });
        }
    };

    //! GOOD MORAL
    const goodMoralHandleUpload = async () => {
        if (!goodMoralImage || !user?.email) {
            Swal.fire({
                icon: "error",
                title: "Upload Required",
                text: "Please upload your Good Moral Certificate before submitting.",
                confirmButtonColor: "#006666",
            });
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:2025/upload-goodmoral-image",
                {
                    email: user.email,
                    goodMoralImage,
                }
            );

            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Uploaded Successfully",
                    text: "Your Good Moral Certificate has been uploaded!",
                    confirmButtonColor: "#006666",
                });

                setUploadStatus((prev) => ({ ...prev, goodMoral: "✔️" }));
                setGoodMoralModalOpen(false);
                setGoodMoralImage(null);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus((prev) => ({ ...prev, goodMoral: "❌" }));

            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Good Moral upload failed. Please try again.",
                confirmButtonColor: "#006666",
            });
        }
    };

    //! ACADEMIC RECORDS
    const academicHandleUpload = async () => {
        if (!academicImage || !user?.email) {
            Swal.fire({
                icon: "error",
                title: "Upload Required",
                text: "Please upload your Academic Records before submitting.",
                confirmButtonColor: "#006666",
            });
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:2025/upload-academic-image",
                {
                    email: user.email,
                    academicImage,
                }
            );

            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Uploaded Successfully",
                    text: "Your Academic Records have been uploaded!",
                    confirmButtonColor: "#006666",
                });

                setUploadStatus((prev) => ({ ...prev, academic: "✔️" }));
                setAcademicModalOpen(false);
                setAcademicImage(null);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus((prev) => ({ ...prev, academic: "❌" }));

            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Academic Records upload failed. Please try again.",
                confirmButtonColor: "#006666",
            });
        }
    };

    const goToSection = (section) => {
        if (unlockedSections.includes(section)) {
            setFillsection(section);

            const updatedUnlocked = Array.from(
                new Set([...unlockedSections, section])
            );
            setUnlockedSections(updatedUnlocked);
            localStorage.setItem("unlockedSections", JSON.stringify(updatedUnlocked));
        }
    };
    useEffect(() => {
        if (!unlockedSections.includes(fillsection)) {
            const updated = [...unlockedSections, fillsection];
            setUnlockedSections(updated);
            localStorage.setItem("unlockedSections", JSON.stringify(updated));
        }
    }, [fillsection]);

    const unlockNextSection = () => {
        const currentIndex = formSections.indexOf(fillsection);
        const nextIndex = currentIndex + 1;

        if (nextIndex < formSections.length) {
            const nextSection = formSections[nextIndex];
            const updatedUnlocked = Array.from(
                new Set([...unlockedSections, nextSection])
            );
            setUnlockedSections(updatedUnlocked);
            localStorage.setItem("unlockedSections", JSON.stringify(updatedUnlocked));
            setFillsection(nextSection);
        }
    };

    //!IMAGE
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            Swal.fire({
                title: "Error!",
                text: "No file selected!",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!file.type.startsWith("image/")) {
            Swal.fire({
                title: "Invalid File!",
                text: "Please upload an image file (.png, .jpg, .jpeg).",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            Swal.fire({
                title: "File Too Large!",
                text: "Image must be 2MB or less.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!image) {
            Swal.fire({
                title: "Error!",
                text: "Image is missing! Please select an image.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!user.email) {
            Swal.fire({
                title: "Error!",
                text: "Email is missing! Please log in.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }
        try {
            const response = await axios.post("http://localhost:2025/upload", {
                email: user.email,
                image,
            });

            const updatedUser = response.data.student;

            // ✅ update state + localStorage
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setProfilepfp(false);

            Swal.fire({
                title: "Success!",
                text: "Image uploaded successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Upload error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to upload image.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }

    };
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        const fetchUser = async () => {
            const email = localStorage.getItem("userEmail");
            if (!email) return;

            try {
                const res = await axios.get("http://localhost:2025/getuser", {
                    params: { email },
                });

                if (res.data && res.data.student) {
                    setUser(res.data.student);
                    localStorage.setItem("user", JSON.stringify(res.data.student));
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);


    const handleDisabilityChange = (e) => {
        const value = e.target.value;
        if (value === "No") {
            setDisabilityDetails(" ");
            setDisabilityCategory("None");
        }

        setIsDisabled(value === "No");

        updateUserDetails({
            email: user.email,
            disabilityDetails: " ",
            disabilityCategory: "None",
        });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        if (name === "region") {
            setRegion(value);
            setProvince("");
            setCity("");
        } else if (name === "province") {
            setProvince(value);
            setCity("");
        } else if (name === "city") {
            setCity(value);
        } else if (name === "barangay") {
            setBarangay(value);
        }
    };

    const updateUserDetails = (updatedDetails) => {
        console.log("Sending update to backend:", updatedDetails);

        fetch("/api/updateUserDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDetails),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("User details updated:", data);
            })
            .catch((error) => {
                console.error("Error updating user details:", error);
            });
    };

    {
        /!PERSONAL/;
    }
    const [isDisabled, setIsDisabled] = useState(true);
    const [fillSection, setFillSection] = useState("personal");
    const [phone, setPhone] = useState(user?.phone || "");
    const [middlename, setMiddlename] = useState(user?.middlename || "");
    const [extension, setExtension] = useState(user?.extension || "");
    const [birthplace, setBirthplace] = useState(user?.birthplace || "");
    const [civil, setCivil] = useState(user?.civil || "");
    const [sex, setSex] = useState(user?.sex || "");
    const [orientation, setOrientation] = useState(user?.orientation || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [citizenship, setCitizenship] = useState(user?.citizenship || "");
    const [religion, setReligion] = useState(user?.religion || "");
    const [region, setRegion] = useState(user?.region || "");
    const [province, setProvince] = useState(user?.province || "");
    const [city, setCity] = useState(user?.city || "");
    const [barangay, setBarangay] = useState(user?.barangay || "");
    const [disability, setDisability] = useState(user?.disability || "");
    const [disabilityCategory, setDisabilityCategory] = useState(
        user?.disabilityCategory || ""
    );
    const [disabilityDetails, setDisabilityDetails] = useState(
        user?.disabilityDetails || ""
    );

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.email) return;

            try {
                const response = await axios.get(
                    `http://localhost:2025/get-profile?email=${user.email}`
                );
                const profileData = response.data;

                setPhone(profileData.phone || "");
                setMiddlename(profileData.middlename || "");
                setExtension(profileData.extension || "");
                setBirthplace(profileData.birthplace || "");
                setCivil(profileData.civil || "");
                setSex(profileData.sex || "");
                setOrientation(profileData.orientation || "");
                setGender(profileData.gender || "");
                setCitizenship(profileData.citizenship || "");
                setReligion(profileData.religion || "");
                setRegion(profileData.region || "");
                setProvince(profileData.province || "");
                setCity(profileData.city || "");
                setBarangay(profileData.barangay || "");
                setDisability(profileData.disability || "");
                setDisabilityCategory(profileData.disabilityCategory || "");
                setDisabilityDetails(profileData.disabilityDetails || "");
            } catch (error) {
                console.error("Error fetching user profile:", error);
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
                title: "Please finish the following fields",
                html: `<ul style="text-align: left;">${missingFields
                    .map((field) => `<li>${field}</li>`)
                    .join("")}</ul>`,
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!user || !user.email) {
            Swal.fire({
                title: "User Not Found!",
                text: "No user is currently logged in or user email is missing.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        const updatedFields = {};
        if (phone) updatedFields.phone = phone;
        if (middlename) updatedFields.middlename = middlename;
        if (extension) updatedFields.extension = extension;
        if (birthplace) updatedFields.birthplace = birthplace;
        if (civil) updatedFields.civil = civil;
        if (sex) updatedFields.sex = sex; 
        if (citizenship) updatedFields.citizenship = citizenship;
        if (religion) updatedFields.religion = religion;
        if (region) updatedFields.region = region;
        if (province) updatedFields.province = province;
        if (city) updatedFields.city = city;
        if (barangay) updatedFields.barangay = barangay;
        if (disability) updatedFields.disability = disability;
        if (disabilityCategory)
            updatedFields.disabilityCategory = disabilityCategory;
        updatedFields.disabilityDetails = disabilityDetails || "";

        try {
            const response = await axios.put("http://localhost:2025/update-profile", {
                email: user.email,
                ...updatedFields,
            });

            console.log("Response:", response.data);

            setFillsection("education");
        } catch (error) {
            console.error("Error while updating profile:", error);
        }
    };

    {
        /!EDUCATION/;
    }
    const [selectedSecCourse, setSelectedSecCourse] = useState(
        user?.selectedSecCourse
    );
    const [selectedCourse, setSelectedCourse] = useState(user?.selectedCourse);
    const [initialDept, setInitialDept] = useState(user?.initialDept);
    const [scholar, setScholar] = useState(user?.scholar || "");
    const [otherScholar, setOtherScholar] = useState(user?.otherScholar || "");
    const [elementary, setElementary] = useState(user?.elementary || "");
    const [elemYear, setElemYear] = useState(user?.elemYear || "");
    const [highschool, setHighschool] = useState(user?.highschool || "");
    const [highYear, setHighYear] = useState(user?.highYear || "");
    const [schoolType, setSchoolType] = useState(user?.schoolType || "");
    const [strand, setStrand] = useState(user?.strand || "");
    const [lrn, setLrn] = useState(user?.lrn || "");
    const [honor, setHonor] = useState(user?.honor || "");
    const [college, setCollege] = useState(user?.college || "");
    const [technical, setTechnical] = useState(user?.technical || "");
    const [certificate, setCertificate] = useState(user?.certificate || "");
    const [course, setCourse] = useState(user?.course || "");
    const [year, setYear] = useState(user?.year || "");
    const [program, setProgram] = useState(user?.program || "");
    const [yearCom, setYearCom] = useState(user?.yearCom || "");
    const [achivements, setAchivments] = useState(user?.achivements || "");

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.email) return;

            try {
                const response = await axios.get(
                    `http://localhost:2025/get-profile?email=${user.email}`
                );
                const profileData = response.data;

                setSelectedSecCourse(profileData.selectedSecCourse || "");
                setSelectedCourse(profileData.selectedCourse || "");
                setScholar(profileData.scholar || "");
                setOtherScholar(profileData.otherScholar || "");
                setElementary(profileData.elementary || "");
                setElemYear(profileData.elemYear || "");
                setElemYear(profileData.highYear || "");
                setHighYear(profileData.highschool || "");
                setSchoolType(profileData.schoolType || "");
                setStrand(profileData.strand || "");
                setLrn(profileData.lrn || "");
                setHonor(profileData.honor || "");
                setCollege(profileData.college || "");
                setCourse(profileData.course || "");
                setYear(profileData.year || "");
                setProgram(profileData.program || "");
                setTechnical(profileData.technical || "");
                setCertificate(profileData.certificate || "");
                setYearCom(profileData.yearCom || "");
                setAchivments(profileData.achivements || "");
            } catch (error) {
                console.error("Error fetching user Profile", error);
            }
        };
    }, [user.email]);

    const [educErrors, setEducErrors] = useState({
        selectedSecCourse: false,
        selectedCourse: false,
        scholar: false,
        elementary: false,
        elemYear: false,
        highYear: false,
        highschool: false,
        schoolType: false,
        strand: false,
        lrn: false,
    });

    const validateEducForm = () => {
        const errors = {};
        if (!selectedCourse) errors.selectedCourse = true;
        if (!selectedSecCourse) errors.selectedSecCourse = true;
        if (!scholar) errors.scholar = true;
        if (!elementary) errors.elementary = true;
        if (!elemYear) errors.elemYear = true;
        if (!highYear) errors.highYear = true;
        if (!highschool) errors.highschool = true;
        if (!schoolType) errors.schoolType = true;
        if (!strand) errors.strand = true;
        if (!lrn) errors.lrn = true;
        setEducErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateEduct = async (e) => {
        e.preventDefault();
        const isValid = validateEducForm();

        if (!isValid) {
            const missingFields = Object.keys(formErrors).filter(
                (field) => formErrors[field]
            );
            Swal.fire({
                title: "Please fill up the following fields:",
                html: `<ul style="text-align: left;">${missingFields
                    .map((field) => `<li>${field}</li>`)
                    .join("")}</ul>`,
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!user || !user.email) {
            Swal.fire({
                title: "User Not Found!",
                text: "No user is currently logged in or user email is missing.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (
            selectedCourse &&
            selectedSecCourse &&
            selectedCourse === selectedSecCourse
        ) {
            Swal.fire({
                title: "Duplicate Course!",
                text: "Primary and secondary course must be different.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        const updatedFields = {};
        if (selectedCourse) updatedFields.selectedCourse = selectedCourse;
        if (selectedSecCourse) updatedFields.selectedSecCourse = selectedSecCourse;
        if (initialDept) updatedFields.initialDept = initialDept;
        if (scholar) updatedFields.scholar = scholar;
        if (elementary) updatedFields.elementary = elementary;
        if (elemYear) updatedFields.elemYear = elemYear;
        if (highschool) updatedFields.highschool = highschool;
        if (highYear) updatedFields.highYear = highYear;
        if (schoolType) updatedFields.schoolType = schoolType;
        if (strand) updatedFields.strand = strand;
        if (lrn) updatedFields.lrn = lrn;
        if (honor) updatedFields.honor = honor;
        if (college) updatedFields.college = college;
        if (course) updatedFields.course = course;
        if (year) updatedFields.year = year;
        if (technical) updatedFields.technical = technical;
        if (program) updatedFields.program = program;
        if (yearCom) updatedFields.yearCom = yearCom;
        if (certificate) updatedFields.certificate = certificate;
        if (achivements) updatedFields.achivements = achivements;

        try {
            const response = await axios.put("http://localhost:2025/update-profile", {
                email: user.email,
                ...updatedFields,
            });

            console.log("Response:", response.data);

            setFillsection("family");
        } catch (error) {
            console.error("Error while updating profile:", error);
        }
    };

    {
        /!FAMILY/;
    }
    const [fatName, setFatName] = useState(user?.fatName || "");
    const [fatMidName, setFatMidName] = useState(user?.fatMidName || "");
    const [fatLastName, setFatLastName] = useState(user?.fatLastName || "");
    const [fatExt, setFatExt] = useState(user?.fatExt || "");
    const [motName, setMotName] = useState(user?.motName || "");
    const [motMidName, setMotMidName] = useState(user?.motMidName || "");
    const [motLastName, setMotLastName] = useState(user?.motLastName || "");
    const [broNum, setBroNum] = useState(user?.broNum || "");
    const [sisNum, setSisNum] = useState(user?.sisNum || "");
    const [guarName, setGuarName] = useState(user?.guarName || "");
    const [guarRelationship, setGuarRelationship] = useState(
        user?.guarRelationship || ""
    );
    const [guarAddress, setGuarAddress] = useState(user?.guarAddress || "");
    const [guarEmail, setGuarEmail] = useState(user?.guarEmail || "");
    const [guarTel, setGuarTel] = useState(user?.guarTel || "");

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.email) return;

            try {
                const response = await axios.get(
                    `http://localhost:2025/get-profile?email=${user.email}`
                );
                const profileData = response.data;

                setFatName(profileData.fatName || "");
                setFatMidName(profileData.fatMidName || "");
                setFatLastName(profileData.fatLastName || "");
                setFatExt(profileData.fatExt || "");
                setMotName(profileData.motName || "");
                setMotMidName(profileData.motMidName || "");
                setMotLastName(profileData.motLastName || "");
                setBroNum(profileData.broNum || "");
                setSisNum(profileData.sisNum || "");
                setGuarName(profileData.guarName || "");
                setGuarRelationship(profileData.guarRelationship || "");
                setGuarAddress(profileData.guarAddress || "");
                setGuarEmail(profileData.guarEmail || "");
                setGuarTel(profileData.guarTel || "");
            } catch (error) {
                console.error("Error fetching user Profile", error);
            }
        };
    }, [user.email]);

    const [familyErrors, setFamilyErrors] = useState({
        fatName: false,
        fatMidName: false,
        fatLastName: false,
        motName: false,
        motMidName: false,
        motLastName: false,
        broNum: false,
        sisNum: false,
        guarName: false,
        guarRelationship: false,
        guarAddress: false,
        guarTel: false,
    });

    const validateFamilyForm = () => {
        const errors = {};
        if (!fatName) errors.fatName = true;
        if (!fatMidName) errors.fatMidName = true;
        if (!fatLastName) errors.fatLastName = true;
        if (!motName) errors.motName = true;
        if (!motMidName) errors.motMidName = true;
        if (!motLastName) errors.motLastName = true;
        if (!broNum) errors.broNum = true;
        if (!sisNum) errors.sisNum = true;
        if (!guarName) errors.guarName = true;
        if (!guarRelationship) errors.guarRelationship = true;
        if (!guarAddress) errors.guarAddress = true;
        if (!guarTel) errors.guarTel = true;

        setFamilyErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateFamily = async (e) => {
        e.preventDefault();
        const isValid = validateFamilyForm();

        if (!isValid) {
            const missingFields = Object.keys(formErrors).filter(
                (field) => formErrors[field]
            );
            Swal.fire({
                title: "Please fill up the following fields:",
                html: `<ul style="text-align: left;">${missingFields
                    .map((field) => `<li>${field}</li>`)
                    .join("")}</ul>`,
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }
        if (!user || !user.email) {
            Swal.fire({
                title: "User Not Found!",
                text: "No user is currently logged in or user email is missing.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }
        const updatedFields = {};
        if (fatName) updatedFields.fatName = fatName;
        if (fatMidName) updatedFields.fatMidName = fatMidName;
        if (fatLastName) updatedFields.fatLastName = fatLastName;
        if (motName) updatedFields.motName = motName;
        if (motMidName) updatedFields.motMidName = motMidName;
        if (motLastName) updatedFields.motLastName = motLastName;
        if (guarName) updatedFields.guarName = guarName;
        if (guarRelationship) updatedFields.guarRelationship = guarRelationship;
        if (guarAddress) updatedFields.guarAddress = guarAddress;
        updatedFields.guarEmail = guarEmail || "";
        if (guarTel) updatedFields.guarTel = guarTel;
        if (broNum) updatedFields.broNum = broNum;
        if (sisNum) updatedFields.sisNum = sisNum;
        if (fatExt) updatedFields.fatExt = fatExt;

        try {
            const response = await axios.put("http://localhost:2025/update-profile", {
                email: user.email,
                ...updatedFields,
            });

            console.log("Response:", response.data);

            setFillsection("uploads");
        } catch (error) {
            console.error("Error while updating profile:", error);
        }
    };


    const handleFinalize = () => {
        if (!selectedCourse) {
            Swal.fire({
                icon: "error",
                title: "Missing First Choice",
                text: "Please select your first choice course before finalizing.",
            });
            return;
        }

        if (!selectedSecCourse) {
            Swal.fire({
                icon: "error",
                title: "Missing Second Choice",
                text: "Please select your second choice course before finalizing.",
            });
            return;
        }

        if (!user.image) {
            Swal.fire({
                icon: "error",
                title: "Missing Profile Image",
                text: "Please upload your profile image before finalizing.",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Enlistment Finalized",
            text: "Your enlistment has been successfully finalized. Wait for further instructions.",
        });
    };



    return (
        <div>
            <div className="premaintab">
                <div
                    className="prenavtab"
                    draggable="false"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                >
                    <h2>Profile</h2>
                    <p>View / Edit personal information</p>
                </div>
                <img
                    src="public/img/knshdlogo.png"
                    alt="Illustration"
                    draggable="false"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                />
            </div>
            <div className="preprofile">
                <div className="preprofiledetails">
                    <div className="profile-image">
                        <img
                            onClick={() => setProfilepfp(true)}
                            src={user.image || "/img/prof.jpg"}
                            alt="Profile"
                        />
                        <p className="change-text" style={{ fontSize: "10px" }}>
                            Click/tap to change image
                        </p>
                    </div>
                    {profilepfp && (
                        <div className="preforgot">
                            <div className="forgotbg">
                                <h2 style={{ color: "#303030" }}>Upload your 2x2 Picture</h2>
                                <p style={{ color: "red", fontSize: "12px" }}>
                                    Upload your 2x2 picture with WHITE background. For seamless
                                    uploading, it is recommended that the file size should be 2MB
                                    (20800KB) or less. Valid formats are .png, .jpg/jpeg.
                                </p>
                                <hr />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                        alignItems: "center",
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {image && (
                                        <div
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                border: "2px solid #ddd",
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt="Preview"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="button-container" style={{ marginTop: "20px" }}>
                                    <button
                                        style={{ border: "none" }}
                                        onClick={() => setProfilepfp(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        style={{
                                            border: "1px solid #006666",
                                            background: "#006666",
                                            color: "white",
                                            padding: "10px 20px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="status-table" style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: "13px", width: "20%" }}>
                                    <strong>Registration Number</strong>
                                </td>
                                <td style={{ fontSize: "13px" }}>{user?.register || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}>
                                    <strong>Fullname</strong>
                                </td>
                                <td style={{ fontSize: "13px", textTransform: "uppercase" }}>
                                    {" "}
                                    {user?.lastname || ""}, {user?.firstname || ""},{" "}
                                    {user?.middlename || ""} {user?.extension || ""}{" "}
                                    {course.initialDept || ""}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}>
                                    <strong>College/Program</strong>
                                </td>
                                <td style={{ fontSize: "13px" }}>
                                    {user?.selectedCourse || ""}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}>
                                    <strong>Email Address</strong>
                                </td>
                                <td style={{ fontSize: "13px" }}>{user?.email || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: "13px" }}>
                                    <strong>Contact Number</strong>
                                </td>
                                <td style={{ fontSize: "13px" }}>+63 {user?.phone || ""}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="fulldetails">
                <div
                    className={`datafill ${fillsection === "data" ? "active" : ""}`}
                    onClick={() => setFillsection("data")}
                >
                    <div className={`fillhead ${fillsection === "data" ? "active" : ""}`}>
                        <span className="step-icon">
                            {fillsection === "data" ? (
                                <i className="fa-solid fa-lock"></i>
                            ) : (
                                "1"
                            )}
                        </span>
                        <h2 style={{ fontSize: "12px" }}>DATA PRIVACY STATEMENT</h2>
                    </div>

                    {fillsection === "data" && (
                        <>
                            <Data />
                            <div
                                className="unibtn"
                                style={{
                                    marginTop: "9px",
                                    marginBottom: "20px",
                                    marginRight: "20px",
                                }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFillsection("personal");
                                    }}
                                >
                                    <i className="fa-solid fa-forward-step"></i> Accept and
                                    Continue
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Personal Information Section */}
                <div
                    className={`datafill ${fillsection === "personal" ? "active" : ""}`}
                    onClick={() => setFillsection("personal")}
                >
                    <div
                        className={`fillhead ${fillsection === "personal" ? "active" : ""}`}
                    >
                        <span className="step-icon">
                            {fillsection === "personal" ? (
                                <i className="fa-solid fa-pen"></i>
                            ) : (
                                "2"
                            )}
                        </span>
                        <h2 style={{ fontSize: "12px" }}>PERSONAL INFORMATION</h2>
                    </div>

                    {fillsection === "personal" && (
                        <>
                            <div
                                className={`persofom-container ${fillSection === "personal" ? "show" : ""
                                    }`}
                            >
                                <div className="persofom-grid">
                                    <div
                                        className="uploads"
                                        style={{ marginBottom: "1rem", width: "100%" }}
                                    >
                                        <div>
                                            <h4 style={{ color: "#333" }}>
                                                Complete your personal information!{" "}
                                            </h4>
                                            <p
                                                style={{
                                                    marginBottom: "20px",
                                                    fontSize: "12px",
                                                    fontStyle: "italic",
                                                    marginTop: "10px",
                                                    color: "orange",
                                                }}
                                            >
                                                This helps us keep your records accurate and up-to-date!
                                                <hr style={{ background: "grey" }} />
                                            </p>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: "3rem",
                                                    width: "100%",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <div className="persofom-group" style={{}}>
                                                    <label>Personal Email Address*</label>
                                                    <div
                                                        className="persofom-input"
                                                        style={{
                                                            color: "lightgrey",
                                                            background: "white",
                                                            pointerEvents: "none",
                                                            userSelect: "none",
                                                        }}
                                                    >
                                                        {user?.email || ""}
                                                    </div>
                                                </div>
                                                <div className="persofom-group" style={{}}>
                                                    <label>Mobile Number*</label>
                                                    <input
                                                        type="text"
                                                        className="persofom-input"
                                                        value={user?.phone || extension || ""}
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
                                                        <div
                                                            className="persofom-input"
                                                            style={{ background: "white" }}
                                                        >
                                                            {user?.firstname || ""}
                                                        </div>
                                                        <i
                                                            className="lock-icon fa fa-lock"
                                                            title="This field is locked"
                                                        ></i>
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
                                                        <div
                                                            className="persofom-input"
                                                            style={{ background: "white" }}
                                                        >
                                                            {user?.lastname || ""}
                                                        </div>
                                                        <i
                                                            className="lock-icon fa fa-lock"
                                                            title="This field is locked"
                                                        ></i>
                                                    </div>
                                                </div>

                                                {/* Extension Name */}
                                                <div className="persofom-group ext">
                                                    <label>Ext Name</label>
                                                    <select
                                                        className="persofom-input"
                                                        value={extension || user?.extension || ""}
                                                        onChange={(e) => {
                                                            const selectedValue = e.target.value;
                                                            setExtension(selectedValue);
                                                            if (selectedValue === "") {
                                                                setExtension("");
                                                            }
                                                        }}
                                                    >
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

                                    <form
                                        onSubmit={handleUpdateProfile}
                                        className="persofom-grid"
                                    >
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "10%", marginRight: "15px" }}
                                        >
                                            <label>Birthdate*</label>
                                            <div className="persofom-input-container">
                                                <div className="persofom-input">
                                                    {user?.birthdate || ""}
                                                </div>
                                                <i
                                                    className="lock-icon fa fa-lock"
                                                    title="This field is locked"
                                                ></i>
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "15    %", marginRight: "12px" }}
                                        >
                                            <label>Birth place*</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    className={`persofom-input ${formErrors.birthplace ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    value={birthplace}
                                                    onChange={(e) => setBirthplace(e.target.value)}
                                                    style={{
                                                        borderColor: formErrors.birthplace ? "red" : "",
                                                        fontSize: "15px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "10%" }}
                                        >
                                            <label>Civil Status</label>
                                            <select
                                                className={`persofom-input ${formErrors.civil ? "error" : ""
                                                    }`}
                                                value={civil || user?.civil || ""}
                                                onChange={(e) => setCivil(e.target.value)}
                                            >
                                                <option value="" disabled hidden>
                                                    Select One
                                                </option>
                                                <option>Single</option>
                                                <option>Married</option>
                                                <option>Widowed</option>
                                                <option>Separated</option>
                                            </select>
                                        </div>

                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "10%" }}
                                        >
                                            <label>Gender</label>
                                            <select
                                                className={`persofom-input ${formErrors.sex ? "error" : ""
                                                    }`}
                                                value={sex || user?.sex || ""}
                                                onChange={(e) => setSex(e.target.value)}
                                            >
                                                <option value="" disabled hidden>
                                                    Select One
                                                </option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "14%" }}
                                        >
                                            <label>Citizenship*</label>
                                            <select
                                                className={`persofom-input ${formErrors.citizenship ? "error" : ""
                                                    }`}
                                                value={citizenship || user?.citizenship || ""}
                                                onChange={(e) => setCitizenship(e.target.value)}
                                            >
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
                                            style={{ width: "15%", marginRight: "12px" }}
                                        >
                                            <label>Religion *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    className={`persofom-input ${formErrors.religion ? "error" : ""
                                                        }`}
                                                    value={religion}
                                                    onChange={(e) => setReligion(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="smalltitle">
                                            <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
                                            <h2 style={{ fontSize: "12px", color: "green" }}>
                                                Current Address
                                            </h2>
                                        </div>

                                        {/* Region */}
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "23.4%", marginTop: "-15px" }}
                                        >
                                            <label>Region*</label>
                                            <select
                                                name="region"
                                                className={`persofom-input ${formErrors.region ? "error" : ""
                                                    }`}
                                                value={region}
                                                onChange={handleAddressChange}
                                            >
                                                <option value="Region III">
                                                    Region III (CENTRAL LUZON)
                                                </option>
                                            </select>
                                        </div>

                                        {/* Province */}
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "23.4%", marginTop: "-15px" }}
                                        >
                                            <label>Province*</label>
                                            <select
                                                name="province"
                                                className={`persofom-input ${formErrors.province ? "error" : ""
                                                    }`}
                                                value={province}
                                                onChange={handleAddressChange}
                                            >
                                                <option value="" disabled>
                                                    Select One
                                                </option>
                                                <option value="Zambales">ZAMBALES</option>
                                            </select>
                                        </div>
                                        {province === "Zambales" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>City/Municipality*</label>
                                                <select
                                                    name="city"
                                                    className={`persofom-input ${formErrors.city ? "error" : ""
                                                        }`}
                                                    value={city}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="Botolan">BOTOLAN</option>
                                                    <option value="Cabangan">CABANGAN</option>
                                                    <option value="Candelaria">CANDELARIA</option>
                                                    <option value="Castillejos">CASTILLEJOS</option>
                                                    <option value="Iba">IBA</option>
                                                    <option value="Masinloc">MASINLOC</option>
                                                    <option value="Olongapo">OLONGAPO CITY</option>
                                                    <option value="Palauig">PALAUIG</option>
                                                    <option value="San-Antonio">SAN ANTONIO</option>
                                                    <option value="San-Narciso">SAN NARCISO</option>
                                                    <option value="San-Felipe">SAN FELIPE</option>
                                                    <option value="San-Marcelino">SAN MARCELINO</option>
                                                    <option value="Santa-Cruz">SANTA CRUZ</option>
                                                    <option value="Subic">SUBIC</option>
                                                </select>
                                            </div>
                                        )}
                                        {/* Barangay */}
                                        {city === "Botolan" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="BANCAL">BANCAL</option>
                                                    <option value="BANGAN">BANGAN</option>
                                                    <option value="BATONLAPOC">BATONLAPOC</option>
                                                    <option value="BELBEL">BELBEL</option>
                                                    <option value="BENEG">BENEG</option>
                                                    <option value="BINUCLUTAN">BINUCLUTAN</option>
                                                    <option value="BURGOS">BURGOS</option>
                                                    <option value="CABATUAN">CABATUAN</option>
                                                    <option value="CAPAYAWAN">CAPAYAWAN</option>
                                                    <option value="CARAEL">CARAEL</option>
                                                    <option value="DANACBUNGA">DANACBUNGA</option>
                                                    <option value="MAGUISGUIS">MAGUISGUIS</option>
                                                    <option value="MALOMBOY">MALOMBOY</option>
                                                    <option value="MAMBOG">MAMBOG</option>
                                                    <option value="MORAZA">MORAZA</option>
                                                    <option value="NACOLCOL">NACOLCOL</option>
                                                    <option value="OWAOGNIBLOC">OWAOG-NIBLOC</option>
                                                    <option value="PACO">PACO</option>
                                                    <option value="PALIS">PALIS</option>
                                                    <option value="PANAN">PANAN</option>
                                                    <option value="PAREL">PAREL</option>
                                                    <option value="PAUDPOD">PAUDPOD</option>
                                                    <option value="POONBATO">POONBATO</option>
                                                    <option value="PORAC">PORAC</option>
                                                    <option value="SANISIDRO">SAN ISIDRO</option>
                                                    <option value="SANJUAN">SAN JUAN</option>
                                                    <option value="SANMIGUEL">SAN MIGUEL</option>
                                                    <option value="SANTIAGO">SANTIAGO</option>
                                                    <option value="TAMPO">TAMPO</option>
                                                    <option value="TAUGTOG">TAUGTOG</option>
                                                    <option value="VILLAR">VILLAR</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Candelaria" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="BABANGCAL">BABANGCAL</option>
                                                    <option value="BINABALIAN">BINABALIAN</option>
                                                    <option value="CATOL">CATOL</option>
                                                    <option value="DAMPAY">DAMPAY</option>
                                                    <option value="LAUIS">LAUIS</option>
                                                    <option value="LIBERTADOR">LIBERTADOR</option>
                                                    <option value="NAGBUNGA">MALABON</option>
                                                    <option value="MALIMANGA">MALIMANGA</option>
                                                    <option value="PAMIBIAN">PAMIBIAN</option>
                                                    <option value="PANAYONAN">PANAYONAN</option>
                                                    <option value="PINAGREALAN">PINAGREALAN</option>
                                                    <option value="POBLACION">POBLACION</option>
                                                    <option value="SINABACAN">SINABACAN</option>
                                                    <option value="SANTAMARIA">SANTAMARIA</option>
                                                    <option value="UACON">UACON</option>
                                                    <option value="YAMOT">YAMOT</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Castillejos" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="BALAYBAY">BALAYBAY</option>
                                                    <option value="BUENAVISTA">BUENAVISTA</option>
                                                    <option value="DEL PILAR">DEL PILAR</option>
                                                    <option value="LOOC">LOOC</option>
                                                    <option value="MAGSAYSAY">MAGSAYSAY</option>
                                                    <option value="NAGBAYAN">NAGBAYAN</option>
                                                    <option value="NAGBUNGA">NAGBUNGA</option>
                                                    <option value="SANAGUSTIN">SAN AGUSTIN</option>
                                                    <option value="SANJOSE">SAN JOSE</option>
                                                    <option value="SANJUAN">SAN JUAN</option>
                                                    <option value="SANNICOLAS">SAN NICOLAS</option>
                                                    <option value="SANPABLO">SAN PABLO</option>
                                                    <option value="SANROQUE">SAN ROQUE</option>
                                                    <option value="SANTAMARIA">SANTA MARIA</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Iba" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="AMUNGAN">AMUNGAN</option>
                                                    <option value="BANGATALINGA">BANGATALINGA</option>
                                                    <option value="DIRITABALOGUEN">DIRITA BALOGUEN</option>
                                                    <option value="LIPAYDINGINPANIBUATAN">LIPAY DINGIN PANIBUATAN</option>
                                                    <option value="PALANGINAN">PALANGINAN</option>
                                                    <option value="SANAGUSTIN">SAN AGUSTIN</option>
                                                    <option value="SANTABARBARA">SANTA BARBARA</option>
                                                    <option value="SANTOROSARIO">SANTO ROSARIO</option>
                                                    <option value="LIBABA">ZONE 1</option>
                                                    <option value="AYPA">ZONE 2</option>
                                                    <option value="BOTLAY">ZONE 3</option>
                                                    <option value="SAGAPAN">ZONE 4</option>
                                                    <option value="BANO">ZONE 5</option>
                                                    <option value="BAYTAN">ZONE 6</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Masinloc" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="BALOGANON">BALOGANON</option>
                                                    <option value="BAMBAN">BAMBAN</option>
                                                    <option value="BANI">BANI</option>
                                                    <option value="INHOBOL">INHOBOL</option>
                                                    <option value="NORTHPOBLACION">NORTH POBLACION</option>
                                                    <option value="SANLORENZO">SAN LORENZO</option>
                                                    <option value="SANSALVADOR">SAN SALVADOR</option>
                                                    <option value="SANTARITA">SANTA RITA</option>
                                                    <option value="SANTOROSARIO">SANTO ROSARIO</option>
                                                    <option value="SOUTHPOBLACION">SOUTH POBLACION</option>
                                                    <option value="TAFTAL">TAFTAL</option>
                                                    <option value="TAPUAC">TAPUAC</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Palauig" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="ALWA">ALWA</option>
                                                    <option value="BATO">BATO</option>
                                                    <option value="BULAWENCAUYAN">BULAWEN</option>
                                                    <option value="CAUYAN">CAUYAN</option>
                                                    <option value="EASTPOBLACION">EAST POBLACION</option>
                                                    <option value="GARRETA">GARRETA</option>
                                                    <option value="LIBABA">LIBABA</option>
                                                    <option value="LIOZON">LIOZON</option>
                                                    <option value="LIPAY">LIPAY</option>
                                                    <option value="LOCLOC">LOCLOC</option>
                                                    <option value="MACARANG">MACARANG</option>
                                                    <option value="MAGALAWA">MAGALAWA</option>
                                                    <option value="PANGOLINGAN">PANGOLINGAN</option>
                                                    <option value="SALAZA">SALAZA</option>
                                                    <option value="SANJUAN">SAN JUAN</option>
                                                    <option value="SANTONINO">SANTO NINO</option>
                                                    <option value="TITION">TITION</option>
                                                    <option value="WESTPOBLACION">WEST POBLACION</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Cabangan" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="ANONANG">
                                                        ANONANG
                                                    </option>
                                                    <option value="APOAPO">APO-APO</option>
                                                    <option value="AREW">
                                                        AREW
                                                    </option>
                                                    <option value="BANUANBAYO">
                                                        BANUANBAYO
                                                    </option>
                                                    <option value="CADMANGRESERVA">CANDMANG-RESERVE</option>
                                                    <option value="CAMIING">CAMIING</option>
                                                    <option value="CASABAAN">CASABAAN</option>
                                                    <option value="DELCARMEN">DEL CARMEN</option>
                                                    <option value="DOLORES">DOLORES</option>
                                                    <option value="FELMIDADIAZ">
                                                        FELMIDA DIAZ
                                                    </option>
                                                    <option value="LAOAG">LAOAG</option>
                                                    <option value="LOMBOY">LOMBOY</option>
                                                    <option value="LONGOS">LONGOS</option>
                                                    <option value="MABANGLIT">MABANGLIT</option>
                                                    <option value="NEWSANJUAN">NEW SAN JUAN</option>
                                                    <option value="SANANTONIO">SAN ANTONIO</option>
                                                    <option value="SANISIDRO">SAN ISIDRO</option>
                                                    <option value="SANJUAN">SAN JUAN</option>
                                                    <option value="SANRAFAEL">SAN RAFAEL</option>
                                                    <option value="STARITA">STA RITA</option>
                                                    <option value="SANTONINO">STO NINO</option>
                                                    <option value="TONDO">TONDO</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Subic" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="ANINGWAY-SACATIHAN">
                                                        ANINGWAY SACATIHAN
                                                    </option>
                                                    <option value="ASINAN-PROPER">ASINAN PROPER</option>
                                                    <option value="ASINAN-PUBLACION">
                                                        ASINAN PUBLACION
                                                    </option>
                                                    <option value="BARACA-CAMACHILE">
                                                        BARACA CAMACHILE
                                                    </option>
                                                    <option value="CALAPACUAN">CALAPACUAN</option>
                                                    <option value="CALAPANDAYAN">CALAPANDAYAN</option>
                                                    <option value="ILWAS">ILWAS</option>
                                                    <option value="MANGALIT">MANGALIT</option>
                                                    <option value="MATAIN">MATAIN</option>
                                                    <option value="NAGBANGON">NAGBANGON</option>
                                                    <option value="NATIONALHIGHWAY">
                                                        NATIONAL HIGHWAY
                                                    </option>
                                                    <option value="PAGASA">PAG ASA</option>
                                                    <option value="SANISIDRO">SAN ISIDRO</option>
                                                    <option value="SANRAFAEL">SAN RAFAEL</option>
                                                    <option value="SANTOTOMAS">SANTO TOMAS</option>
                                                    <option value="WAWANDUE">WAWANDUE</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Olongapo" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="ASINAN">
                                                        ASINAN
                                                    </option>
                                                    <option value="BANICAIN">BANICAIN</option>
                                                    <option value="BARRETTO">
                                                        BARRETTO
                                                    </option>
                                                    <option value="EASTBAJACBAJAC">
                                                        EAST BAJAC-BAJAC
                                                    </option>
                                                    <option value="EASTTAPINAC">EAST TAPINAC</option>
                                                    <option value="GORDONHEIGHTS">GORDON HEIGHTS</option>
                                                    <option value="KALAKLAN">KALAKLAN</option>
                                                    <option value="KALAKLAN">KALAKLAN</option>
                                                    <option value="MABAYUAN">MABAYUAN</option>
                                                    <option value="NEWCABALAN">
                                                        NEW CABALAN
                                                    </option>
                                                    <option value="NEWILALIM">NEW ILALIM</option>
                                                    <option value="NEWKABABAE">NEW KABABAE</option>
                                                    <option value="NEWKALALAKE">NEW KALALAKE</option>
                                                    <option value="OLDCABALAN">OLD CABALAN</option>
                                                    <option value="STARITA">STA RITA</option>
                                                    <option value="WESTBAJACBAJAC">WEST BAJAC-BAJAC</option>
                                                    <option value="WESTTAPINAC">WEST TAPINAC</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "San-Antonio" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="ANGELES">ANGELES</option>
                                                    <option value="ANTIPOLO">ANTIPOLO</option>
                                                    <option value="BURGOS">BURGOS</option>
                                                    <option value="EASTDIRITA">EAST DIRITA</option>
                                                    <option value="LUNA">LUNA</option>
                                                    <option value="PUNDAQUIT">PUNDAQUIT</option>
                                                    <option value="RIZAL">RIZAL</option>
                                                    <option value="SANESTEBAN">SAN ESTEBAN</option>
                                                    <option value="SANGREGORIO">SAN GREGORIO</option>
                                                    <option value="SANJUAN">SAN JUAN</option>
                                                    <option value="SANMIGUEL">SAN MIGUEL</option>
                                                    <option value="SANNICOLAS">SAN NICOLAS</option>
                                                    <option value="SANTIAGO">SANTIAGO</option>
                                                    <option value="WESTDIRITA">WEST DIRITA</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "San-Narciso" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="ALUSIIS">ALUSIIS</option>
                                                    <option value="BEDDENG">BEDDENG</option>
                                                    <option value="CANDELARIA">CANDELARIA</option>
                                                    <option value="DALLIPAWEN">DALLIPAWEN</option>
                                                    <option value="GRULLO">GRULLO</option>
                                                    <option value="LAPAZ">LA PAZ</option>
                                                    <option value="LIBERTAD">LIBERTAD</option>
                                                    <option value="NAMATACAN">NAMATACAN</option>
                                                    <option value="OMAYA">OMAYA</option>
                                                    <option value="PAITE">PAITE</option>
                                                    <option value="PATROCINIO">PATROCINIO</option>
                                                    <option value="SANJOSE">SAN JOSE</option>
                                                    <option value="SANJUAN">SAN JUAN</option>
                                                    <option value="SANPASCUAL">SAN PASCUAL</option>
                                                    <option value="SANRAFAEL">SAN RAFAEL</option>
                                                    <option value="SIMINUBLAN">SIMINUBLAN</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "San-Felipe" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="AMAGNA">AMAGNA</option>
                                                    <option value="APOSTOL">APOSTOL</option>
                                                    <option value="BALINCAGUING">BALINCAGUING</option>
                                                    <option value="FARANAL">FARANAL</option>
                                                    <option value="FERIA">FERIA</option>
                                                    <option value="MALOMA">MALOMA</option>
                                                    <option value="MANGLICMOT">MANGLICMOT</option>
                                                    <option value="ROSETE">ROSETE</option>
                                                    <option value="SANRAFAEL">SAN RAFAEL</option>
                                                    <option value="SANTONINO">SAN TONINO</option>
                                                    <option value="SINDOL">SINDOL</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "San-Marcelino" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="AGLAO">AGLAO</option>
                                                    <option value="BUHAWEN">BUHAWEN</option>
                                                    <option value="BUHAWEN">BUHAWEN</option>
                                                    <option value="BURGOS">BURGOS</option>
                                                    <option value="CENTRAL">CENTRAL</option>
                                                    <option value="CONSUELONORTE">CONSUELO NORTE</option>
                                                    <option value="CONSUELOSUR">CONSUELO SUR</option>
                                                    <option value="LAPAZ">LA PAZ</option>
                                                    <option value="LAOAG">LAOAG</option>
                                                    <option value="LINASIN">LINASIN</option>
                                                    <option value="LINUSUNGAN">LINUSUNGAN</option>
                                                    <option value="LUCERO">LUCERO</option>
                                                    <option value="NAGBUNGA">NAGBUNGA</option>
                                                    <option value="RABANES">RABANES</option>
                                                    <option value="RIZAL">RIZAL</option>
                                                    <option value="SANGUILLERMO">SAN GUILLERMO</option>
                                                    <option value="SANISIDRO">SAN ISIDRO</option>
                                                    <option value="SANRAFAEL">SAN RAFAEL</option>
                                                    <option value="SANTAFE">SANTA FE</option>
                                                </select>
                                            </div>
                                        )}
                                        {city === "Santa-Cruz" && (
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "23.4%", marginTop: "-15px" }}
                                            >
                                                <label>Barangay *</label>
                                                <select
                                                    name="barangay"
                                                    className={`persofom-input ${formErrors.barangay ? "error" : ""
                                                        }`}
                                                    value={barangay}
                                                    onChange={handleAddressChange}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    <option value="BABUYAN">BABUYAN</option>
                                                    <option value="BANGCOL">BANGCOL</option>
                                                    <option value="BAYTO">BAYTO</option>
                                                    <option value="BIAY">BIAY</option>
                                                    <option value="BOLITOC">BOLITOC</option>
                                                    <option value="BULAWON">BULAWON</option>
                                                    <option value="CANAYANAN">CANAYANAN</option>
                                                    <option value="GAMA">GAMA</option>
                                                    <option value="GUINABON">GUINABON</option>
                                                    <option value="GUISGUIS">GUISGUIS</option>
                                                    <option value="LIPAY">LIPAY</option>
                                                    <option value="LOMBOY">LOMBOY</option>
                                                    <option value="LUCAPONNORTH">LUCAPON NORTH</option>
                                                    <option value="LUCAPONSOUTH">LUCAPON SOUTH</option>
                                                    <option value="MALABAGO">MALABAGO</option>
                                                    <option value="NAULO">NAULO</option>
                                                    <option value="PAGATPAT">PAGATPAT</option>
                                                    <option value="POBLACIONNORTH">POBLACION NORTH</option>
                                                    <option value="POBLACIONSOUTH">POBLACION SOUTH</option>
                                                    <option value="SABANG">SABANG</option>
                                                    <option value="SANFERNANDO">SAN FERNANDO</option>
                                                    <option value="TABALONG">TABALONG</option>
                                                    <option value="TUTUBONORTH">TUTUBO NORTH</option>
                                                    <option value="TUTUBOSOUTH">TUTUBO SOUTH</option>
                                                </select>
                                            </div>
                                        )}
                                    </form>
                                </div>

                                <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
                                <div className="smalltitle">
                                    <h2 style={{ fontSize: "12px", color: "green" }}>
                                        Personal Disability Information
                                    </h2>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "15px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "20px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "25%" }}
                                        >
                                            <label style={{ fontSize: "11px", color: "orange" }}>
                                                Disability person?
                                            </label>
                                            <select
                                                className="persofom-input"
                                                onChange={(e) => handleDisabilityChange(e)}
                                            >
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                            </select>
                                        </div>
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "85%" }}
                                        >
                                            <label style={{ fontSize: "11px" }}>
                                                Disability Category
                                            </label>
                                            <select
                                                className="persofom-input"
                                                disabled={isDisabled}
                                                value={
                                                    disabilityCategory || user?.disabilityCategory || ""
                                                }
                                                onChange={(e) => setDisabilityCategory(e.target.value)}
                                            >
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
                                    <div
                                        className="persofom-group name"
                                        style={{ width: "100%" }}
                                    >
                                        <label style={{ fontSize: "11px" }}>
                                            Disability Details*
                                        </label>
                                        <div className="persofom-input-container">
                                            <textarea
                                                className="persofom-input"
                                                value={disabilityDetails || ""}
                                                onChange={(e) => setDisabilityDetails(e.target.value)}
                                                placeholder="Describe your disability here..."
                                                disabled={isDisabled}
                                                style={{
                                                    width: "100%",
                                                    minHeight: "50px",
                                                    resize: "vertical",
                                                    fontSize: "11px",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="unibtn" style={{ marginTop: "20px" }}>
                                    <button type="submit" onClick={handleUpdateProfile}>
                                        <i className="fa-solid fa-download"></i> Save and Proceed to
                                        Next Step
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {/* Education Information Section */}
                <div
                    className={`datafill ${fillsection === "education" ? "active" : ""} ${!unlockedSections.includes("education") ? "disabled" : ""
                        }`}
                    onClick={() => goToSection("education")}
                >
                    <div
                        className={`fillhead ${fillsection === "education" ? "active" : ""
                            }`}
                    >
                        <span className="step-icon">
                            {fillsection === "education" ? (
                                <i className="fa-solid fa-pen"></i>
                            ) : (
                                "3"
                            )}
                        </span>
                        <h2 style={{ fontSize: "12px" }}>EDUCATION</h2>
                    </div>

                    {fillsection === "education" && (
                        <>
                            <div className="preprofile">
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                    }}
                                >
                                    <div className="uploads" style={{ marginBottom: "1rem" }}>
                                        <h4 style={{ color: "#333" }}>
                                            Select a Program to Enroll
                                        </h4>
                                        <p
                                            style={{
                                                marginBottom: "20px",
                                                fontSize: "12px",
                                                fontStyle: "italic",
                                                marginTop: "10px",
                                                color: "orange",
                                            }}
                                        >
                                            Please choose wisely. Once you have selected a program you
                                            will not be able to change it once you have confirmed your
                                            enlistment
                                            <hr style={{ background: "grey" }} />
                                        </p>
                                        <div style={{ display: "flex", gap: "1rem" }}>
                                            {/* First Choice */}
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "50%" }}
                                            >
                                                <label>First Choice *</label>
                                                <select
                                                    className="persofom-input"
                                                    value={selectedCourse || user?.selectedCourse || ""}
                                                    onChange={(e) => {
                                                        const selectedCourseTitle = e.target.value;
                                                        setSelectedCourse(selectedCourseTitle);
                                                        const selectedCourseObj = courses.find(
                                                            (course) => course.title === selectedCourseTitle
                                                        );
                                                        setInitialDept(
                                                            selectedCourseObj?.initialDept ||
                                                            "No department available"
                                                        );
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    {courses.map((course) => (
                                                        <option key={course._id} value={course.title}>
                                                            {course.title} -{" "}
                                                            {course.initialDept || "No department available"}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Second Choice */}
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "50%" }}
                                            >
                                                <label>Second Choice *</label>
                                                <select
                                                    className="persofom-input"
                                                    value={
                                                        selectedSecCourse || user?.selectedSecCourse || ""
                                                    }
                                                    onChange={(e) => {
                                                        const selectedSecCourseTitle = e.target.value;
                                                        setSelectedSecCourse(selectedSecCourseTitle); // Set the selected second choice course
                                                        const selectedSecCourseObj = courses.find(
                                                            (course) =>
                                                                course.title === selectedSecCourseTitle
                                                        );
                                                        setInitialSecDept(
                                                            selectedSecCourseObj?.initialDept ||
                                                            "No department available"
                                                        );
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        Select One
                                                    </option>
                                                    {courses.map((course) => (
                                                        <option key={course._id} value={course.title}>
                                                            {course.title} -{" "}
                                                            {course.initialDept || "No department available"}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "1rem",
                                            width: "100%",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "30%" }}
                                        >
                                            <label>Scholarship Type *</label>
                                            <select
                                                value={scholar || user?.scholar || ""}
                                                onChange={(e) => setScholar(e.target.value)}
                                                className={`persofom-input ${educErrors.scholar ? "error" : ""
                                                    }`}
                                            >
                                                <option value="" disabled selected>
                                                    Select One
                                                </option>
                                                <option value="FGE">Free Goverment Education</option>
                                                <option value="SPS">
                                                    Non - Scholar Paying Student
                                                </option>
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "30%" }}
                                        >
                                            <label>Other Scholarship *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    className="persofom-input"
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                    value={scholar}
                                                    onChange={(e) => setOtherScholarship(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "2rem",
                                            width: "100%",
                                            margin: "20px",
                                        }}
                                    >
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "77%" }}
                                        >
                                            <label>Elementary School *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    className={`persofom-input ${educErrors.elementary ? "error" : ""
                                                        }`}
                                                    value={elementary || ""}
                                                    onChange={(e) => setElementary(e.target.value)}
                                                    placeholder="Elementary School Graduated"
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "13%" }}
                                        >
                                            <label>Year Graduated *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    className={`persofom-input ${educErrors.elemYear ? "error" : ""
                                                        }`}
                                                    placeholder="Ex. 2015"
                                                    value={elemYear || ""}
                                                    onChange={(e) => setElemYear(e.target.value)}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "2rem",
                                            width: "100%",
                                            margin: "20px",
                                            marginTop: "-10px",
                                        }}
                                    >
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "77%" }}
                                        >
                                            <label>SHS/HS Graduated *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    onChange={(e) => setHighschool(e.target.value)}
                                                    placeholder="School where you graduated SHS / HS"
                                                    className={`persofom-input ${educErrors.highschool ? "error" : ""
                                                        }`}
                                                    value={highschool || ""}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "13%" }}
                                        >
                                            <label>Year Graduated *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    value={highYear || ""}
                                                    onChange={(e) => setHighYear(e.target.value)}
                                                    placeholder="Ex. 2020"
                                                    className={`persofom-input ${educErrors.highYear ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "1rem",
                                            margin: "20px",
                                            marginTop: "-10px",
                                        }}
                                    >
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "20%" }}
                                        >
                                            <label>School type of SHS/HS *</label>
                                            <select
                                                className={`persofom-input ${educErrors.schoolType ? "error" : ""
                                                    }`}
                                                value={schoolType || user?.schoolType || ""}
                                                onChange={(e) => setSchoolType(e.target.value)}
                                            >
                                                <option value="" disabled selected>
                                                    Select One
                                                </option>
                                                <option value="public">Public School</option>
                                                <option value="private">Private School</option>
                                            </select>
                                        </div>
                                        <div
                                            className="persofom-group ext"
                                            style={{ width: "60%" }}
                                        >
                                            <label>SHS Strand *</label>
                                            <select
                                                className={`persofom-input ${educErrors.strand ? "error" : ""
                                                    }`}
                                                value={strand || user?.strand || ""}
                                                onChange={(e) => setStrand(e.target.value)}
                                            >
                                                <option value="" disabled selected>
                                                    Select One
                                                </option>
                                                <option value="ABM">
                                                    Accountancy, Business, and Management (ABM)
                                                </option>
                                                <option value="GAS">
                                                    General Academic Strand (GAS)
                                                </option>
                                                <option value="HUMSS">
                                                    Humanities and Social Sciences (HUMSS)
                                                </option>
                                                <option value="STEM">
                                                    Science, Technology, Engineering, and Mathematics
                                                    (STEM)
                                                </option>
                                                <option value="AFA">Agri-Fishery Arts (TVL-AFA)</option>
                                                <option value="HE">Home Economics (TVL-HE)</option>
                                                <option value="IA">Industrial Arts (TVL-IA)</option>
                                                <option value="ICT">
                                                    Information and Communication Technology (TVL-ICT)
                                                </option>
                                                <option value="MS">
                                                    Maritime Specialization (TVL-MS)
                                                </option>
                                                <option value="SMAW">
                                                    Shielded Metal Arc Welding (TVL-SMAW) (TVL-MS)
                                                </option>
                                                <option value="NONE">
                                                    Did Not Take Senior High School Program
                                                </option>
                                            </select>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "13%" }}
                                        >
                                            <label>LRN *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    className={`persofom-input ${educErrors.lrn ? "error" : ""
                                                        }`}
                                                    value={lrn || ""}
                                                    onChange={(e) => setLrn(e.target.value)}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                    placeholder="LRN"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="persofom-group name"
                                        style={{ width: "93%", margin: "20px", marginTop: "-10px" }}
                                    >
                                        <label style={{ fontSize: "11px" }}>
                                            Achivements / Honors *
                                        </label>
                                        <div className="persofom-input-container">
                                            <textarea
                                                className={`persofom-input ${educErrors.honor ? "error" : ""
                                                    }`}
                                                value={honor || ""}
                                                onChange={(e) => setHonor(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    minHeight: "50px",
                                                    resize: "vertical",
                                                    fontSize: "11px",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <h4
                                        style={{
                                            color: "orange",
                                            fontSize: "12px",
                                            margin: "20px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        For transferees and second courser only.
                                    </h4>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "2rem",
                                            width: "100%",
                                            margin: "20px",
                                            marginTop: "-10px",
                                        }}
                                    >
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "50%" }}
                                        >
                                            <label>College *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    onChange={(e) => setCollege(e.target.value)}
                                                    value={college || ""}
                                                    placeholder="College / University Graduated"
                                                    className={`persofom-input ${educErrors.college ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "22%" }}
                                        >
                                            <label>Course / Program *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    placeholder="Ex. BSCS, BSEd, BSHM, BSBA"
                                                    value={course || ""}
                                                    onChange={(e) => setCourse(e.target.value)}
                                                    className={`persofom-input ${educErrors.course ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "15%" }}
                                        >
                                            <label>Year Graduated *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    placeholder="Ex. 2015"
                                                    value={year || ""}
                                                    onChange={(e) => setYear(e.target.value)}
                                                    className={`persofom-input ${educErrors.year ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "2rem",
                                            width: "100%",
                                            margin: "20px",
                                            marginTop: "-10px",
                                        }}
                                    >
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "50%" }}
                                        >
                                            <label>Technical / Vocational School *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    placeholder="College / University Graduated"
                                                    value={technical || ""}
                                                    onChange={(e) => setTechnical(e.target.value)}
                                                    className={`persofom-input ${educErrors.technical ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "22%" }}
                                        >
                                            <label>Course / Program *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    placeholder="Ex. Computer System Service"
                                                    value={program || ""}
                                                    onChange={(e) => setProgram(e.target.value)}
                                                    className={`persofom-input ${educErrors.program ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "15%" }}
                                        >
                                            <label>Year Completed *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    placeholder="Ex. 2015"
                                                    value={yearCom || ""}
                                                    onChange={(e) => setYearCom(e.target.value)}
                                                    className={`persofom-input ${educErrors.yearCom ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "2rem",
                                            width: "100%",
                                            margin: "20px",
                                            marginTop: "-10px",
                                        }}
                                    >
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "50%" }}
                                        >
                                            <label>National Certificate *</label>
                                            <div className="persofom-input-container">
                                                <input
                                                    placeholder="Ex. Computer System Servicing, Animation"
                                                    value={certificate || ""}
                                                    onChange={(e) => setCertificate(e.target.value)}
                                                    className={`persofom-input ${educErrors.certificate ? "error" : ""
                                                        }`}
                                                    type="text"
                                                    style={{ fontSize: "15px" }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name"
                                            style={{ width: "22%" }}
                                        >
                                            <label>NC Level *</label>
                                            <div
                                                className="persofom-group ext"
                                                style={{ width: "190%" }}
                                            >
                                                <select
                                                    className={`persofom-input ${educErrors.achivements ? "error" : ""
                                                        }`}
                                                    value={achivements || user?.achivements || ""}
                                                    onChange={(e) => setAchivments(e.target.value)}
                                                >
                                                    <option value="" disabled selected>
                                                        Select One
                                                    </option>
                                                    <option value="nc1">National Certificate I</option>
                                                    <option value="nc2">National Certificate II</option>
                                                    <option value="nc3">National Certificate III</option>
                                                    <option value="nc4">National Certificate IV</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="unibtn"
                                        style={{
                                            marginTop: "20px",
                                            marginRight: "25px",
                                            paddingBottom: "20px",
                                        }}
                                    >
                                        <button type="submit" onClick={handleUpdateEduct}>
                                            <i className="fa-solid fa-download"></i> Save and Proceed
                                            to Next Step
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Family Information Section */}
                <div
                    className={`datafill ${fillsection === "family" ? "active" : ""} ${!unlockedSections.includes("family") ? "disabled" : ""
                        }`}
                    onClick={() => goToSection("family")}
                >
                    <div
                        className={`fillhead ${fillsection === "family" ? "active" : ""}`}
                    >
                        <span className="step-icon">
                            {fillsection === "family" ? (
                                <i className="fa-solid fa-pen"></i>
                            ) : (
                                "4"
                            )}
                        </span>
                        <h2 style={{ fontSize: "12px" }}>FAMILY</h2>
                    </div>

                    {fillsection === "family" && (
                        <>
                            <div className="preprofile">
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                    }}
                                >
                                    <div className="uploads" style={{ marginBottom: "1rem" }}>
                                        <h4 style={{ color: "#333" }}>Family Information</h4>
                                        <p
                                            style={{
                                                marginBottom: "20px",
                                                fontSize: "12px",
                                                fontStyle: "italic",
                                                marginTop: "10px",
                                                color: "orange",
                                            }}
                                        >
                                            Please provide your family details below. This helps us
                                            understand your background and ensure proper support when
                                            needed.
                                            <hr style={{ background: "grey" }} />
                                        </p>
                                        <h4 style={{ color: "#333", fontSize: "12px" }}>
                                            Tell us a bit about your family! This information helps us
                                            get to know you better and provide the right support
                                            throughout your journey at Kolehiyo ng Subic.
                                        </h4>
                                    </div>
                                    <hr />
                                    <div style={{ marginTop: "15px" }}>
                                        <h4 style={{ color: "#333", marginLeft: "25px" }}>
                                            Father's Information
                                        </h4>
                                        <hr />
                                        <div className="persofom-group name-container">
                                            <div className="persofom-group name">
                                                <label>First Name*</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        className={`persofom-input ${familyErrors.fatName ? "error" : ""
                                                            }`}
                                                        value={fatName || ""}
                                                        onChange={(e) => setFatName(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="persofom-group name">
                                                <label>Middle Name</label>
                                                <input
                                                    className={`persofom-input ${familyErrors.fatMidName ? "error" : ""
                                                        }`}
                                                    value={fatMidName || ""}
                                                    onChange={(e) => setFatMidName(e.target.value)}
                                                    type="text"
                                                />
                                            </div>
                                            <div className="persofom-group name">
                                                <label>Last Name*</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        className={`persofom-input ${familyErrors.fatLastName ? "error" : ""
                                                            }`}
                                                        value={fatLastName || ""}
                                                        onChange={(e) => setFatLastName(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="persofom-group ext">
                                                <label>Ext Name</label>
                                                <select
                                                    className="persofom-input"
                                                    value={fatExt || fatExt?.fatExt || ""}
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value;
                                                        setFatExt(selectedValue);
                                                        if (selectedValue === "") {
                                                            setFatExt("");
                                                        }
                                                    }}
                                                >
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
                                    <div style={{ marginTop: "15px" }}>
                                        <h4 style={{ color: "#333", marginLeft: "25px" }}>
                                            Mother's Information
                                        </h4>
                                        <hr />
                                        <div className="persofom-group name-container">
                                            <div className="persofom-group name">
                                                <label>First Name*</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        className={`persofom-input ${familyErrors.motName ? "error" : ""
                                                            }`}
                                                        value={motName || ""}
                                                        onChange={(e) => setMotName(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="persofom-group name">
                                                <label>Middle Name</label>
                                                <input
                                                    className={`persofom-input ${familyErrors.motMidName ? "error" : ""
                                                        }`}
                                                    value={motMidName || ""}
                                                    onChange={(e) => setMotMidName(e.target.value)}
                                                    type="text"
                                                />
                                            </div>
                                            <div className="persofom-group name">
                                                <label>Last Name*</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        className={`persofom-input ${familyErrors.motLastName ? "error" : ""
                                                            }`}
                                                        value={motLastName || ""}
                                                        onChange={(e) => setMotLastName(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "15px" }}>
                                        <h4 style={{ color: "orange", marginLeft: "25px" }}>
                                            Brothers and Sisters
                                        </h4>
                                        <hr />
                                        <div className="persofom-group name-container">
                                            <div className="persofom-group name">
                                                <label>Number of Brother *</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        className={`persofom-input ${familyErrors.broNum ? "error" : ""
                                                            }`}
                                                        value={broNum || ""}
                                                        onChange={(e) => setBroNum(e.target.value)}
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="persofom-group name">
                                                <label>Number of Sister *</label>
                                                <input
                                                    className={`persofom-input ${familyErrors.sisNum ? "error" : ""
                                                        }`}
                                                    value={sisNum || ""}
                                                    onChange={(e) => setSisNum(e.target.value)}
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "15px" }}>
                                        <h4 style={{ color: "green", marginLeft: "25px" }}>
                                            Guardian's Profile
                                        </h4>
                                        <hr />
                                        <div className="persofom-group name-container">
                                            <div className="persofom-group name">
                                                <label>Guardian Name *</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        placeholder="Ex. Juan M. Dela Cruz Jr"
                                                        style={{ width: "700px" }}
                                                        className={`persofom-input ${familyErrors.guarName ? "error" : ""
                                                            }`}
                                                        value={guarName || ""}
                                                        onChange={(e) => setGuarName(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="persofom-group name">
                                                <label>Relationship *</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        placeholder="Mother, Father, Sister, ect"
                                                        className={`persofom-input ${familyErrors.guarRelationship ? "error" : ""
                                                            }`}
                                                        value={guarRelationship || ""}
                                                        onChange={(e) =>
                                                            setGuarRelationship(e.target.value)
                                                        }
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="persofom-group name-container"
                                            style={{ marginTop: "15px", marginBottom: "20px" }}
                                        >
                                            <div className="persofom-group name">
                                                <label>
                                                    Guardian Address (House No. Street, Barangay,
                                                    City/municipality) *
                                                </label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        placeholder="Ex. WFI Compound, Wawandue, Subic Zambales"
                                                        style={{ width: "420px" }}
                                                        className={`persofom-input ${familyErrors.guarAddress ? "error" : ""
                                                            }`}
                                                        value={guarAddress || ""}
                                                        onChange={(e) => setGuarAddress(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="persofom-group name">
                                                <label>Guardian's Email Address *</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        placeholder="Guardians Email (Optional)"
                                                        className={`persofom-input`}
                                                        value={guarEmail || ""}
                                                        onChange={(e) => setGuarEmail(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="persofom-group name">
                                                <label>Mobile Number *</label>
                                                <div className="persofom-input-container">
                                                    <input
                                                        placeholder="+63 xxx-xxxx-xxx"
                                                        className={`persofom-input ${familyErrors.guarTel ? "error" : ""
                                                            }`}
                                                        value={guarTel || ""}
                                                        onChange={(e) => setGuarTel(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="unibtn"
                                        style={{
                                            marginTop: "16px",
                                            marginRight: "25px",
                                            paddingBottom: "20px",
                                        }}
                                    >
                                        <button type="submit" onClick={handleUpdateFamily}>
                                            <i className="fa-solid fa-download"></i> Save and Proceed
                                            to Next Step
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Upload Docx Information Section */}
                <div
                    className={`datafill ${fillsection === "uploads" ? "active" : ""} ${!unlockedSections.includes("uploads") ? "disabled" : ""
                        }`}
                    onClick={() => goToSection("uploads")}
                >
                    <div
                        className={`fillhead ${fillsection === "upload" ? "active" : ""}`}
                    >
                        <span className="step-icon">
                            {fillsection === "upload" ? (
                                <i className="fa-solid fa-pen"></i>
                            ) : (
                                "5"
                            )}
                        </span>
                        <h2 style={{ fontSize: "10px" }}>UPLOAD DOCUMENTS</h2>
                    </div>

                    {fillsection === "uploads" && (
                        <>
                            <div className="ipreprofile">
                                <div className="uploads">
                                    <h1>PLEASE READ!</h1>
                                    <p style={{ marginBottom: "20px", fontSize: "15px" }}>
                                        Here are the documents you'll need for admission. Please
                                        make sure to upload everything that's required so we can get
                                        started on processing your application.
                                    </p>
                                    <table className="status-table" style={{ width: "100%" }}>
                                        <thead style={{ background: "white" }}>
                                            <tr>
                                                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                                                    Documents
                                                </td>
                                                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                                                    Status
                                                </td>
                                                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                                                    Upload
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ background: "white" }}>
                                                <td>2x2 Picture with white background *</td>
                                                <td style={{ textAlign: "center" }}>
                                                    {uploadStatus.profileImage === "✔️" ? "✔️" : "❌"}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        style={{
                                                            border: "none",
                                                            borderRadius: "3px",
                                                            backgroundColor: "orange",
                                                            padding: "6px",
                                                        }}
                                                    >
                                                        <i
                                                            className="fa-solid fa-upload"
                                                            style={{ fontSize: "15px" }}
                                                            onClick={() => setProfilepfp(true)}
                                                        ></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            <tr style={{ background: "white" }}>
                                                <td>Valid ID Card / Senior High School ID Card *</td>

                                                <td style={{ textAlign: "center" }}>
                                                    {uploadStatus.validId === "✔️" ? "✔️" : "❌"}
                                                </td>

                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        onClick={() => setUploadModalOpen(true)}
                                                        style={{
                                                            border: "none",
                                                            borderRadius: "3px",
                                                            backgroundColor: "orange",
                                                            padding: "6px",
                                                        }}
                                                    >
                                                        <i
                                                            className="fa-solid fa-upload"
                                                            style={{ fontSize: "15px" }}
                                                        ></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            {uploadModalOpen && (
                                                <div className="preforgot">
                                                    <div className="forgotbg">
                                                        <h2 style={{ color: "#303030" }}>
                                                            Upload Valid ID
                                                        </h2>
                                                        <p style={{ color: "red", fontSize: "12px" }}>
                                                            Upload a valid government or school ID. Max 2MB,
                                                            accepted formats: .jpg, .jpeg, .png.
                                                        </p>
                                                        <hr />
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: "10px",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        setIdImage(reader.result);
                                                                    };
                                                                    if (file) reader.readAsDataURL(file);
                                                                }}
                                                            />
                                                        </div>
                                                        <div
                                                            className="button-container"
                                                            style={{ marginTop: "20px" }}
                                                        >
                                                            <button
                                                                onClick={() => setUploadModalOpen(false)}
                                                                style={{
                                                                    background: "transparent",
                                                                    color: "#006666",
                                                                    border: "1px solid #ffffffff",
                                                                    padding: "10px 20px",
                                                                    cursor: "pointer",
                                                                    transition: "background 0.3s, color 0.3s",
                                                                    color: "grey",
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.background = "#006666";
                                                                    e.target.style.color = "#fff";
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.target.style.background = "transparent";
                                                                    e.target.style.color = "#757575ff";
                                                                }}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                onClick={idHandleUpload}
                                                                style={{
                                                                    border: "1px solid #006666",
                                                                    background: "#006666",
                                                                    color: "white",
                                                                    padding: "10px 20px",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <tr style={{ background: "white" }}>
                                                <td>NSO/PSA Birth Certificate *</td>
                                                <td style={{ textAlign: "center" }}>
                                                    {uploadStatus.birthCert === "✔️" ? "✔️" : "❌"}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        onClick={() => setBirthCertModalOpen(true)}
                                                        style={{
                                                            border: "none",
                                                            borderRadius: "3px",
                                                            backgroundColor: "orange",
                                                            padding: "6px",
                                                        }}
                                                    >
                                                        <i
                                                            className="fa-solid fa-upload"
                                                            style={{ fontSize: "15px" }}
                                                        ></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            {birthCertModalOpen && (
                                                <div className="preforgot">
                                                    <div className="forgotbg">
                                                        <h2 style={{ color: "#303030" }}>
                                                            Upload Birth Certificate
                                                        </h2>
                                                        <p style={{ color: "red", fontSize: "12px" }}>
                                                            Upload a scanned copy of your PSA Birth
                                                            Certificate. Max 2MB, formats: .jpg, .jpeg, .png.
                                                        </p>
                                                        <hr />
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: "10px",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        setBirthCertImage(reader.result);
                                                                    };
                                                                    if (file) reader.readAsDataURL(file);
                                                                }}
                                                            />
                                                        </div>
                                                        <div
                                                            className="button-container"
                                                            style={{ marginTop: "20px" }}
                                                        >
                                                            <button
                                                                onClick={() => setBirthCertModalOpen(false)}
                                                                style={{
                                                                    background: "transparent",
                                                                    color: "#006666",
                                                                    border: "1px solid #ffffffff",
                                                                    padding: "10px 20px",
                                                                    cursor: "pointer",
                                                                    color: "grey",
                                                                }}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                onClick={birthCertHandleUpload}
                                                                style={{
                                                                    border: "1px solid #006666",
                                                                    background: "#006666",
                                                                    color: "white",
                                                                    padding: "10px 20px",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <tr style={{ background: "white" }}>
                                                <td>Certificate of Good Moral Character *</td>
                                                <td style={{ textAlign: "center" }}>
                                                    {uploadStatus.goodMoral === "✔️" ? "✔️" : "❌"}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        onClick={() => setGoodMoralModalOpen(true)}
                                                        style={{
                                                            border: "none",
                                                            borderRadius: "3px",
                                                            backgroundColor: "orange",
                                                            padding: "6px",
                                                        }}
                                                    >
                                                        <i
                                                            className="fa-solid fa-upload"
                                                            style={{ fontSize: "15px" }}
                                                        ></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            {goodMoralModalOpen && (
                                                <div className="preforgot">
                                                    <div className="forgotbg">
                                                        <h2 style={{ color: "#303030" }}>
                                                            Upload Good Moral Certificate
                                                        </h2>
                                                        <p style={{ color: "red", fontSize: "12px" }}>
                                                            Upload a scanned copy of your Good Moral
                                                            Certificate. Max 2MB, formats: .jpg, .jpeg, .png.
                                                        </p>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setGoodMoralImage(reader.result);
                                                                };
                                                                if (file) reader.readAsDataURL(file);
                                                            }}
                                                        />
                                                        <div
                                                            className="button-container"
                                                            style={{ marginTop: "20px" }}
                                                        >
                                                            <button
                                                                onClick={() => setGoodMoralModalOpen(false)}
                                                                style={{
                                                                    background: "transparent",
                                                                    color: "grey",
                                                                    border: "1px solid #fff",
                                                                    padding: "10px 20px",
                                                                }}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                onClick={goodMoralHandleUpload}
                                                                style={{
                                                                    border: "1px solid #006666",
                                                                    background: "#006666",
                                                                    color: "white",
                                                                    padding: "10px 20px",
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <tr style={{ background: "white" }}>
                                                <td>
                                                    Academic Records ** <br />
                                                    <p style={{ fontSize: "14px", marginLeft: "20px" }}>
                                                        {" "}
                                                        • First Semester Report Card (for SHS Graduating)
                                                    </p>
                                                    <p style={{ fontSize: "14px", marginLeft: "20px" }}>
                                                        {" "}
                                                        • Complete Report Card SF9 (for SHS Graduates){" "}
                                                    </p>
                                                    <p style={{ fontSize: "14px", marginLeft: "20px" }}>
                                                        {" "}
                                                        • Complete Report Card F-138 (for Old BEC Graduates)
                                                    </p>
                                                    <p style={{ fontSize: "14px", marginLeft: "20px" }}>
                                                        {" "}
                                                        • ALS Certificate of Rating (For ALS Passers)
                                                    </p>
                                                    <p style={{ fontSize: "14px", marginLeft: "20px" }}>
                                                        {" "}
                                                        • Transcript of Records or Certificate of Grades
                                                        (For Transferees){" "}
                                                    </p>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    {uploadStatus.academic === "✔️" ? "✔️" : "❌"}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        style={{
                                                            border: "none",
                                                            borderRadius: "3px",
                                                            backgroundColor: "orange",
                                                            padding: "6px",
                                                        }}
                                                    >
                                                        <i
                                                            className="fa-solid fa-upload"
                                                            style={{ fontSize: "15px" }}
                                                            onClick={() => setAcademicModalOpen(true)}
                                                        ></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            {academicModalOpen && (
                                                <div className="preforgot">
                                                    <div className="forgotbg">
                                                        <h2 style={{ color: "#303030" }}>
                                                            Upload Academic Records Certificate
                                                        </h2>
                                                        <p style={{ color: "red", fontSize: "12px" }}>
                                                            Upload a scanned copy of your Academic Records
                                                            Certificate. Max 2MB, formats: .jpg, .jpeg, .png.
                                                        </p>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setAcademicImage(reader.result);
                                                                };
                                                                if (file) reader.readAsDataURL(file);
                                                            }}
                                                        />
                                                        <div
                                                            className="button-container"
                                                            style={{ marginTop: "20px" }}
                                                        >
                                                            <button
                                                                onClick={() => setAcademicModalOpen(false)}
                                                                style={{
                                                                    background: "transparent",
                                                                    color: "grey",
                                                                    border: "1px solid #fff",
                                                                    padding: "10px 20px",
                                                                }}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                onClick={academicHandleUpload}
                                                                style={{
                                                                    border: "1px solid #006666",
                                                                    background: "#006666",
                                                                    color: "white",
                                                                    padding: "10px 20px",
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </tbody>
                                    </table>
                                    <p>
                                        - requirements to take KNSAT <br />- requirements for
                                        evaluation and interview
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Finalised Information Section */}
                <div
                    className={`datafill ${fillsection === "confirmation" ? "active" : ""
                        }`}
                    onClick={() => setFillsection("confirmation")}
                >
                    <div
                        className={`fillhead ${fillsection === "confirmation" ? "active" : ""
                            }`}
                    >
                        <span className="step-icon">
                            {fillsection === "confirmation" ? (
                                <i className="fa-solid fa-pen"></i>
                            ) : (
                                "6"
                            )}
                        </span>
                        <h2 style={{ fontSize: "10px" }}>CONFIRMATION</h2>
                    </div>

                    {fillsection === "confirmation" && (
                        <div className="preprofile">
                            <div className="uploads">
                                <h4>You are almost done!</h4>
                                <hr style={{ background: "grey" }} />
                                <p
                                    style={{
                                        marginBottom: "20px",
                                        fontSize: "15px",
                                        fontStyle: "italic",
                                        marginTop: "10px",
                                    }}
                                >
                                    Thank you for filling out the form! The next step is to upload
                                    the remaining images or scanned copies of the required
                                    documents. Just click the button below to complete your
                                    enlistment. Please note that your exam schedule will be
                                    provided by the admission office once your enlistment is
                                    finalized.
                                </p>

                                <div className="unibtn">
                                    <button onClick={handleFinalize}>
                                        <i className="fa-solid fa-forward-step"></i> Finalized
                                        Enlistment
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
