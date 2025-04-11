const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const StudentModel = require("./models/Student");

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/student", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/register', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const yearPrefix = currentYear.toString().slice(-2);

        const lastStudent = await StudentModel.findOne().sort({ studentNumber: -1 });
        let lastNumber = 0;

        if (lastStudent) {
            const lastStudentNumber = lastStudent.studentNumber;
            const lastNumberString = lastStudentNumber.split('-')[1];
            lastNumber = parseInt(lastNumberString, 10) || 0;
        }

        const nextNumber = lastNumber + 1;
        const formattedNumber = nextNumber.toString().padStart(4, '0');

        const studentNumber = `${yearPrefix}-${formattedNumber}`;

        const student = await StudentModel.create({ ...req.body, studentNumber });
        res.status(201).json({ message: "Account created successfully", student });
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
    const { email, image } = req.body

    try {
        if (!email || !image) {
            return res.status(400).json({ message: "Email and image are required" });
        }

        const student = await StudentModel.findOneAndUpdate(
            { email },
            { image },
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
        disability, disabilityCategory, disabilityDetails
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
                disabilityDetails
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



app.listen(2025, () => {
    console.log("Server is running on port 2025");
});
