const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// GET all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find().sort({ createdAt: -1 });
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch departments', error: err.message });
    }
});

// GET a single department by ID
router.get('/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found' });
        res.json(department);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching department', error: err.message });
    }
});

// CREATE a new department
router.post('/', async (req, res) => {
    const { name, head, status } = req.body;
    if (!name || !head) return res.status(400).json({ message: 'Name and Head are required' });

    try {
        const newDepartment = new Department({ name, head, status });
        const savedDept = await newDepartment.save();
        res.status(201).json(savedDept);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create department', error: err.message });
    }
});

// UPDATE a department
router.put('/:id', async (req, res) => {
    const { name, head, status } = req.body;

    try {
        const updatedDept = await Department.findByIdAndUpdate(
            req.params.id,
            { name, head, status },
            { new: true, runValidators: true }
        );
        if (!updatedDept) return res.status(404).json({ message: 'Department not found' });
        res.json(updatedDept);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update department', error: err.message });
    }
});

// DELETE a department
router.delete('/:id', async (req, res) => {
    try {
        const deletedDept = await Department.findByIdAndDelete(req.params.id);
        if (!deletedDept) return res.status(404).json({ message: 'Department not found' });
        res.json({ message: 'Department deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete department', error: err.message });
    }
});

module.exports = router;
