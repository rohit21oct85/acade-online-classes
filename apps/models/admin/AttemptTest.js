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
    
    roll_no: {
        type: String,
    },
    emp_id: {
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
    questions:{
        type: Array,
    },

    test_duration:{
        type: Number,
    },
    start_date:{
        type: Date,
    },
    test_window:{
        type: Number,
    },
    time_taken:{
        type: Number,
    },
    completion_status:{
        type: String,
    },
    extension:{
        type: String,
    },
    test_subjects :{
        type: Array,
    },
    test_name:{
        type:String,
    },
    test_type:{
        type:String,
    },
    questionLength:{
        type:String,
    },
    section:{
        type:String,
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