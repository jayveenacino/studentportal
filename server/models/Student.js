const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    firstname: String,
    middlename: String,
    lastname: String,
    extension: String,
    birthdate: String,
    phone: String,
    register: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    conpassword: String,
    studentNumber: String,
    image: { type: String },
    birthplace: { type: String },
    civil: { type: String },
    sex: { type: String },
    orientation: { type: String },
    gender: { type: String },
    citizenship: { type: String },
    religion: { type: String },
    region: { type: String },
    province: { type: String },
    city: { type: String },
    barangay: { type: String },
    disability: { type: String },
    disabilityCategory: { type: String },
    disabilityDetails: { type: String },
});

const StudentModel = mongoose.model("students", StudentSchema);
module.exports = StudentModel;
