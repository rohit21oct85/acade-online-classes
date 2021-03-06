const mongoose = require('mongoose');

const TeacherSubjectSchema = new mongoose.Schema({
    teacher_id: {
      type: String,
      required: true
    },
    school_id:{
      type: String,
      required: true
    },
    subject_id: {
      type: String,
      required: true
    },
    school_name: {
      type: String,
      required: true
    },
    subject_name: {
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

module.exports = mongoose.model('TeacherSubject', TeacherSubjectSchema);