const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    EmpID: {
        type: String,
        uppercase: true
    },
    subject_id: {
        type: String,
    },
    subject_name: {
        type: String,
    },
    classess:{
        type: Array
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
    username:{
        type: String,
        lowercase: true
    },
    password: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: String,
    },
    school_id:{
        type: String,
    },
    status:{
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

TeacherSchema.pre('save', function(next) {
    const teacher = this;
    if (!teacher.isModified || !teacher.isNew) {
        next();
    } else {
        bcrypt.hash(teacher.password, 10, function(err, hash) {
            if (err) {
                console.log('Error hashing password for teacher', teacher.name);
                next(err);
            } else {
                teacher.password = hash;
                next();
            }
        })
    }
});

module.exports = mongoose.model('Teacher', TeacherSchema);