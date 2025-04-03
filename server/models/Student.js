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
    });

    const StudentModel = mongoose.model("students", StudentSchema);
    module.exports = StudentModel; 
