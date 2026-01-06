const mongoose = require('mongoose');

const classroomsSchema = new mongoose.Schema({
        room: { type: String, required: true },
        subject: { type: String, required: true },
        day: { type: String, default: "" },  
        time: { type: String, default: "" },  
    }, { timestamps: true });

    const ClassroomsModel = mongoose.model('Classrooms', classroomsSchema);

    module.exports = ClassroomsModel;