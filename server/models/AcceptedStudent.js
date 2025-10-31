const mongoose = require("mongoose");

function getAcademicYear() {
    const today = new Date();
    const year = today.getFullYear();
    return `${year}/${year + 1}`;
}

const AcceptedStudentSchema = new mongoose.Schema({
    preregisterPassword: { type: String },
    initialDept: { type: String },
    firstname: { type: String, required: true },
    middlename: { type: String },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    studentNumber: { type: String, unique: true, required: true },
    domainEmail: { type: String, unique: true, required: true },
    portalPassword: { type: String, required: true },
    yearLevel: { type: String, default: "1ST YEAR" },
    status: { type: String, default: "Accepted" },
    acceptedAt: { type: Date, default: Date.now },

    academicYear: { type: String, default: getAcademicYear },
    semester: {
        type: String,
        enum: ["1st Sem", "2nd Sem", "Summer"],
        default: "1st Sem",
    },
    enrollmentStatus: {
        type: String,
        enum: ["Officially Enrolled", "Not Enrolled"],
        default: "Officially Enrolled",
    },
    dateEnlisted: { type: Date, default: Date.now },
    dateEnrolled: { type: Date },

    // 🆕 ADD THIS PART
    enrollmentHistory: [
        {
            academicYear: { type: String },
            semester: { type: String },
            enrollmentStatus: { type: String },
            dateEnlisted: { type: Date },
        },
    ],
});

const AcceptedStudentModel = mongoose.model(
    "acceptedstudents",
    AcceptedStudentSchema
);
module.exports = AcceptedStudentModel;
