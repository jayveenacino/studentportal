const mongoose = require('mongoose');

const enrolleeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    studentNumber: { type: String, required: true, unique: true },
    documentsUploaded: { type: Number, default: 0 }, 
    coursesApplied: [{ type: String }], 
    status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Enrollee', enrolleeSchema);
