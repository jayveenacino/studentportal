const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
    department: { type: String, required: true },
    preRegister: { type: Boolean, default: false },
    activeSemester: {
        type: String,
        enum: ["1st", "2nd", "summer"],
        default: "1st"
    },
}, { timestamps: true });

module.exports = mongoose.model("Settings", SettingsSchema);
