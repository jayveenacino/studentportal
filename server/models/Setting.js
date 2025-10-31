import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
    {
        department: { type: String, required: true, unique: true },
        preRegister: { type: Boolean, default: false },
        activeSemester: {
            type: String,
            enum: ["1st", "2nd", "summer"],
            default: "1st",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Setting", SettingsSchema);
