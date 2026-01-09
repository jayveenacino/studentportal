const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    units: { type: Number, default: 3 },
    semester: { type: String, default: "1" },
    yearLevel: { type: String, default: "1" }
}, { timestamps: true });

module.exports = mongoose.model("Subject", SubjectSchema);
