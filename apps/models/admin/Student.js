const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name:{
        type: String,
    },
    class_id:{
        type:String
    },
    class_name:{
        type:String
    },
    guardian_name:{
        type:String
    },
    guardian_phone_no:{
        type:String
    },
    school_id:{
        type:String
    },
    username:{
        type: String
    },
    password:{
        type: String,
    },
    status:{
        type: Boolean,
        default: false
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
                console.log('Error hashing password for student', student.first_name);
                next(err);
            } else {
                student.password = hash;
                next();
            }
        })
    }
});

module.exports = mongoose.model('Student', StudentSchema);