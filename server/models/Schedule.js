const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    instructorId: { type: String, required: true },
    instructorName: { type: String, required: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    set: { type: String, default: "" },
    time: { type: String, required: true },
    date: { type: String, required: true },
    room: { type: String, required: true },
    department: { type: String, required: true },
    deptCode: { type: String, default: "" }
}, { timestamps: true });

const ScheduleModel = mongoose.model('Schedule', scheduleSchema);

module.exports = ScheduleModel;