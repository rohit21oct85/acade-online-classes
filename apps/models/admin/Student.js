const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    class: {
        type: String,
    },
    section: {
        type: String,
    },
    roll_no: {
        type: String,
    },
    mobile: {
        type: String,
    },
    class_id:{
        type:String
    },
    school_id:{
        type:String
    },
    username:{
        type: String
    },
    school_section:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String,
    },
    address:{
        type: String,
    },
    EmpId:{
        type: String,
        uppercase: true,
    },
    city:{
        type: String,
    },
    state:{
        type: String,
    },
    pincode:{
        type: String,
    },
    status:{
        type: String,
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});


StudentSchema.pre('save', function(next) {
    const student = this;
    if (!student.isModified || !student.isNew) {
        next();
    } else {
        bcrypt.hash(student.password, 10, function(err, hash) {
            if (err) {
                console.log('Error hashing password for student', student.name);
                next(err);
            } else {
                student.password = hash;
                next();
            }
        })
    }
});

module.exports = mongoose.model('Student', StudentSchema);