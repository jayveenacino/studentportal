const mongoose = require('mongoose');

const adminConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/admin_db');


const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    head: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const AdminData = adminConnection.model('Department', departmentSchema);
module.exports = AdminData;
