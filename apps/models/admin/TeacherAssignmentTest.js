const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeacherAssignmentTestSchema = new mongoose.Schema({
    class_id: {
        type: String,
    },
    unit_id: {
        type: String,
    },
    chapter_id: {
        type: String,
    },
    totalQuestions: {
        type: String,
    },
    answers:{
        type: Array
    },
    extension: {
        type: String,
    },
    questionDocs: {
        type: Array,
    },
    start_date:{
        type: Date,
    },
    status:{
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TeacherAssignmentTest', TeacherAssignmentTestSchema);