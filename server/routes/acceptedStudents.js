const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const AcceptedStudent = require("../models/AcceptedStudent");
const StudentModel = require("../models/Student");
const bcrypt = require("bcryptjs");

router.get("/api/acceptedstudents", async (req, res) => {
    try {
        const students = await AcceptedStudent.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
});

router.put("/api/students/:id/accept", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid student ID format" });
        }

        const student = await StudentModel.findById(req.params.id);
        
        if (!student) {
            return res.status(404).json({ error: "Student not found in pre-registration" });
        }

        if (!student.selectedCourse && !student.initialDept) {
            return res.status(400).json({ message: "Student has not chosen a course" });
        }

        const studentNumber = `2025${Math.floor(100000 + Math.random() * 900000)}`;
        const plainPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const studentData = student.toObject();
        delete studentData._id;

        const acceptedStudent = new AcceptedStudent({
            ...studentData,
            studentNumber: studentNumber,
            portalPassword: hashedPassword,
            enrollmentStatus: "Officially Enrolled",
            dateEnlisted: new Date(),
            dateEnrolled: new Date(),
            academicYear: req.body.academicYear || "2025/2026",
            semester: req.body.semester || "1st Sem",
            acceptedAt: new Date()
        });

        await acceptedStudent.save();
        await StudentModel.findByIdAndDelete(req.params.id);

        res.json({ 
            message: "Student accepted and enrolled successfully", 
            student: acceptedStudent,
            credentials: {
                studentNumber: studentNumber,
                plainPassword: plainPassword
            }
        });

    } catch (err) {
        res.status(500).json({ 
            error: "Server error", 
            message: err.message 
        });
    }
});

router.delete("/api/students/:id/decline", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid student ID format" });
        }

        const student = await StudentModel.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        
        res.json({ message: "Student declined and removed from pre-registration" });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
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
        return res.status(500).json({ error: "Server error", message: err.message });
    }
});

router.delete("/api/acceptedstudents/:id", async (req, res) => {
    try {
        const student = await AcceptedStudent.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/api/acceptedstudents/login", async (req, res) => {
    try {
        const { studentNumber, portalPassword } = req.body;
        const student = await AcceptedStudent.findOne({ studentNumber });

        if (!student) return res.status(401).json({ message: "Student not found" });
        
        const isMatch = await bcrypt.compare(portalPassword, student.portalPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        return res.json({ student });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/api/acceptedstudents/:id/change-password", async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new password required" });
        }

        const student = await AcceptedStudent.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const isMatch = await bcrypt.compare(oldPassword, student.portalPassword);
        if (!isMatch) {
            return res.status(403).json({ message: "Old password is incorrect" });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        student.portalPassword = hash;
        student.isPasswordChanged = true;
        await student.save();

        res.json({ message: "Password updated successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;