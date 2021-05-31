const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subject_name: {
        type: String,
    },
    school_id:{
        type: String,
    },
    subject_slug:{
        type: String
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


module.exports = mongoose.model('Subject', SubjectSchema);