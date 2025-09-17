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

require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/student");

app.post('/register', async (req, res) => {
    try {
        const student = await StudentModel.create({
            ...req.body,
            studentNumber: null,
            domainEmail: null,
            portalPassword: null
        });

        res.status(201).json({ message: "Pre-registration successful", student });
    } catch (err) {
        res.status(500).json({ message: "Error creating account", error: err.message });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await StudentModel.findOne({ email, password });

        if (!student) {
            throw new Error("Invalid email or password");
        }

        res.status(201).json({ message: "Account successfully logged in", student });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});

app.post('/upload', async (req, res) => {
    const { email, image } = req.body;

    try {
        if (!email || !image) {
            return res.status(400).json({ message: "Email and image are required" });
        }

        const student = await StudentModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    image,
                    profileImage: '✔️'
                }
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Image uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
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
        const student = await StudentModel.findOne({ email });
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ student });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
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


app.use("/api/backups", backupRoutes);
app.use(studentRoutes);
app.use(acceptedStudentsRoutes);


app.listen(2025, '0.0.0.0', () => {
    console.log("Server is running on port 2025");
});
