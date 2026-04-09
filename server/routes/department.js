const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Department = require('../models/Department');

const SALT_ROUNDS = 10;

router.get('/', async (req, res) => {
    try {
        const departments = await Department.find().sort({ createdAt: -1 });
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch departments', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found' });
        res.json(department);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching department', error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, head, username, password, status } = req.body;
    if (!name || !head) return res.status(400).json({ message: 'Name and Head are required' });

    try {
        let hashedPassword = '';
        if (password && password.trim() !== '') {
            hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const newDepartment = new Department({ 
            name, 
            head, 
            username, 
            password: hashedPassword, 
            status 
        });
        const savedDept = await newDepartment.save();
        res.status(201).json(savedDept);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create department', error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { name, head, username, password, status } = req.body;

    try {
        const updateData = { name, head, username, status };
        
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const updatedDept = await Department.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedDept) return res.status(404).json({ message: 'Department not found' });
        res.json(updatedDept);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update department', error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedDept = await Department.findByIdAndDelete(req.params.id);
        if (!deletedDept) return res.status(404).json({ message: 'Department not found' });
        res.json({ message: 'Department deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete department', error: err.message });
    }
});

router.post('/dean-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const department = await Department.findOne({ username });

        if (!department) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!department.password) {
            return res.status(401).json({ message: 'No password set for this account' });
        }

        const isMatch = await bcrypt.compare(password, department.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const deptResponse = {
            _id: department._id,
            name: department.name,
            head: department.head,
            username: department.username,
            status: department.status
        };

        res.json({ message: 'Login successful', department: deptResponse });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

module.exports = router;