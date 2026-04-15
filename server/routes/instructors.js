const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');

router.get('/', async (req, res) => {
    try {
        const instructors = await Instructor.find()
            .select('name department status createdAt')
            .sort({ createdAt: -1 })
            .lean();
        res.json(instructors);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/:id/image', async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id).select('profileImage');
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json({ profileImage: instructor.profileImage });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json(instructor);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, department, status, profileImage } = req.body;
        const newInstructor = new Instructor({
            name,
            department,
            status: status || 'Active',
            profileImage: profileImage || ''
        });
        const savedInstructor = await newInstructor.save();
        res.status(201).json(savedInstructor);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, department, status, profileImage } = req.body;
        const updatedInstructor = await Instructor.findByIdAndUpdate(
            req.params.id,
            { name, department, status, profileImage },
            { new: true, runValidators: true }
        );
        if (!updatedInstructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json(updatedInstructor);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedInstructor = await Instructor.findByIdAndDelete(req.params.id);
        if (!deletedInstructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json({ message: 'Instructor deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;