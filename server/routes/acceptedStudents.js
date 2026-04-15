const express = require("express");
const router = express.Router();
const AcceptedStudent = require("../models/AcceptedStudent");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Simple in-memory cache for successful logins
const loginCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(studentNumber, password) {
    return crypto.createHash("sha256").update(studentNumber + ":" + password).digest("hex");
}

// Cleanup expired cache entries every minute
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of loginCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            loginCache.delete(key);
        }
    }
}, 60000);

router.get("/api/acceptedstudents", async (req, res) => {
    try {
        const students = await AcceptedStudent.find().lean();
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

router.post("/api/acceptedstudents/login", async (req, res) => {
    try {
        const { studentNumber, portalPassword } = req.body;
        if (!studentNumber || !portalPassword) {
            return res.status(400).json({ message: "Student number and password required" });
        }

        // Check cache first (instant return for repeated logins)
        const cacheKey = getCacheKey(studentNumber, portalPassword);
        const cached = loginCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return res.json({ student: cached.student });
        }

        // Use lean() for faster queries and select only needed fields
        const student = await AcceptedStudent.findOne({ studentNumber })
            .select("+portalPassword")
            .lean();

        if (!student) {
            return res.status(401).json({ message: "Student not found" });
        }

        // bcryptjs compare
        const isMatch = await bcrypt.compare(portalPassword, student.portalPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Remove password from response
        const { portalPassword: _, ...studentWithoutPassword } = student;

        // Cache successful login
        loginCache.set(cacheKey, {
            student: studentWithoutPassword,
            timestamp: Date.now()
        });

        return res.json({ student: studentWithoutPassword });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/api/acceptedstudents/:id/change-password", async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new password required" });
        }

        const student = await AcceptedStudent.findById(req.params.id)
            .select("+portalPassword");

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

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
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;