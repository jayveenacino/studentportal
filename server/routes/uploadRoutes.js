const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upload = require("../models/Upload");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
});

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { title, caption } = req.body;
        const updateData = { title, caption };

        if (req.file) {
            updateData.filename = req.file.filename;
        }

        const updated = await Upload.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Announcement not found." });
        }

        res.json({ success: true, message: "Announcement updated successfully!", updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Update failed" });
    }
});


router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title, caption } = req.body;
        const filename = req.file ? req.file.filename : null;

        if (!title || !filename) {
            return res.status(400).json({ message: "Title and image are required." });
        }

        const newUpload = new Upload({
            title,
            caption: caption || "", 
            filename
        });

        await newUpload.save();
        res.json({ message: "Announcement posted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
});


router.get("/", async (req, res) => {
    try {
        const uploads = await Upload.find().sort({ date: -1 });
        res.json(uploads);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch uploads." });
    }
});

router.delete("/:filename", async (req, res) => {
    try {
        const { filename } = req.params;
        const upload = await Upload.findOneAndDelete({ filename });

        if (!upload) return res.status(404).json({ message: "File not found." });

        const filePath = path.join("uploads", filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.json({ message: "Announcement deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete file." });
    }
});

module.exports = router;
