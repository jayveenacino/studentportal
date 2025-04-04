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

    // Fill-up form fields
    birthplace: String,
    civilStatus: String,
    sexAtBirth: String,
    sexualOrientation: String,
    genderIdentity: String,
    citizenship: String,
    religion: String,

    region: String,
    province: String,
    city: String,
    barangay: String,
    street: String,
    zipCode: String,

    isDisabled: String,
    disabilityCategory: String,
    disabilityDetails: String
});

const StudentModel = mongoose.model("students", StudentSchema);
module.exports = StudentModel;
