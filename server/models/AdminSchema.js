const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["ADMIN", "REGISTRAR"],
            default: "ADMIN",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
