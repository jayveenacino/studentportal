const express = require('express');
const Student = require('../models/Student');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();

// ================= LOGIN =================
router.post('/api/students/login', async (req, res) => {
    const { studentNumber, portalPassword } = req.body;

    try {
        const student = await Student.findOne({
            $or: [
                { studentNumber: studentNumber },
                { domainEmail: studentNumber }
            ]
        });

        if (!student) return res.status(404).json({ message: "Student not found" });

        const isMatch = await bcrypt.compare(portalPassword, student.portalPassword);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const fullName = `${student.firstname} ${student.middlename} ${student.lastname}`;
        res.json({ message: "Login successful", student: { fullName, id: student._id } });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ================= GET ALL STUDENTS =================
router.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find({ isAccepted: true })
            .populate('selectedCourse', 'initialDept')
            .exec();

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= DECLINE STUDENT =================
router.delete('/api/students/:id/decline', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json({ message: 'Student declined and removed from database.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= ACCEPT STUDENT =================
router.put('/api/students/:id/accept', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const recipientEmail = student.email || student.gmail || student.personalEmail;
        if (!recipientEmail) {
            return res.status(400).json({ message: 'No valid email found for this student' });
        }

        // ================= STUDENT NUMBER GENERATION =================
        const currentYear = new Date().getFullYear();
        const yearPrefix = currentYear.toString().slice(-2);

        const lastStudent = await Student.find({ studentNumber: { $exists: true } })
            .sort({ studentNumber: -1 })
            .limit(1);

        let lastNumber = 0;
        if (lastStudent.length > 0) {
            const lastStudentNumber = lastStudent[0].studentNumber;
            if (lastStudentNumber && lastStudentNumber.includes('-')) {
                const lastNumberString = lastStudentNumber.split('-')[1];
                lastNumber = parseInt(lastNumberString, 10) || 0;
            }
        }

        const nextNumber = lastNumber + 1;
        const formattedNumber = nextNumber.toString().padStart(4, '0');
        const studentNumber = `${yearPrefix}-${formattedNumber}`;
        const domainEmail = `${yearPrefix}${formattedNumber}@knsians.edu.ph`;

        // ================= PASSWORD =================
        const plainPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // ================= UPDATE STUDENT =================
        student.studentNumber = studentNumber;
        student.domainEmail = domainEmail;
        student.portalPassword = hashedPassword;
        student.status = 'Accepted';
        student.isAccepted = true;

        await student.save();

        // ================= SEND EMAIL =================
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jayveemadriaganacino@gmail.com',
                pass: 'edni bnjc hcic ujad',
            },
        });

        const mailOptions = {
            from: `"KNS Admin" <jayveemadriaganacino@gmail.com>`,
            to: recipientEmail,
            subject: 'KNS Pre-Registration Accepted',
            html: `
                <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px;">
                    <img src="https://i.imgur.com/cV0u8i4.png" alt="KNS Logo" style="width: 100px; margin-bottom: 20px;" />
                    <hr>
                    <h2>Hi ${student.firstname || ''} ${student.middlename || ''} ${student.lastname || ''},</h2>
                    <p>Your pre-registration has been <b>accepted</b>. <br> Welcome to <b>KOLEHIYO NG SUBIC</b>!</p>
                    <p>Here is your official school portal domain:</p>
                    <p><b>School Domain:</b> ${domainEmail}<br/>
                    <b>Temporary Password:</b> <span style="color: #007bff;">${plainPassword}</span>
                    </p>
                    <p>Login here: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>
                    <p style="font-size: 14px; color: #555;">
                        Keep learning and growing.<br/>
                        — Kolehiyo ng Subic Admissions Team
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully.');

        return res.json({
            message: 'Student accepted, credentials saved, and email sent.',
            studentNumber,
            domainEmail,
            temporaryPassword: plainPassword,
        });

    } catch (err) {
        console.error('Error in accept route:', err);
        return res.status(500).json({ error: err.message });
    }
});

// ================= ENROLLEES FILTER =================
router.get("/api/enrollees", async (req, res) => {
    try {
        const enrollees = await Student.find({
            selectedCourse: { $exists: true, $ne: "" },
            isAccepted: { $ne: true }
        });

        res.json(enrollees);
    } catch (err) {
        console.error("Error fetching enrollees:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= UPLOAD ROUTES =================
// Birth Certificate
router.post('/upload-birthcert-image', async (req, res) => {
    const { email, birthCertImage } = req.body;
    if (!email || !birthCertImage) {
        return res.status(400).json({ message: "Email and birth certificate image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            { $set: { birthCertImage, birthCert: '✔️' } },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Birth certificate uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Good Moral
router.post('/upload-goodmoral-image', async (req, res) => {
    const { email, goodMoralImage } = req.body;
    if (!email || !goodMoralImage) {
        return res.status(400).json({ message: "Email and good moral image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            { $set: { goodMoralImage, goodMoral: '✔️' } },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Good moral uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Academic Records
router.post('/upload-academic-image', async (req, res) => {
    const { email, academicImage } = req.body;
    if (!email || !academicImage) {
        return res.status(400).json({ message: "Email and academic record image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            { $set: { academicImage, academic: '✔️' } },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Academic record uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Profile Image
router.post('/upload-profile-image', async (req, res) => {
    const { email, imgImage } = req.body;
    if (!email || !imgImage) {
        return res.status(400).json({ message: "Email and profile image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            { $set: { imgImage, image: '✔️' } },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Profile image uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//ID Image
router.post('/upload-id-image', async (req, res) => {
    const { email, idimage } = req.body;
    if (!email || !idimage) {
        return res.status(400).json({ message: "Email and ID image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            { $set: { idimage, idStatus: '✔️' } },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "ID uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE student
router.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
