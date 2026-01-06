const express = require("express");
const Chat = require("../models/Chat");

const router = express.Router();

// GET chat by studentId
router.get("/:studentId", async (req, res) => {
    const { studentId } = req.params;

    try {
        let chat = await Chat.findOne({ studentId });

        if (!chat) {
            chat = await Chat.create({ studentId, messages: [] });
        }

        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: "Failed to load chat" });
    }
});

// POST message (admin or student)
router.post("/:studentId", async (req, res) => {
    const { studentId } = req.params;
    const { sender, text } = req.body;

    try {
        const chat = await Chat.findOneAndUpdate(
            { studentId },
            { $push: { messages: { sender, text } } },
            { new: true, upsert: true }
        );

        res.json(chat);
    } catch (err) {
        res.status(500).json({ message: "Failed to send message" });
    }
});

router.post("/:studentId/read", async (req, res) => {
    const { studentId } = req.params;

    const chat = await Chat.findOne({ studentId });
    if (chat) {
        chat.messages.forEach(msg => {
            if (msg.sender === "admin") msg.readByStudent = true;
        });
        await chat.save();
    }

    res.json({ success: true });
});

module.exports = router;
