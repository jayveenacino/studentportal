const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/AdminSchema");

router.post("/adminusers", async (req, res) => {
    try {
        const { username, email, password, role, pin } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const userData = { 
            username, 
            email, 
            password: hashedPassword,
            role 
        };
        
        // Only ADMIN role gets PIN - PLAIN TEXT (NOT HASHED)
        if (role === "ADMIN" && pin) {
            userData.pin = pin; // NO bcrypt.hash() - plain text
        }

        const newAdmin = new Admin(userData);
        await newAdmin.save();

        const { password: _, ...safeData } = newAdmin.toObject();
        res.status(201).json({ message: "Admin created successfully", newAdmin: safeData });
    } catch (error) {
        console.error("Error creating admin:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/adminusers", async (req, res) => {
    try {
        const admins = await Admin.find().select("-password");
        res.status(200).json(admins);
    } catch (error) {
        console.error("Error fetching admins:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/adminusers/:id", async (req, res) => {
    try {
        const deleted = await Admin.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Error deleting admin:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/adminusers/:id", async (req, res) => {
    try {
        const updateData = { ...req.body };
        const saltRounds = 10;
        
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }
        
        // PIN stays plain text - no hashing here either
        if (updateData.pin) {
            // Keep as plain text
        }
        
        const updated = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
        res.status(200).json({ message: "Admin updated successfully", updated });
    } catch (error) {
        console.error("Error updating admin:", error.message);
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

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const { password: _, ...safeAdmin } = admin.toObject();

        res.status(200).json({
            message: "Login successful",
            admin: safeAdmin
        });
    } catch (error) {
        console.error("Error logging in admin:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/verify-pin", async (req, res) => {
    try {
        const { pin } = req.body;
        
        if (!pin) {
            return res.status(400).json({ valid: false, message: "PIN is required" });
        }
        
        // Find the ADMIN user to get their PIN
        const adminUser = await Admin.findOne({ role: "ADMIN" });
        
        if (!adminUser || !adminUser.pin) {
            return res.status(400).json({ valid: false, message: "Admin PIN not set" });
        }
        
        // Compare plain text PINs directly (NO bcrypt.compare)
        const isValid = pin === adminUser.pin;
        
        if (!isValid) {
            return res.status(400).json({ valid: false, message: "Invalid PIN" });
        }
        
        res.json({ valid: true });
    } catch (error) {
        console.error("Error verifying PIN:", error.message);
        res.status(500).json({ valid: false, message: "Server error" });
    }
});

module.exports = router;