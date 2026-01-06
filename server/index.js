const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const StudentModel = require("./models/Student");
const AdminData = require('./models/admin/admindata');
const CourseModel = require('./models/Course');
const CourseRoutes = require('./routes/courses');
const studentRoutes = require('./routes/students');
const backupRoutes = require("./routes/backupRoutes");
const departmentRoutes = require('./routes/department');
const AcceptedStudent = require("./models/AcceptedStudent");
const acceptedStudentsRoutes = require("./routes/acceptedStudents");
const Settings = require("./models/Settings");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const Upload = require('./models/Upload');
const studentByDomainRoute = require("./routes/studentByDomain");
const semesterSettingsRoutes = require("./routes/semesterSettings");
const classroomRoutes = require("./routes/classrooms");
const chatRoutes = require("./routes/chatRoutes");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use("/", studentByDomainRoute);
app.use("/api/backups", backupRoutes);
app.use(studentRoutes);
app.use(acceptedStudentsRoutes);
app.use("/api", adminRoutes);
app.use("/api/settings", semesterSettingsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/uploads", uploadRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/chats", chatRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/student");

// ---------------------- REGISTRATION ----------------------
app.post('/register', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (settings && !settings.preRegister) {
            return res.status(403).json({
                message: "Pre-registration is currently closed."
            });
        }

        const existingUser = await StudentModel.findOne({
            email: req.body.email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered."
            });
        }

        const generateRegisterNumber = async () => {
            const prefix = "KNS";
            while (true) {
                const random = Math.floor(100000 + Math.random() * 900000);
                const registerNumber = `${prefix}${random}`;
                const exists = await StudentModel.findOne({ registerNumber });
                if (!exists) return registerNumber;
            }
        };

        const registerNumber = await generateRegisterNumber();

        const student = await StudentModel.create({
            ...req.body,
            registerNumber,    
            studentNumber: null,
            domainEmail: null,
            portalPassword: null
        });

        res.status(201).json({
            message: "Pre-registration successful",
            student
        });

    } catch (err) {
        // 🔥 CLEAN duplicate error handling
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Student is already registered."
            });
        }

        console.error("Registration error:", err);

        res.status(500).json({
            message: "Registration failed. Please try again."
        });
    }
});


// ---------------------- LOGIN ----------------------
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await StudentModel.findOne({ email, password });
        if (!student) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        res.status(201).json({ message: "Account successfully logged in", student });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});

// ---------------------- RESET PASSWORD ----------------------
app.post('/reset-password', async (req, res) => {
    const { register, email, phone, birthdate, password, confirmPassword } = req.body;

    if (!register || !email || !phone || !birthdate || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const student = await StudentModel.findOne({
            register,
            email,
            phone,
            birthdate
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found or information does not match" });
        }

        student.password = password;
        await student.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error while resetting password", error: error.message });
    }
});

app.post("/upload", async (req, res) => {
    try {
        const { email, image } = req.body;

        // Validate input
        if (!email || !image) {
            return res.status(400).json({ message: "Email and image are required." });
        }

        // Update student and return updated doc
        const student = await StudentModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    image,              // save new profile image (base64 or URL)
                    profileImage: "✔️", // mark as uploaded
                },
            },
            { new: true, runValidators: true } // return updated & validate schema
        );

        // Handle not found
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        //  Success response
        return res.json({
            success: true,
            message: "Image uploaded successfully!",
            student,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while uploading image.",
            error: error.message,
        });
    }
});

