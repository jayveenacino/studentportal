const mongoose = require('mongoose');

const SetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    letter: { type: String, required: true },
    capacity: { type: Number, required: true, default: 20 },
    year: { type: String, required: true },
    department: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Set', SetSchema);