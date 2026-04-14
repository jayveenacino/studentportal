const mongoose = require('mongoose');

const classroomsSchema = new mongoose.Schema({
    room: { type: String, required: true },
    department: { type: String, required: true, default: "General" }
}, { timestamps: true });

const ClassroomsModel = mongoose.model('Classrooms', classroomsSchema);

module.exports = ClassroomsModel;