app.post('/upload-id-image', async (req, res) => {
    const { email, idimage } = req.body;

    if (!email || !idimage) {
        return res.status(400).json({ message: "Email and ID image are required" });
    }

    try {
        const student = await StudentModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    idimage,
                    validId: '✔️'
                }
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "ID image uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Upload Birth Certificate
app.post('/upload-birth-cert', async (req, res) => {
    const { email, birthCertImage } = req.body;

    if (!email || !birthCertImage) {
        return res.status(400).json({ message: "Email and birth certificate image are required" });
    }

    try {
        const student = await StudentModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    birthCertImage,
                    birthCert: true
                }
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Birth certificate uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Upload Academic Records
app.post('/upload-academic', async (req, res) => {
    const { email, academicImage } = req.body;

    if (!email || !academicImage) {
        return res.status(400).json({ message: "Email and academic image are required" });
    }

    try {
        const student = await StudentModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    academicImage,
                    academic: true
                }
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Academic records uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get('/get-upload-status/:email', async (req, res) => {
    try {
        const student = await StudentModel.findOne({ email: req.params.email });

        if (!student) {
            return res.json({
                validId: false,
                birthCert: false,
                goodMoral: false,
                academic: false,
                profileImage: false
            });
        }

        res.json({
            validId: student.validId === '✔️',
            birthCert: student.birthCert === '✔️',
            goodMoral: student.goodMoral === '✔️',
            academic: student.academic === '✔️',
            profileImage: student.profileImage === '✔️'
        });
    } catch (error) {
        console.error("Error in /get-upload-status:", error);
        res.status(500).json({
            validId: false,
            birthCert: false,
            goodMoral: false,
            academic: false,
            profileImage: false
        });
    }
});

app.get("/getuser", async (req, res) => {
    const { email } = req.query;
    try {
        const student = await Student.findOne({ email }); // fresh from DB
        if (!student) return res.status(404).json({ message: "User not found" });
        res.json({ student });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


app.post('/change-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        const student = await StudentModel.findOne({ email: email.toLowerCase() });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (student.password !== currentPassword) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        student.password = newPassword;
        await student.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
});

app.post('/api/updateUserDetails', async (req, res) => {
    const { email, disabilityDetails, disabilityCategory } = req.body;

    console.log("Update Request Body:", req.body);

    try {
        const updatedUser = await StudentModel.findOneAndUpdate(
            { email },
            { disabilityDetails: disabilityDetails || " ", disabilityCategory: disabilityCategory },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "User details updated successfully", updatedUser });
    } catch (err) {
        console.error('Error updating user details:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.put("/update-profile", async (req, res) => {
    const {
        phone, email, middlename, extension, birthplace, civil, sex, orientation, gender,
        citizenship, religion, region, province, city, barangay,
        disability, disabilityCategory, disabilityDetails, scholar, elementary, elemYear, highYear,
        highschool, schoolType, strand, lrn, honor, college, technical, certificate, course, year, program, yearCom, achivements,
        fatName, fatMidName, fatLastName, fatExt, motName, motMidName, motLastName, broNum, sisNum, guarName, guarRelationship,
        guarAddress, guarEmail, guarTel, selectedCourse, selectedSecCourse, initialDept,
    } = req.body;

    try {
        console.log("Request Body:", req.body);

        const updatedUser = await StudentModel.findOneAndUpdate(
            { email: email },
            {
                phone,
                middlename,
                extension,
                birthplace,
                civil,
                sex,
                orientation,
                gender,
                citizenship,
                religion,
                region,
                province,
                city,
                barangay,
                disability,
                disabilityCategory,
                disabilityDetails,
                scholar,
                elementary,
                highschool,
                elemYear,
                highYear,
                schoolType,
                strand,
                lrn,
                honor,
                college,
                technical,
                certificate,
                course,
                year,
                program,
                yearCom,
                achivements,
                fatName,
                fatMidName,
                fatLastName,
                fatExt,
                motName,
                motMidName,
                motLastName,
                broNum,
                sisNum,
                guarName,
                guarRelationship,
                guarAddress,
                guarEmail,
                guarTel,
                selectedCourse,
                selectedSecCourse,
                initialDept,
            },
            { new: true }
        );
        if (!updatedUser) {
            console.error("User not found for email:", email);
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            success: true,
            profileUpdated: true,
            updatedUser: updatedUser
        });
    } catch (err) {
        console.error("Error during update:", err.message);
        console.error("Error stack:", err.stack);
        res.status(500).json({ error: err.message });
    }
});

app.use('/api/departments', departmentRoutes);

app.get("/api/courses", async (req, res) => {
    try {
        const courses = await CourseModel.find().sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/courses", async (req, res) => {
    try {
        const newCourse = new CourseModel(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/api/courses/:id", async (req, res) => {
    try {
        const updated = await CourseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/courses/:id", async (req, res) => {
    try {
        await CourseModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/acceptedstudents/:id', async (req, res) => {
    try {
        const student = await AcceptedStudent.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).send({ message: 'Student not found' });
        res.send({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

app.get('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const student = await StudentModel.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (err) {
        console.error('Error fetching student details:', err);
        res.status(500).json({ message: 'Error fetching student details', error: err.message });
    }
});

app.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.json({ preRegister: false });
        }
        res.json({ preRegister: settings.preRegister });
    } catch (err) {
        res.status(500).json({ preRegister: false });
    }
});

app.post("/settings", async (req, res) => {
    try {
        const { preRegister, activeSemester } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ preRegister, activeSemester });
        } else {
            settings.preRegister = preRegister;
            settings.activeSemester = activeSemester;
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/api/enrollment-status/:email", async (req, res) => {
    try {
        const email = req.params.email?.trim().toLowerCase();
        if (!email) return res.status(400).json({ message: "Email is required" });

        const student = await AcceptedStudent.findOne({ domainEmail: email });
        if (!student) return res.status(404).json([]);

        const settings = await Settings.findOne();
        const activeSem = settings?.activeSemester?.trim();
        if (!activeSem) return res.json(student.enrollmentHistory || []);

        let history = Array.isArray(student.enrollmentHistory)
            ? [...student.enrollmentHistory]
            : [];

        const formattedActiveSem = `${activeSem} Sem`;
        const yearForActive =
            student.academicYear ||
            `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;

        if (student.semester && student.enrollmentStatus === "Officially Enrolled") {
            const existsOfficial = history.some(
                h =>
                    h.academicYear === student.academicYear &&
                    h.semester === student.semester &&
                    h.enrollmentStatus === "Officially Enrolled"
            );

            if (!existsOfficial) {
                history.push({
                    academicYear: student.academicYear,
                    semester: student.semester,
                    enrollmentStatus: "Officially Enrolled",
                    acceptedAt: student.acceptedAt,
                    dateEnlisted: student.dateEnlisted || null
                });
            }
        }

        history = history.map(h => {
            if (
                h.enrollmentStatus === "Open for Enrollment" &&
                !(
                    h.academicYear === yearForActive &&
                    h.semester.toLowerCase() === formattedActiveSem.toLowerCase()
                )
            ) {

                return {
                    ...h,
                    enrollmentStatus: "Not Enrolled",
                    dateEnlisted: h.dateEnlisted || null
                };
            }
            return h;
        });

        const existingIndex = history.findIndex(
            h =>
                h.academicYear === yearForActive &&
                h.semester.toLowerCase() === formattedActiveSem.toLowerCase()
        );

        if (existingIndex === -1) {
            history.unshift({
                academicYear: yearForActive,
                semester: formattedActiveSem,
                enrollmentStatus: "Open for Enrollment",
                dateEnlisted: null
            });
        } else {
            history[existingIndex].enrollmentStatus = "Open for Enrollment";
            history[existingIndex].dateEnlisted = null;
        }

        history = history.filter(h =>
            h &&
            h.academicYear &&
            h.enrollmentStatus &&
            h.enrollmentStatus !== "Not Enrolled" &&
            h.enrollmentStatus !== "Not Enlisted"
        );

        history = history.filter(h => {
            const [startYear] = h.academicYear.split("/").map(Number);
            const [activeStartYear] = yearForActive.split("/").map(Number);
            return startYear >= activeStartYear - 1;
        });

        student.enrollmentHistory = history;
        await student.save();

        res.json(history);
    } catch (err) {
        console.error("Error fetching enrollment status:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.listen(2025, '0.0.0.0', () => {
    console.log("Server’s awake and ready to roll!");
});
