const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);