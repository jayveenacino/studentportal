const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const Student = require("../models/Student");
const Course = require("../models/Course");
const Department = require("../models/Department");

const backupDir = path.join(__dirname, "../backups");
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const stripIds = (array) => array.map(doc => {
    const { _id, ...rest } = doc;
    return rest;
});

// 🔹 Create JSON backup
router.post("/create", async (req, res) => {
    try {
        const date = new Date().toISOString().split("T")[0];
        const fileName = `knsdb-${date}.json`;
        const filePath = path.join(backupDir, fileName);

        const students = await Student.find().lean();
        const courses = await Course.find().lean();
        const departments = await Department.find().lean(); 

        const data = { students, courses, departments }; 
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        res.json({ success: true, file: fileName });
    } catch (err) {
        console.error("❌ Backup error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🔹 Restore JSON backup
router.post("/restore/:file", async (req, res) => {
    const file = req.params.file;
    if (!file) return res.status(400).json({ success: false, error: "No file specified" });

    const filePath = path.join(backupDir, file);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, error: "File not found" });

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    await Student.deleteMany({});
    await Course.deleteMany({});
    await Department.deleteMany({});

    if (data.students?.length) await Student.insertMany(stripIds(data.students), { ordered: false });
    if (data.courses?.length) await Course.insertMany(stripIds(data.courses), { ordered: false });
    if (data.departments?.length) await Department.insertMany(stripIds(data.departments), { ordered: false });

    res.json({ success: true, message: `Database restored from ${file}` });
});

// 🔹 List backups
router.get("/", (req, res) => {
    try {
        const files = fs.readdirSync(backupDir).map(file => {
            const stats = fs.statSync(path.join(backupDir, file));
            return { filename: file, date: stats.mtime };
        });
        res.json(files);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🔹 Download backup
router.get("/download/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Backup file not found" });
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("Error downloading file:", err);
            res.status(500).json({ error: "Failed to download file" });
        }
    });
});

// 🔹 Delete backup
router.delete("/:file", (req, res) => {
    try {
        const filePath = path.join(backupDir, req.params.file);
        if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, error: "File not found" });
        fs.unlinkSync(filePath);
        res.json({ success: true, message: "Backup deleted" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
