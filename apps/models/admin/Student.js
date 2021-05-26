const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    student_name: {
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
    status:{
        type: Boolean,
        default: false
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Student', StudentSchema);