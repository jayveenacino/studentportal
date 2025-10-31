const express = require("express");
const router = express.Router();
const AcceptedStudent = require("../models/AcceptedStudent");
const Settings = require("../models/Settings");

router.get("/:email", async (req, res) => {
    try {
        const email = req.params.email?.trim().toLowerCase();
        if (!email) return res.status(400).json({ message: "Email is required" });

        const student = await AcceptedStudent.findOne({ domainEmail: email });
        if (!student) return res.status(404).json([]);

        const settings = await Settings.findOne();
        const activeSem = settings?.activeSemester?.trim();
        if (!activeSem) return res.json(student.enrollmentHistory || []);

        let history = student.enrollmentHistory || [];
        const formattedActiveSem = `${activeSem} Sem`;
        const today = new Date();

        if (history.length === 0) {
            history.push({
                academicYear: student.academicYear || `${today.getFullYear()}/${today.getFullYear() + 1}`,
                semester: formattedActiveSem,
                enrollmentStatus: "Open for Enrollment",
                dateEnlisted: null,
                dateEnrolled: "",
            });

            student.enrollmentHistory = history;
            await student.save();
            return res.json(history);
        }

        // ... rest of your logic for existing students

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
