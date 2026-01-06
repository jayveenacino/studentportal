const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ["admin", "student"],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    readByStudent: {
        type: Boolean,
        default: false, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const chatSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        unique: true,
    },
    messages: [messageSchema],
});

module.exports = mongoose.model("Chat", chatSchema);
