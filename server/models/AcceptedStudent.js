const mongoose = require("mongoose");

const AcceptedStudentSchema = new mongoose.Schema({
    preregisterPassword: { type: String },
    initialDept: { type: String },

    firstname: { type: String, required: true },
    middlename: { type: String },
    lastname: { type: String, required: true },
    email: { type: String, required: true },

    studentNumber: { type: String, unique: true, required: true },
    domainEmail: { type: String, unique: true, required: true },
    portalPassword: { type: String, required: true }, // H password

    yearLevel: { type: String, default: "1ST YEAR" }, 

    status: { type: String, default: "Accepted" },
    acceptedAt: { type: Date, default: Date.now }
});

const AcceptedStudentModel = mongoose.model("acceptedstudents", AcceptedStudentSchema);
module.exports = AcceptedStudentModel;
