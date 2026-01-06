const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({

    //!Profile
    registerNumber: { type: String, unique: true, required: true },
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
    domainEmail: String,
    portalPassword: String,

    idimage: { type: String },
    birthCertImage: { type: String },
    goodMoralImage: { type: String },
    academic: { type: String },
    image: { type: String },

    validId: { type: String, default: '❌' },
    birthCert: { type: String, default: '❌' },
    goodMoral: { type: String, default: '❌' },
    academicImage: { type: String, default: "" },
    profileImage: { type: String, default: '❌' },

    birthplace: { type: String },
    civil: { type: String },
    sex: { type: String },
    citizenship: { type: String },
    religion: { type: String },
    region: { type: String },
    province: { type: String },
    city: { type: String },
    barangay: { type: String },
    disability: { type: String },
    disabilityCategory: { type: String },
    disabilityDetails: { type: String },

    //!Education
    selectedCourse: { type: String },
    selectedSecCourse: { type: String },
    initialDept: { type: String },
    scholar: { type: String },
    otherScholar: { type: String },
    elementary: { type: String },
    elemYear: { type: String },
    highschool: { type: String },
    highYear: { type: String },
    schoolType: { type: String },
    strand: { type: String },
    lrn: { type: String },
    honor: { type: String },
    college: { type: String },
    technical: { type: String },
    certificate: { type: String },
    course: { type: String },
    year: { type: String },
    program: { type: String },
    yearCom: { type: String },
    achivements: { type: String },

    //!Family
    fatName: { type: String },
    fatMidName: { type: String },
    fatLastName: { type: String },
    fatExt: { type: String },
    motName: { type: String },
    motMidName: { type: String },
    motLastName: { type: String },
    broNum: { type: String },
    sisNum: { type: String },
    guarName: { type: String },
    guarRelationship: { type: String },
    guarAddress: { type: String },
    guarEmail: { type: String },
    guarTel: { type: String },

    //!student aprroval
    studentyear: { type: String },
    isAccepted: { type: Boolean, default: false }
});

const StudentModel = mongoose.model("students", StudentSchema);
module.exports = StudentModel;