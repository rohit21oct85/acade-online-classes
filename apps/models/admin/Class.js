const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    school_id: {
        type: 'string', 
    },
    teacher_id:{
        type: String,
    },
    class_name: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Class', ClassSchema);