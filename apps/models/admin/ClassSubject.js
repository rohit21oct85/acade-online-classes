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