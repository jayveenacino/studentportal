const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');

router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find().sort({ createdAt: -1 });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { instructorId, subjectCode, subjectName, set, time, date, room } = req.body;
        
        const subjectConflict = await Schedule.findOne({
            set,
            subjectCode
        });
        
        if (subjectConflict) {
            return res.status(409).json({ 
                error: `Set ${set} already has ${subjectName} scheduled with ${subjectConflict.instructorName}` 
            });
        }
        
        const roomConflict = await Schedule.findOne({
            room,
            time,
            date
        });
        
        if (roomConflict) {
            return res.status(409).json({ 
                error: `Room ${room} is already booked at ${time} on ${date} by ${roomConflict.instructorName} for ${roomConflict.subjectName}` 
            });
        }
        
        const instructorConflict = await Schedule.findOne({
            instructorId,
            time,
            date
        });
        
        if (instructorConflict) {
            return res.status(409).json({ 
                error: `Instructor already has a class at ${time} on ${date} (${instructorConflict.subjectName} in ${instructorConflict.room})` 
            });
        }
        
        const setTimeConflict = await Schedule.findOne({
            set,
            time,
            date
        });
        
        if (setTimeConflict) {
            return res.status(409).json({ 
                error: `Set ${set} already has a class at ${time} on ${date} (${setTimeConflict.subjectName} with ${setTimeConflict.instructorName})` 
            });
        }

        const newSchedule = new Schedule(req.body);
        await newSchedule.save();
        res.status(201).json(newSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { instructorId, subjectCode, subjectName, set, time, date, room } = req.body;
        const scheduleId = req.params.id;
        
        const subjectConflict = await Schedule.findOne({
            _id: { $ne: scheduleId },
            set,
            subjectCode
        });
        
        if (subjectConflict) {
            return res.status(409).json({ 
                error: `Set ${set} already has ${subjectName} scheduled with ${subjectConflict.instructorName}` 
            });
        }
        
        const roomConflict = await Schedule.findOne({
            _id: { $ne: scheduleId },
            room,
            time,
            date
        });
        
        if (roomConflict) {
            return res.status(409).json({ 
                error: `Room ${room} is already booked at ${time} on ${date} by ${roomConflict.instructorName}` 
            });
        }
        
        const instructorConflict = await Schedule.findOne({
            _id: { $ne: scheduleId },
            instructorId,
            time,
            date
        });
        
        if (instructorConflict) {
            return res.status(409).json({ 
                error: `Instructor already has a class at ${time} on ${date}` 
            });
        }
        
        const setTimeConflict = await Schedule.findOne({
            _id: { $ne: scheduleId },
            set,
            time,
            date
        });
        
        if (setTimeConflict) {
            return res.status(409).json({ 
                error: `Set ${set} already has a class at ${time} on ${date}` 
            });
        }

        const updatedSchedule = await Schedule.findByIdAndUpdate(
            scheduleId,
            req.body,
            { new: true }
        );
        if (!updatedSchedule) return res.status(404).json({ error: "Schedule not found" });
        res.json(updatedSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Schedule.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Schedule not found" });
        res.json({ message: "Schedule deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;