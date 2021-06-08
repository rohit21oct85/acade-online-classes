const mongoose = require('mongoose');

const ClassSubjectSchema = new mongoose.Schema({
    class_id: {
        type: String,
        required: true
     },
     subject_id: {
        type: String,
        required: true
    },
    subject_name:{
        type: String,
        required: true
    },
    class_name:{
        type: String,
        required: true
    },
    // school_id:{
    //     type: String,
    //     required: true
    //   },
    // school_name: {
    //     type: String,
    //     required: true
    // },
    status:{
        type: Boolean,
        default: true
    },
     created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClassSubject', ClassSubjectSchema);