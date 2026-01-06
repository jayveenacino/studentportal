const express = require('express');
const router = express.Router();
const Classrooms = require('../models/Classrooms'); 

// GET all classrooms
router.get("/", async (req, res) => {
    try {
        const classrooms = await Classrooms.find().sort({ createdAt: -1 });
        res.json(classrooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// CREATE a new classroom
router.post("/", async (req, res) => {
    try {
        const newClassroom = new Classrooms(req.body);
        await newClassroom.save();
        res.status(201).json(newClassroom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE a classroom
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

// DELETE a classroom
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Classrooms.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Classroom not found" });
        res.json({ message: "Classroom deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
