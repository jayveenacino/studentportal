const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

router.get("/student/by-domain/:domainEmail", async (req, res) => {
    try {
        const { domainEmail } = req.params;

        const student = await Student.findOne({ domainEmail });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Error fetching student by domain:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
