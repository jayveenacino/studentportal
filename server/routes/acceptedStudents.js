const express = require("express");
const router = express.Router();
const AcceptedStudent = require("../models/AcceptedStudent");

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


module.exports = router;
