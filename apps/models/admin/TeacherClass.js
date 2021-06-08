const mongoose = require('mongoose');

const TeacherClassSchema = new mongoose.Schema({
    teacher_id: {
      type: String,
      required: true
    },
    school_id:{
      type: String,
      required: true
    },
    class_id: {
      type: String,
      required: true
    },
    school_name: {
      type: String,
      required: true
    },
    class_name: {
      type: String,
      required: true
    },
    teacher_name: {
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

module.exports = mongoose.model('TeacherClass', TeacherClassSchema);