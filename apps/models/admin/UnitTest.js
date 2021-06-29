const mongoose = require('mongoose');

const UnitTestSchema = new mongoose.Schema({
      test_name: {
            type: String,
      },
      test_slug: {
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
      
      unit_id: {
            type: String,
      },
      unit_name: {
            type: String,
      },
      test_duration: {
            type: String,
      },
      test_window: {
            type: String,
      },
      total_question: {
            type: Number,
      },

      test_question: {
            type: Array,
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


module.exports = mongoose.model('UnitTest', UnitTestSchema);