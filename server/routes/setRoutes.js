const express = require('express');
const router = express.Router();
const Set = require('../models/Set');

router.get('/', async (req, res) => {
    try {
        const sets = await Set.find().sort({ department: 1, year: 1, letter: 1 });
        res.json(sets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/bulk', async (req, res) => {
    const { departmentId, departmentName, yearLevel, sets } = req.body;
    try {
        await Set.deleteMany({ departmentId, year: yearLevel });
        const setsToInsert = sets.map(s => ({
            name: `Set ${s.letter}`,
            letter: s.letter,
            capacity: s.capacity,
            year: yearLevel,
            department: departmentName,
            departmentId: departmentId
        }));
        const savedSets = await Set.insertMany(setsToInsert);
        res.status(201).json(savedSets);
    } catch (err) {
        res.status(400).json({ message: "Failed to save configuration" });
    }
});

module.exports = router;