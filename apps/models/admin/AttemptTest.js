const mongoose = require('mongoose');

const AttemptTestSchema = new mongoose.Schema({
    school_id: {
        type: String,
    },
    test_id: {
            type: String,
    },
    student_id: {
            type: String,
    },
    student_name: {
            type: String,
    },
    subject_id: {
            type: String,
    },
    class_id: {
            type: String,
    },
    subject_name: {
            type: String,
    },
    student_roll_no: {
            type: String,
    },
    student_emp_id: {
            type: String,
    },
    questions:{
        type: Array,
    },
    time_taken:{
        type: Number,
    },
    completion_status:{
        type: String,
    },
    test_subjects :{
            type: Array,
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


module.exports = mongoose.model('AttemptTest', AttemptTestSchema);