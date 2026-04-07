const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

router.get("/", async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ createdAt: -1 });
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const subjectData = {
            code: req.body.code,
            name: req.body.name,
            department: req.body.department,
            units: req.body.units ? Number(req.body.units) : 3,
            semester: req.body.semester || "1st Sem",
            yearLevel: req.body.yearLevel || "1st Year",
            price: req.body.price !== "" && req.body.price !== undefined ? Number(req.body.price) : 0,
            prerequisite: req.body.prerequisite && req.body.prerequisite !== "" ? req.body.prerequisite : null
        };

        const newSubject = new Subject(subjectData);
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updateData = {
            code: req.body.code,
            name: req.body.name,
            department: req.body.department,
            units: req.body.units ? Number(req.body.units) : 3,
            semester: req.body.semester || "1st Sem",
            yearLevel: req.body.yearLevel || "1st Year",
            price: req.body.price !== "" && req.body.price !== undefined ? Number(req.body.price) : 0,
            prerequisite: req.body.prerequisite && req.body.prerequisite !== "" ? req.body.prerequisite : null
        };

        const updated = await Subject.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;