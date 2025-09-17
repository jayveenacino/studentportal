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

module.exports = router;
