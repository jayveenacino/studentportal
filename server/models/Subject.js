const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    units: { type: Number, default: 3 },
    semester: { type: String, default: "1st Sem" },
    yearLevel: { type: String, default: "1st Year" },
    price: { type: Number, default: 0 },
    prerequisite: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);