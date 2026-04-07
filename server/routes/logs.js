const mongoose = require('mongoose');
const Log = require('../models/Log');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const logs = await Log.find().sort({ date: -1 });
            res.json(logs);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else if (req.method === 'POST') {
        try {
            const newLog = new Log({
                user: req.body.user,
                userId: req.body.userId,
                action: req.body.action,
                type: req.body.type,
                details: req.body.details,
                portal: req.body.portal,
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent']
            });
            await newLog.save();
            res.status(201).json(newLog);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};