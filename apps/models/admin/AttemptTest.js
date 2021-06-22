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
    questions:{
        type: Array,
    },
    time_taken:{
        type: Number,
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