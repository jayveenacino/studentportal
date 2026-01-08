const express = require("express");
const router = express.Router();
const AcceptedStudent = require("../models/AcceptedStudent");
const bcrypt = require("bcrypt");

router.get("/api/acceptedstudents", async (req, res) => {
    try {
        const students = await AcceptedStudent.find();
        res.json(students);
    } catch (err) {
        console.error("Error fetching accepted students:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/api/acceptedstudents/:id/accept", async (req, res) => {
    try {
        const student = await AcceptedStudent.findById(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        if (!student.dateEnlisted) {
            student.dateEnlisted = new Date();
        }

        student.academicYear = req.body.academicYear || student.academicYear || "2025/2026";
        student.semester = req.body.semester || student.semester || "1st Sem";
        student.enrollmentStatus = "Officially Enrolled";

        if (!student.dateEnrolled) student.dateEnrolled = new Date();

        const updated = await student.save();
        return res.json({ message: "Student officially enrolled", student: updated });
    } catch (err) {
        console.error("Error enrolling student:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

router.put("/api/acceptedstudents/:id/change-password", async (req, res) => {
    try {
        const { newPassword } = req.body;
        const studentId = req.params.id;

        if (!newPassword) {
            return res.status(400).json({ error: "New password is required." });
        }

        const student = await AcceptedStudent.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        student.portalPassword = hashedPassword;
        student.isPasswordChanged = true;

        const updated = await student.save();
        res.json({ message: "Password updated successfully.", student: updated });
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({ error: "Server error." });
    }
});

router.post("/api/acceptedstudents/login", async (req, res) => {
    try {
        const { studentNumber, portalPassword } = req.body;
        const student = await AcceptedStudent.findOne({ studentNumber });

        if (!student) return res.status(401).json({ message: "Student not found" });
        if (student.portalPassword !== portalPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        return res.json({ student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
