const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

// Get settings for a specific department
router.get("/:department", async (req, res) => {
    try {
        const { department } = req.params;
        const settings = await Settings.findOne({ department });
        if (!settings) return res.status(404).json({ message: "Settings not found" });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create or update settings for a department
router.post("/", async (req, res) => {
    try {
        const { department, activeSemester, preRegister, time } = req.body;

        let settings = await Settings.findOne({ department });
        if (!settings) {
            settings = await Settings.create({ department, activeSemester, preRegister, time });
        } else {
            settings.activeSemester = activeSemester;
            settings.preRegister = preRegister;
            settings.time = time;
            await settings.save();
        }

        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
