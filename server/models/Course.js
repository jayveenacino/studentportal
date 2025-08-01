const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    department: { type: String, required: true },
    initialDept: { type: String, default: "" },  
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;
