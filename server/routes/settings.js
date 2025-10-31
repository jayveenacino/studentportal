const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");
const AcceptedStudent = require("../models/AcceptedStudent");

// ✅ Get all department settings
router.get("/", async (req, res) => {
    try {
        const settings = await Settings.find();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get settings by department
router.get("/:department", async (req, res) => {
    try {
        const { department } = req.params;
        const settings = await Settings.findOne({ department });
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { department, activeSemester, preRegister } = req.body;
        if (!department) {
            return res.status(400).json({ message: "Department is required." });
        }

        const currentYear = new Date().getFullYear();
        const academicYear = `${currentYear}/${currentYear + 1}`;

        // Create a new settings record each time
        const newSetting = new Settings({
            department,
            academicYear,
            activeSemester,
            preRegister,
            createdAt: new Date(),
        });
        await newSetting.save();

        const students = await AcceptedStudent.find({ department });
        if (!students.length) {
            return res.json({
                message: `New settings created for ${department}, but no students found.`,
                settings: newSetting,
            });
        }

        const formattedSem = `${activeSemester} Sem`;
        const today = new Date();

        await Promise.all(
            students.map(async (student) => {
                let history = student.enrollmentHistory || [];

                history = history.map((h) =>
                    h.enrollmentStatus === "Open for Enrollment"
                        ? { ...h, enrollmentStatus: "Not Enlisted", dateEnlisted: today }
                        : h
                );

                const lastOfficial = history.find(
                    (h) => h.enrollmentStatus === "Officially Enrolled"
                );

                let yearForActive = lastOfficial?.academicYear || academicYear;
                const lastSem = lastOfficial?.semester?.toLowerCase();

                if (lastSem === "summer sem" && formattedSem.toLowerCase() === "1st sem") {
                    const [start, end] = yearForActive.split("/");
                    yearForActive = `${parseInt(start) + 1}/${parseInt(end) + 1}`;
                }

                const exists = history.some(
                    (h) =>
                        h.academicYear === yearForActive &&
                        h.semester.toLowerCase() === formattedSem.toLowerCase()
                );

                if (!exists) {
                    history.unshift({
                        academicYear: yearForActive,
                        semester: formattedSem,
                        enrollmentStatus: "Open for Enrollment",
                        dateEnlisted: today,
                        dateEnrolled: "",
                    });
                }

                student.enrollmentHistory = history;
                student.semester = activeSemester;
                await student.save();
            })
        );

        res.json({
            success: true,
            message: `New setting created — ${department} students updated to ${activeSemester} semester.`,
            settings: newSetting,
        });
    } catch (err) {
        console.error("Error creating new settings:", err);
        res.status(500).json({ message: "Failed to create new settings", error: err.message });
    }
});


module.exports = router;
