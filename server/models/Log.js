const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    user: { type: String, required: true },
    userId: { type: String },
    action: { type: String, required: true },
    type: { type: String, required: true },
    details: { type: String },
    portal: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);