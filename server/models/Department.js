const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    head: { type: String, required: true, trim: true },
    username: { type: String, trim: true, default: '' },
    password: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema, 'departments');