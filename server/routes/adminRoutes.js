const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/AdminSchema");

router.post("/adminusers", async (req, res) => {
    try {
        const { username, email, password, role, pin } = req.body;
        console.log("Received:", req.body);
        console.log("PIN received:", pin);
        console.log("Role received:", role);

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const userData = { 
            username, 
            email, 
            password, 
            role 
        };
        
        // Check if role requires PIN
        const rolesRequiringPin = ["ADMIN", "REGISTRAR", "ENCODER", "EVALUATOR"];
        console.log("Role requires PIN?", rolesRequiringPin.includes(role));
        console.log("PIN provided?", !!pin);
        
        if (pin && rolesRequiringPin.includes(role)) {
            console.log("Hashing PIN...");
            const saltRounds = 10;
            userData.pin = await bcrypt.hash(pin, saltRounds);
            console.log("Hashed PIN:", userData.pin);
        }

        console.log("Final userData:", userData);

        const newAdmin = new Admin(userData);
        await newAdmin.save();

        res.status(201).json({ message: "Admin created successfully", newAdmin });
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/adminusers", async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        console.error("❌ Error fetching admins:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/adminusers/:id", async (req, res) => {
    try {
        const deleted = await Admin.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting admin:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/adminusers/:id", async (req, res) => {
    try {
        const updated = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Admin updated successfully", updated });
    } catch (error) {
        console.error("❌ Error updating admin:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/adminlogin", async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        const admin = await Admin.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.password !== password) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        res.status(200).json({
            message: "Login successful",
            admin
        });
    } catch (error) {
        console.error("❌ Error logging in admin:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/verify-pin", async (req, res) => {
    try {
        const { userId, pin } = req.body;
        
        const user = await Admin.findById(userId);
        if (!user) return res.status(404).json({ valid: false, message: "User not found" });
        
        if (!user.pin) {
            return res.status(400).json({ valid: false, message: "PIN not set for this user" });
        }
        
        const valid = await bcrypt.compare(pin, user.pin);
        res.json({ valid });
    } catch (error) {
        console.error("❌ Error verifying PIN:", error.message);
        res.status(500).json({ valid: false, message: "Server error" });
    }
});

module.exports = router;