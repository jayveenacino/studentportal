const express = require('express');
const Student = require('../models/Student');
const nodemailer = require('nodemailer');
const router = express.Router();

// GET: List all students with populated initialDept from selectedCourse
router.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find()
            .populate('selectedCourse', 'initialDept')  // Populate initialDept from Course model
            .exec();

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/students/:id/decline', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json({ message: 'Student declined and removed from database.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/api/students/:id/accept', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { status: 'Accepted' },
            { new: true }
        );

        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (!student.email) {
            return res.status(400).json({ message: 'Student email is missing' });
        }

        console.log(`Sending email to: ${student.email}`);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jayveemadriaganacino@gmail.com',
                pass: 'edni bnjc hcic ujad',
            },
        });

        const mailOptions = {
            from: `"KNS Admin" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: 'KNS Pre-Registration Accepted',
            html: `
        <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px;">
        <img src="https://i.imgur.com/cV0u8i4.png" alt="KNS Logo" style="width: 100px; margin-bottom: 20px;" />

        <hr>

        <h2 style="margin-bottom: 10px;">
            Hi ${student.firstname || ''} ${student.middlename || ''} ${student.lastname || ''},
        </h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
            Your pre-registration has been <strong>accepted</strong>.<br />
            Welcome to <strong>KOLEHIYO NG SUBIC</strong>!
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">
            Here is your official school portal domain. Please do not share this information with anyone:<br />
            <strong>School Domain:</strong> ${student.domainEmail || ''}<br />
            <strong>Temporary Password:</strong> 
            <span style="color: #007bff; text-decoration: underline;">
                ${student.portalPassword || ''}
            </span>
        </p>

        <p style="font-size: 14px; margin-bottom: 20px;">
            Access your student portal here:<br />
            <a href="http://localhost:3000" target="_blank" style="color: #007bff; text-decoration: underline;">
                http://localhost:3000
            </a>
        </p>

        <p style="font-size: 14px; color: #555;">
            Your journey starts here.<br />
            Keep learning and growing.<br />
            — Kolehiyo ng Subic Admissions Team
        </p>
    </div>
    `
};

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully.');

        res.json({ message: 'Student accepted and email sent.' });
    } catch (err) {
        console.error('Error in accept route:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST: Upload birth certificate image
router.post('/upload-birthcert-image', async (req, res) => {
    const { email, birthCertImage } = req.body;

    if (!email || !birthCertImage) {
        return res.status(400).json({ message: "Email and birth certificate image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            {
                $set: {
                    birthCertImage,
                    birthCert: '✔️'
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

router.post('/upload-goodmoral-image', async (req, res) => {
    const { email, goodMoralImage } = req.body;

    if (!email || !goodMoralImage) {
        return res.status(400).json({ message: "Email and good moral image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            {
                $set: {
                    goodMoralImage,
                    goodMoral: '✔️'
                }
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Good Moral uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/upload-academic-image', async (req, res) => {
    const { email, academicImage } = req.body;

    if (!email || !academicImage) {
        return res.status(400).json({ message: "Email and good moral image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            {
                $set: {
                    academicImage,
                    academic: '✔️'
                }
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Good Moral uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/upload-academic-image', async (req, res) => {
    const { email, imgImage } = req.body;

    if (!email || !imgImage) {
        return res.status(400).json({ message: "Email and good moral image are required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { email },
            {
                $set: {
                    imgImage,
                    image: '✔️'
                }
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Good Moral uploaded successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
