const express = require('express');
const router = express.Router();
const Classrooms = require('../models/Classrooms'); 

router.get("/", async (req, res) => {
    try {
        const classrooms = await Classrooms.find().sort({ createdAt: -1 });
        res.json(classrooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newClassroom = new Classrooms(req.body);
        await newClassroom.save();
        res.status(201).json(newClassroom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedClassroom = await Classrooms.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedClassroom) return res.status(404).json({ error: "Classroom not found" });
        res.json(updatedClassroom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Classrooms.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Classroom not found" });
        res.json({ message: "Classroom deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this temporary route to clear old data
router.post("/clear-old", async (req, res) => {
    try {
        await Classrooms.deleteMany({});
        res.json({ message: "All classrooms cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;