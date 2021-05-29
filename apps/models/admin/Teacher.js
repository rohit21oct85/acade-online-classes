const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    class_assigned:{
        type:String
    },
    phone_no:{
        type:String
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


module.exports = mongoose.model('Teacher', TeacherSchema);