const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    caption: { type: String, required: true },
    filename: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Upload", uploadSchema);
