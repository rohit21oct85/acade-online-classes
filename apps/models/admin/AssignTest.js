const mongoose = require('mongoose');

const AssignTestSchema = new mongoose.Schema({
      school_id: {
            type: String,
      },
      school_name: {
            type: String,
      },
      test_id: {
            type: String,
      },
      teacher_id: {
            type: String,
      },
      teacher_name: {
            type: String,
      },
      class_id: {
            type: String,
      },
      class_name: {
            type: String,
      },
      subject_id: {
            type: String,
      },
      subject_name: {
            type: String,
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


module.exports = mongoose.model('AssignTest', AssignTestSchema);